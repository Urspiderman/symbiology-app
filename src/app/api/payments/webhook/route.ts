
import { NextRequest, NextResponse } from "next/server";
import {
  createHash,
  timingSafeEqual,
} from "node:crypto";
import { adminClient } from "@/lib/supabase/admin";
import {
  midtransAuth,
  midtransServerKey,
  midtransStatusUrl,
} from "@/lib/payments/midtrans";

export const runtime = "nodejs";

type MidtransNotification = {
  order_id?: string;
  status_code?: string;
  gross_amount?: string;
  signature_key?: string;
};

function verifySignature(data: MidtransNotification) {
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key,
  } = data;

  if (
    typeof order_id !== "string" ||
    typeof status_code !== "string" ||
    typeof gross_amount !== "string" ||
    typeof signature_key !== "string" ||
    !/^[0-9a-f]{128}$/i.test(signature_key)
  ) {
    return false;
  }

  const expected = createHash("sha512")
    .update(
      order_id +
        status_code +
        gross_amount +
        midtransServerKey()
    )
    .digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature_key, "hex");

  return (
    a.length === b.length &&
    timingSafeEqual(a, b)
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json().catch(() => null)) as
      | MidtransNotification
      | null;

    if (!payload || !verifySignature(payload)) {
      return NextResponse.json(
        { error: "Invalid notification or signature" },
        { status: 403 }
      );
    }

    const orderNumber = payload.order_id!;

    const admin = adminClient();

    const { data: order, error: orderError } = await admin
      .from("orders")
      .select(
        "id, order_number, total_amount, payment_status"
      )
      .eq("midtrans_order_id", orderNumber)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Jangan percaya status pembayaran dari webhook saja.
    // Ambil status terkini langsung dari Midtrans.
    const response = await fetch(
      midtransStatusUrl(orderNumber),
      {
        headers: {
          Authorization: midtransAuth(),
          Accept: "application/json",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      }
    );

    if (!response.ok) {
      console.error(
        "Midtrans status HTTP:",
        response.status
      );

      return NextResponse.json(
        { error: "Unable to verify transaction" },
        { status: 502 }
      );
    }

    const transaction = await response.json();

    if (
      transaction.order_id !== order.order_number ||
      !Number.isFinite(Number(transaction.gross_amount)) ||
      Number(transaction.gross_amount) !==
        Number(order.total_amount)
    ) {
      return NextResponse.json(
        { error: "Transaction mismatch" },
        { status: 400 }
      );
    }

    const status = transaction.transaction_status;
    const fraudStatus = transaction.fraud_status;

    let paymentStatus:
      | "paid"
      | "pending"
      | "failed"
      | "expired"
      | "cancelled" = "pending";

    if (
      status === "settlement" ||
      (status === "capture" &&
        fraudStatus === "accept")
    ) {
      paymentStatus = "paid";
    } else if (
      status === "deny" ||
      status === "failure"
    ) {
      paymentStatus = "failed";
    } else if (status === "expire") {
      paymentStatus = "expired";
    } else if (status === "cancel") {
      paymentStatus = "cancelled";
    } else if (
      status === "pending" ||
      status === "authorize" ||
      (status === "capture" &&
        fraudStatus === "challenge")
    ) {
      paymentStatus = "pending";
    } else {
      console.error("Unhandled Midtrans status:", status);

      return NextResponse.json(
        { error: "Unhandled transaction status" },
        { status: 422 }
      );
    }

    if (paymentStatus === "pending") {
      return NextResponse.json({
        success: true,
        status: "pending",
      });
    }

    const { error: updateError } = await admin.rpc(
      "finalize_marketplace_payment",
      {
        p_order_id: order.id,
        p_payment_status: paymentStatus,
        p_transaction_id:
          transaction.transaction_id ?? null,
      }
    );

    if (updateError) {
      console.error(
        "Finalize payment error:",
        updateError
      );

      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentStatus,
    });
  } catch (error) {
    console.error("Midtrans webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
