
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adminClient } from "@/lib/supabase/admin";
import {
  midtransApiUrl,
  midtransAuth,
} from "@/lib/payments/midtrans";

export const runtime = "nodejs";

type CheckoutBody = {
  productId?: string;
  quantity?: number;
  recipientName?: string;
  recipientPhone?: string;
  shippingAddress?: string;
};

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("Silakan login terlebih dahulu.", 401);
    }

    const body = (await request.json().catch(() => null)) as
      | CheckoutBody
      | null;

    if (!body || typeof body !== "object") {
      return errorResponse("Data checkout tidak valid.", 400);
    }

    const {
      productId,
      quantity,
      recipientName,
      recipientPhone,
      shippingAddress,
    } = body;

    if (
      typeof productId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        productId
      )
    ) {
      return errorResponse("ID produk tidak valid.", 400);
    }

    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      return errorResponse("Jumlah produk harus 1–100.", 400);
    }

    if (
      typeof recipientName !== "string" ||
      !recipientName.trim() ||
      recipientName.length > 150 ||
      typeof recipientPhone !== "string" ||
      !/^[+0-9][0-9\s-]{7,19}$/.test(recipientPhone) ||
      typeof shippingAddress !== "string" ||
      !shippingAddress.trim() ||
      shippingAddress.length > 1000
    ) {
      return errorResponse("Lengkapi data penerima dengan benar.", 400);
    }

    const admin = adminClient();

    // Fungsi SQL membaca harga asli, mengunci produk,
    // mengurangi stok, dan membuat order secara atomik.
    const { data: orderId, error: rpcError } = await admin.rpc(
      "create_marketplace_order",
      {
        p_user_id: user.id,
        p_product_id: productId,
        p_quantity: quantity,
        p_recipient_name: recipientName.trim(),
        p_recipient_phone: recipientPhone.trim(),
        p_shipping_address: shippingAddress.trim(),
      }
    );

    if (rpcError || !orderId) {
      console.error("Create order:", rpcError);
      return errorResponse(
        "Pesanan gagal dibuat. Periksa ketersediaan stok.",
        400
      );
    }

    const { data: order, error: orderError } = await admin
      .from("orders")
      .select(
        "id, user_id, order_number, total_amount, recipient_name, recipient_phone, snap_token, snap_redirect_url"
      )
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    const { data: items, error: itemsError } = await admin
      .from("order_items")
      .select("product_name, quantity, unit_price")
      .eq("order_id", orderId);

    if (
      orderError ||
      itemsError ||
      !order ||
      !items?.length
    ) {
      console.error("Order data:", orderError, itemsError);
      return errorResponse(
        "Pesanan tersimpan tetapi belum dapat diproses. Hubungi admin.",
        500
      );
    }

    const payload = {
      transaction_details: {
        order_id: order.order_number,
        gross_amount: order.total_amount,
      },
      customer_details: {
        first_name: order.recipient_name,
        email: user.email ?? undefined,
        phone: order.recipient_phone,
      },
      item_details: items.map((item) => ({
        id: order.id,
        price: item.unit_price,
        quantity: item.quantity,
        name: item.product_name.slice(0, 50),
      })),
      callbacks: {
        finish: `${
          process.env.NEXT_PUBLIC_APP_URL ||
          request.nextUrl.origin
        }/marketplace/orders/${order.id}`,
      },
    };

    let midtransResponse: Response;

    try {
      midtransResponse = await fetch(midtransApiUrl(), {
        method: "POST",
        headers: {
          Authorization: midtransAuth(),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: AbortSignal.timeout(20000),
      });
    } catch (error) {
      console.error("Midtrans connection:", error);

      // Jangan langsung mengembalikan stok.
      // Permintaan mungkin sudah diterima Midtrans.
      return NextResponse.json(
        {
          error:
            "Koneksi pembayaran terganggu. Pesanan tersimpan; jangan melakukan checkout ulang sebelum statusnya diperiksa.",
          orderId: order.id,
        },
        { status: 502 }
      );
    }

    const snap = await midtransResponse
      .json()
      .catch(() => null);

    if (
      !midtransResponse.ok ||
      typeof snap?.token !== "string" ||
      typeof snap?.redirect_url !== "string"
    ) {
      console.error("Midtrans Snap:", {
        status: midtransResponse.status,
        response: snap,
        orderId: order.id,
      });

      return NextResponse.json(
        {
          error:
            "Pembayaran belum dapat dibuat. Pesanan tersimpan dan memerlukan pemeriksaan status.",
          orderId: order.id,
        },
        { status: 502 }
      );
    }

    const { error: updateError } = await admin
      .from("orders")
      .update({
        snap_token: snap.token,
        snap_redirect_url: snap.redirect_url,
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Save Snap:", updateError);
      return NextResponse.json(
        {
          error:
            "Transaksi dibuat tetapi penyimpanan pembayaran gagal. Hubungi admin.",
          orderId: order.id,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      snapToken: snap.token,
      redirectUrl: snap.redirect_url,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return errorResponse(
      "Terjadi kesalahan pada server pembayaran.",
      500
    );
  }
}
