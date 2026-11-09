
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type OrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

type Order = {
  id: string;
  order_number: string;
  recipient_name: string;
  recipient_phone: string;
  shipping_address: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  snap_redirect_url: string | null;
  created_at: string;
  order_items: OrderItem[];
};

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

const paymentLabels: Record<string, string> = {
  pending: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  failed: "Pembayaran Gagal",
  expired: "Pembayaran Kedaluwarsa",
  cancelled: "Dibatalkan",
};

const orderLabels: Record<string, string> = {
  waiting_payment: "Menunggu Pembayaran",
  processing: "Sedang Diproses",
  shipped: "Dalam Pengiriman",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const supabase = useMemo(() => createClient(), []);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (authError || !user) {
        setError("Silakan login terlebih dahulu.");
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          recipient_name,
          recipient_phone,
          shipping_address,
          total_amount,
          payment_status,
          order_status,
          snap_redirect_url,
          created_at,
          order_items (
            id,
            product_name,
            quantity,
            unit_price,
            subtotal
          )
        `)
        .eq("id", params.orderId)
        .eq("user_id", user.id)
        .single();

      if (!active) return;

      if (queryError || !data) {
        setError("Pesanan tidak ditemukan.");
      } else {
        setOrder(data as Order);
      }

      setLoading(false);
    }

    void loadOrder();

    return () => {
      active = false;
    };
  }, [params.orderId, supabase]);

  return (
    <main className="mx-auto max-w-5xl space-y-7 px-4 py-8 sm:px-6">
      <Link
        href="/marketplace/orders"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#28784A]"
      >
        <ArrowLeft size={17} />
        Kembali ke Pesanan Saya
      </Link>

      {loading ? (
        <p className="py-12 text-center text-[#718573]">
          Memuat detail pesanan...
        </p>
      ) : error || !order ? (
        <div className="rounded-3xl bg-white p-8 text-center text-red-600">
          {error || "Pesanan tidak ditemukan."}
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-extrabold text-[#194D33] sm:text-3xl">
              Detail Pesanan
            </h1>
            <p className="mt-2 break-all text-sm text-[#718573]">
              {order.order_number}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-[#E0E9DD] bg-white p-6">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-[#194D33]">
                  <Package size={21} />
                  Produk Dipesan
                </h2>

                <div className="space-y-4">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 border-b border-[#EDF1E9] pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-bold text-[#194D33]">
                          {item.product_name}
                        </p>
                        <p className="mt-1 text-sm text-[#718573]">
                          {item.quantity} × {rupiah(item.unit_price)}
                        </p>
                      </div>

                      <span className="font-bold text-[#194D33]">
                        {rupiah(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-[#E0E9DD] bg-white p-6">
                <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-[#194D33]">
                  <MapPin size={21} />
                  Informasi Pengiriman
                </h2>

                <div className="flex items-start gap-3">
                  <UserRound
                    size={20}
                    className="mt-1 shrink-0 text-[#28784A]"
                  />

                  <div className="space-y-2 text-sm">
                    <p className="font-bold text-[#194D33]">
                      {order.recipient_name}
                    </p>
                    <p className="text-[#718573]">
                      {order.recipient_phone}
                    </p>
                    <p className="whitespace-pre-wrap text-[#718573]">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div>
              <section className="rounded-3xl border border-[#E0E9DD] bg-white p-6">
                <h2 className="mb-5 text-lg font-extrabold text-[#194D33]">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-[#718573]">
                      Pembayaran
                    </span>
                    <span className="text-right font-bold text-[#194D33]">
                      {paymentLabels[order.payment_status] ||
                        order.payment_status}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-[#718573]">
                      Status Pesanan
                    </span>
                    <span className="text-right font-bold text-[#194D33]">
                      {orderLabels[order.order_status] ||
                        order.order_status}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 border-t border-[#EDF1E9] pt-4">
                    <span className="font-bold text-[#718573]">
                      Total
                    </span>
                    <span className="text-xl font-extrabold text-[#194D33]">
                      {rupiah(order.total_amount)}
                    </span>
                  </div>
                </div>

                {order.payment_status === "pending" &&
                  order.snap_redirect_url && (
                    <a
                      href={order.snap_redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#FFDA57] font-extrabold text-[#194D33]"
                    >
                      <CreditCard size={18} />
                      Lanjutkan Pembayaran
                    </a>
                  )}
              </section>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
