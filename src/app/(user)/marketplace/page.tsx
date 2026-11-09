
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  Package,
  ArrowRight,
  Leaf,
  SlidersHorizontal,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  stock: number;
  image_url: string | null;
};

const categories = [
  "Semua",
  "tanaman",
  "ikan",
  "peralatan",
  "lainnya",
];

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select(
          "id,name,description,category,price,stock,image_url"
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setError("Gagal memuat produk. Silakan coba lagi.");
      } else {
        setProducts((data ?? []) as Product[]);
      }

      setLoading(false);
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "Semua" ||
        product.category === category;

      return matchSearch && matchCategory;
    });
  }, [products, search, category]);

  return (
    <main className="min-h-screen bg-[#FFFBF1] pb-24 text-[#194D33]">
      <div className="mx-auto max-w-[1440px] space-y-7 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">

        {/* HEADER */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#739078]">
              <Leaf size={15} />
              SYMBIOLOGY
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Marketplace
            </h1>

            <p className="mt-1 text-sm text-[#718573]">
              Semua kebutuhan akuaponikmu dalam satu tempat.
            </p>
          </div>

          <Link
            href="/marketplace/orders"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E7F3E4] transition hover:bg-[#D8EBD3]"
            title="Pesanan Saya"
          >
            <ShoppingBag size={21} />
          </Link>
        </div>

        {/* BANNER */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#194D33] px-5 py-7 text-white sm:px-8 sm:py-9 lg:px-10">
          <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full border-[38px] border-[#FFDA57]/15" />
          <div className="pointer-events-none absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-[#A8D5A4]/10 blur-2xl" />

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-[#FFDA57]">
              <Leaf size={14} />
              GROW UR FUTURE
            </span>

            <h2 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">
              Bangun Ekosistem
              <br />
              Hijau Impianmu.
            </h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#D7E8D9]">
              Temukan perlengkapan, tanaman, dan kebutuhan
              akuaponik untuk memulai budidaya di rumah.
            </p>
          </div>
        </section>

        {/* SEARCH */}
        <div className="flex gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[#E0EADD] bg-white px-4 py-3 shadow-sm">
            <Search
              size={19}
              className="shrink-0 text-[#78917B]"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk akuaponik..."
              className="w-full min-w-0 bg-transparent text-sm text-[#194D33] outline-none placeholder:text-[#9AAB9D]"
            />
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E7F3E4]">
            <SlidersHorizontal size={20} />
          </div>
        </div>

        {/* CATEGORY */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => {
            const selected = category === item;

            return (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold capitalize transition sm:text-sm ${
                  selected
                    ? "bg-[#194D33] text-white"
                    : "bg-[#E7F3E4] text-[#194D33] hover:bg-[#D8EBD3]"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* PRODUCT HEADER */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold sm:text-xl">
              Jelajahi Produk
            </h3>

            <p className="mt-1 text-xs text-[#718573]">
              {loading
                ? "Memuat katalog..."
                : `${filteredProducts.length} produk ditemukan`}
            </p>
          </div>

          <Package size={22} className="text-[#78917B]" />
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl bg-white"
              >
                <div className="aspect-square bg-[#E7F3E4]" />
                <div className="space-y-3 p-3">
                  <div className="h-3 rounded bg-[#E7F3E4]" />
                  <div className="h-3 w-2/3 rounded bg-[#E7F3E4]" />
                  <div className="h-8 rounded bg-[#E7F3E4]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCT GRID */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => {
              const soldOut = product.stock <= 0;

              return (
                <article
                  key={product.id}
                  className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E8EDE4] bg-white shadow-[3px_5px_14px_rgba(25,77,51,0.06)] transition hover:-translate-y-1 hover:shadow-[5px_10px_20px_rgba(25,77,51,0.1)]"
                >
                  {/* IMAGE */}
                  <div className="relative aspect-square overflow-hidden bg-[#EAF2E4]">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#8AAA8D]">
                        <Leaf size={38} strokeWidth={1.5} />
                        <span className="text-[10px] font-medium">
                          SYMBIOLOGY
                        </span>
                      </div>
                    )}

                    {soldOut && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#194D33]/60">
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-[#194D33]">
                          Stok Habis
                        </span>
                      </div>
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <span className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#78917B]">
                      {product.category}
                    </span>

                    <h4 className="min-h-[38px] overflow-hidden text-ellipsis text-xs font-bold leading-[19px] text-[#194D33] sm:text-sm">
                      <span className="line-clamp-2">
                        {product.name}
                      </span>
                    </h4>

                    <p className="mt-2 text-base font-extrabold text-[#194D33] sm:text-lg">
                      {rupiah(product.price)}
                    </p>

                    <p className="mt-1 text-[11px] text-[#78917B]">
                      Stok: {product.stock}
                    </p>

                    <div className="mt-auto pt-3">
                      {soldOut ? (
                        <button
                          disabled
                          className="w-full rounded-xl bg-[#E8ECE7] px-2 py-2.5 text-xs font-bold text-[#98A69A]"
                        >
                          Stok Habis
                        </button>
                      ) : (
                        <Link
                          href={`/marketplace/checkout?product=${product.id}`}
                          className="flex w-full items-center justify-center gap-1 rounded-xl bg-[#FFDA57] px-2 py-2.5 text-xs font-extrabold text-[#194D33] transition hover:bg-[#F5CA36]"
                        >
                          Beli Sekarang
                          <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[#E0EADD] bg-white px-6 py-16 text-center">
            <Package size={42} className="text-[#8AAA8D]" />

            <h3 className="mt-4 text-lg font-bold">
              Produk tidak ditemukan
            </h3>

            <p className="mt-2 text-sm text-[#718573]">
              Coba gunakan kata kunci atau kategori lain.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
