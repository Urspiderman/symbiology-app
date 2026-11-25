
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string | null;
};

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const productId = searchParams.get("product");

  const supabase = useMemo(() => createClient(), []);

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      setLoadingProduct(true);
      setProduct(null);
      setError("");

      if (!productId) {
        setError("Produk belum dipilih.");
        setLoadingProduct(false);
        return;
      }

      const { data, error: productError } = await supabase
        .from("products")
        .select("id, name, price, stock, image_url")
        .eq("id", productId)
        .eq("is_active", true)
        .single();

      if (!active) return;

      if (productError || !data) {
        setError("Produk tidak ditemukan.");
      } else {
        setProduct(data as Product);
        setQuantity(1);
      }

      setLoadingProduct(false);
    }

    void loadProduct();

    return () => {
      active = false;
    };
  }, [productId, supabase]);

  const total = product ? product.price * quantity : 0;

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!product || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          recipientName,
          recipientPhone,
          shippingAddress,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Gagal membuat pembayaran."
        );
      }

      if (!result.redirectUrl) {
        throw new Error("Link pembayaran tidak tersedia.");
      }

      window.location.assign(result.redirectUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat checkout."
      );
      setSubmitting(false);
    }
  }

  if (loadingProduct) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-[#005B45]">
        Memuat produk...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="mb-5 text-red-600">
          {error || "Produk tidak tersedia."}
        </p>
        <Link href="/marketplace" className="font-bold text-[#005B45]">
          Kembali ke Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <div>
        <Link
          href="/marketplace"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#08785C]"
        >
          <ArrowLeft size={17} />
          Kembali ke Marketplace
        </Link>

        <h1 className="text-3xl font-extrabold text-[#005B45]">
          Checkout
        </h1>

        <p className="mt-2 text-sm text-[#62766D]">
          Konfirmasi pesanan dan lanjutkan pembayaran dengan aman.
        </p>
      </div>

      <form
        onSubmit={handleCheckout}
        className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"
      >
        <div className="space-y-6">
          <section className="rounded-3xl border border-[#DCE6DB] bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-extrabold text-[#005B45]">
              <MapPin size={21} />
              Informasi Pengiriman
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#005B45]">
                  Nama Penerima
                </label>
                <input
                  required
                  maxLength={150}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Nama lengkap penerima"
                  className="w-full rounded-2xl border border-[#DCE6DB] bg-[#F3F7F2] px-4 py-3 outline-none focus:border-[#08785C]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#005B45]">
                  Nomor HP
                </label>
                <input
                  required
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-2xl border border-[#DCE6DB] bg-[#F3F7F2] px-4 py-3 outline-none focus:border-[#08785C]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#005B45]">
                  Alamat Lengkap
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Jalan, nomor rumah, kelurahan, kecamatan, kota, kode pos"
                  className="w-full resize-none rounded-2xl border border-[#DCE6DB] bg-[#F3F7F2] px-4 py-3 outline-none focus:border-[#08785C]"
                />
              </div>
            </div>
          </section>
        </div>

        <div>
          <section className="rounded-3xl border border-[#DCE6DB] bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold text-[#005B45]">
              <Package size={21} />
              Ringkasan Pesanan
            </h2>

            <div className="flex gap-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#F3F7F2]">
                <Image
                  src={
                    product.image_url ||
                    "/images/products/rockwool.png"
                  }
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="font-bold text-[#005B45]">
                  {product.name}
                </h3>
                <p className="mt-2 font-extrabold text-[#08785C]">
                  {formatRupiah(product.price)}
                </p>
                <p className="mt-1 text-xs text-[#62766D]">
                  Stok: {product.stock}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="text-sm text-[#62766D]">
                Jumlah Pembelian
              </span>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  disabled={quantity <= 1}
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="h-9 w-9 rounded-xl bg-[#F3F7F2] font-bold disabled:opacity-40"
                >
                  −
                </button>

                <span className="font-bold">{quantity}</span>

                <button
                  type="button"
                  disabled={
                    quantity >= Math.min(product.stock, 100)
                  }
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(product.stock, 100, q + 1)
                    )
                  }
                  className="h-9 w-9 rounded-xl bg-[#F3F7F2] font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 border-t border-[#DCE6DB] pt-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#62766D]">
                  Total Pembayaran
                </span>
                <span className="text-xl font-extrabold text-[#005B45]">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || product.stock < 1}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#FF70AD] font-extrabold text-[#005B45] transition hover:bg-[#FFD43B] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CreditCard size={19} />
              {submitting
                ? "Memproses..."
                : product.stock < 1
                  ? "Stok Habis"
                  : "Bayar Sekarang"}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#62766D]">
              <ShieldCheck size={16} />
              Pembayaran diproses melalui Midtrans Sandbox
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
