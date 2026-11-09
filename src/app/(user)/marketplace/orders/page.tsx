
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Package,
  ShoppingBag,
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
  total_amount: number;
  payment_status: string;
  order_status: string;
  snap_redirect_url: string | null;
  created_at: string;
  order_items: OrderItem[];
};

type Filter = "all" | "pending" | "paid" | "other";

const filters: { label: string; value: Filter }[] = [
  { label: "Semua", value: "all" },
  { label: "Menunggu", value: "pending" },
  { label: "Dibayar", value: "paid" },
  { label: "Lainnya", value: "other" },
];

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function dateFormat(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function paymentLabel(status: string) {
  switch (status) {
    case "paid":
      return "Sudah Dibayar";
    case "pending":
      return "Menunggu Pembayaran";
    case "failed":
      return "Pembayaran Gagal";
    case "expired":
      return "Pembayaran Kedaluwarsa";
    case "cancelled":
      return "Dibatalkan";
    default:
      return status;
  }
}

function statusStyle(status: string) {
  if (status === "paid") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "pending") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-red-50 text-red-700";
}

export default function OrdersPage() {
  const supabase = useMemo(() => createClient(), []);

  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (authError || !user) {
        setError("Silakan login untuk melihat pesanan.");
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
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
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (queryError) {
        setError("Gagal memuat riwayat pesanan.");
      } else {
        setOrders((data ?? []) as Order[]);
      }

      setLoading(false);
    }

    void loadOrders();

    return () => {
      active = false;
    };
  }, [supabase]);

  const visibleOrders = orders.filter((order) => {
    if (filter === "all") return true;

    if (filter === "other") {
      return !["pending", "paid"].includes(
        order.payment_status
      );
    }

    return order.payment_status === filter;
  });

  return (
    <main className="mx-auto max-w-6xl space-y-7 px-4 py-8 sm:px-6">
      <div>
        <Link
          href="/marketplace"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#28784A]"
        >
          <ArrowLeft size={17} />
          Kembali ke Marketplace
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#EAF3E5] p-3 text-[#194D33]">
            <ShoppingBag size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-[#194D33] sm:text-3xl">
              Pesanan Saya
            </h1>
            <p className="mt-1 text-sm text-[#718573]">
              Pantau riwayat pembelian dan pembayaranmu.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
              filter === item.value
                ? "bg-[#194D33] text-white"
                : "border border-[#DDE7D8] bg-white text-[#718573] hover:bg-[#F4F7ED]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-3xl border border-[#E0E9DD] bg-white p-12 text-center text-[#718573]">
          Memuat pesanan...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-red-700">
          {error}
          <div className="mt-4">
            <Link href="/login" className="font-bold underline">
              Masuk ke Akun
            </Link>
          </div>
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className="rounded-3xl border border-[#E0E9DD] bg-white px-6 py-14 text-center">
          <Package
            size={46}
            className="mx-auto mb-4 text-[#87A38B]"
          />
          <h2 className="text-lg font-extrabold text-[#194D33]">
            Belum Ada Pesanan
          </h2>
          <p className="mt-2 text-sm text-[#718573]">
            Pesanan yang kamu buat akan muncul di sini.
          </p>
          <Link
            href="/marketplace"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#FFDA57] px-5 py-3 font-bold text-[#194D33]"
          >
            Jelajahi Marketplace
            <ArrowRight size={17} />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-3xl border border-[#E0E9DD] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#EDF1E9] pb-4">
                <div>
                  <p className="text-xs font-semibold text-[#718573]">
                    {dateFormat(order.created_at)}
                  </p>
                  <h2 className="mt-1 break-all font-extrabold text-[#194D33]">
                    {order.order_number}
                  </h2>
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(
                    order.payment_status
                  )}`}
                >
                  {paymentLabel(order.payment_status)}
                </span>
              </div>

              <div className="space-y-3 py-5">
                {order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-[#F4F7ED] p-3 text-[#28784A]">
                        <Package size={19} />
                      </div>

                      <div>
                        <p className="font-bold text-[#194D33]">
                          {item.product_name}
                        </p>
                        <p className="mt-1 text-xs text-[#718573]">
                          {item.quantity} ×{" "}
                          {rupiah(item.unit_price)}
                        </p>
                      </div>
                    </div>

                    <span className="text-sm font-bold text-[#194D33]">
                      {rupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#EDF1E9] pt-4">
                <div>
                  <p className="text-xs text-[#718573]">
                    Total Pembayaran
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-[#194D33]">
                    {rupiah(order.total_amount)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/marketplace/orders/${order.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#DDE7D8] px-4 py-2.5 text-sm font-bold text-[#194D33]"
                  >
                    Detail
                    <ArrowRight size={16} />
                  </Link>

                  {order.payment_status === "pending" &&
                    order.snap_redirect_url && (
                      <a
                        href={order.snap_redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#FFDA57] px-4 py-2.5 text-sm font-bold text-[#194D33]"
                      >
                        <CreditCard size={16} />
                        Bayar
                      </a>
                    )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
