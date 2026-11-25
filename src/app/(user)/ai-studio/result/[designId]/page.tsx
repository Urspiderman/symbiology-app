
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Calculator,
  Download,
  Droplets,
  Fish,
  Leaf,
  Ruler,
  Sparkles,
  MapPin,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";

import {
  getDesignImage,
} from "@/lib/ai/design-image-storage";

type Recommendation = {
  summary: string;
  systemType: string;
  recommendedFish: string;
  recommendedPlants: string[];
  placement: string;
  maintenance: string[];
  safetyNotes: string[];
};

type Design = {
  id: string;
  name: string;
  area: number;
  fish: string;
  plant: string;
  tankVolume: number;
  estimatedCost: number;
  withinBudget: boolean;
  systemType: string;
  notes: string[];
  createdAt?: string;
  recommendation?: Recommendation;
  input: {
    budget: number;
    length: number;
    width: number;
    height?: number | null;
    priority?: string;
    plants?: string[];
    analysis?: {
      roomType: string;
      description: string;
      lighting: string;
    };
  };
};

function rupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DesignResultPage() {
  const { designId } = useParams<{
    designId: string;
  }>();

  const [design, setDesign] =
    useState<Design | null>(null);

  const [loaded, setLoaded] = useState(false);

  const [afterImage, setAfterImage] =
    useState<string | null>(null);

  const [imageLoaded, setImageLoaded] =
    useState(false);

  // MEMBACA DATA RANCANGAN
  useEffect(() => {
    setLoaded(false);

    try {
      const stored = sessionStorage.getItem(
        `symbiology-design-${designId}`
      );

      if (!stored) {
        setDesign(null);
        return;
      }

      const parsed: unknown = JSON.parse(stored);

      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("id" in parsed) ||
        parsed.id !== designId
      ) {
        setDesign(null);
        return;
      }

      setDesign(parsed as Design);
    } catch {
      setDesign(null);
    } finally {
      setLoaded(true);
    }
  }, [designId]);

  // MEMBACA FOTO AFTER
  useEffect(() => {
    let cancelled = false;

    setImageLoaded(false);
    setAfterImage(null);

    getDesignImage(designId)
      .then((image) => {
        if (!cancelled) {
          setAfterImage(image);
        }
      })
      .catch((error) => {
        console.error(
          "Gagal membaca foto AFTER:",
          error
        );
      })
      .finally(() => {
        if (!cancelled) {
          setImageLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [designId]);

  if (!loaded) {
    return (
      <main className="p-8 text-center text-[#62766D]">
        Memuat rancangan...
      </main>
    );
  }

  if (!design) {
    return (
      <main className="mx-auto max-w-3xl space-y-5 p-8 text-center">
        <h1 className="text-2xl font-extrabold text-[#005B45]">
          Rancangan Tidak Ditemukan
        </h1>

        <p className="text-[#62766D]">
          Data rancangan sementara tidak tersedia.
          Silakan buat rancangan baru.
        </p>

        <Link
          href="/ai-studio/input"
          className="font-bold text-[#08785C] underline"
        >
          Buat Rancangan Baru
        </Link>
      </main>
    );
  }

  const recommendation = design.recommendation;

  const items = [
    {
      icon: Ruler,
      label: "Luas Ruangan",
      value: `${design.area.toLocaleString(
        "id-ID",
        { maximumFractionDigits: 2 }
      )} m²`,
    },
    {
      icon: Fish,
      label: "Rekomendasi Ikan",
      value:
        recommendation?.recommendedFish ||
        design.fish,
    },
    {
      icon: Leaf,
      label: "Rekomendasi Tanaman",
      value:
        recommendation?.recommendedPlants?.join(
          ", "
        ) || design.plant,
    },
    {
      icon: Droplets,
      label: "Volume Tangki Ilustratif",
      value: `${design.tankVolume} liter`,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-7 px-4 py-8 sm:px-6">
      <Link
        href="/ai-studio"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#08785C]"
      >
        <ArrowLeft size={17} />
        Kembali ke AI Studio
      </Link>

      {/* HEADER */}
      <section className="rounded-3xl bg-[#005B45] p-7 text-white sm:p-9">
        <div className="flex items-center gap-2 text-[#FF70AD]">
          <Sparkles size={20} />

          <span className="text-sm font-extrabold">
            HASIL DESAIN AKUAPONIK AI
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold">
          {design.name}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80">
          Visualisasi instalasi akuaponik berdasarkan
          foto ruangan dan kebutuhanmu.
        </p>
      </section>

      {/* FOTO AFTER — HASIL UTAMA */}
      <section className="overflow-hidden rounded-3xl border border-[#DCE6DB] bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <div className="flex items-center gap-2 text-[#08785C]">
              <ImageIcon size={20} />

              <span className="text-xs font-extrabold uppercase tracking-wide">
                Visualisasi AI
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-extrabold text-[#005B45]">
              Foto Hasil Desain
            </h2>

            <p className="mt-2 text-sm text-[#62766D]">
              Rancangan akuaponik pada ruanganmu.
            </p>
          </div>

          {afterImage && (
            <a
              href={afterImage}
              download={`SYMBIOLOGY-${design.id}.${
                afterImage.startsWith(
                  "data:image/jpeg"
                )
                  ? "jpg"
                  : afterImage.startsWith(
                      "data:image/webp"
                    )
                  ? "webp"
                  : "png"
              }`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#005B45] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#246342]"
            >
              <Download size={18} />
              Simpan Foto
            </a>
          )}
        </div>

        {!imageLoaded ? (
          <div className="flex min-h-80 items-center justify-center bg-[#F3F7F2] p-6 text-center text-sm text-[#62766D]">
            Memuat foto hasil rancangan...
          </div>
        ) : afterImage ? (
          <div className="bg-[#F3F7F2]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={afterImage}
              alt="Foto ruangan dengan instalasi akuaponik hasil AI SYMBIOLOGY"
              className="mx-auto h-auto max-h-[800px] w-full object-contain"
            />
          </div>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center gap-3 bg-[#F3F7F2] p-6 text-center">
            <ImageIcon
              size={36}
              className="text-[#08785C]"
            />

            <p className="font-bold text-[#005B45]">
              Foto hasil desain tidak tersedia
            </p>

            <p className="max-w-md text-sm leading-6 text-[#62766D]">
              Gambar mungkin belum tersimpan atau
              penyimpanan browser telah dibersihkan.
              Silakan generate ulang.
            </p>
          </div>
        )}

        <div className="border-t border-[#DCE6DB] p-5 sm:p-6">
          <p className="text-xs leading-6 text-[#62766D]">
            Foto ini merupakan visualisasi konsep
            yang dibuat AI. Ukuran dan keamanan
            instalasi belum diverifikasi secara teknis.
          </p>
        </div>
      </section>

      {/* INFORMASI RANCANGAN */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(
          ({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-3xl border border-[#DCE6DB] bg-white p-6"
            >
              <Icon
                size={25}
                className="text-[#08785C]"
              />

              <p className="mt-5 text-sm text-[#62766D]">
                {label}
              </p>

              <p className="mt-2 break-words text-lg font-extrabold capitalize text-[#005B45]">
                {value}
              </p>
            </div>
          )
        )}
      </div>

      {/* REKOMENDASI GEMINI */}
      {recommendation && (
        <section className="rounded-3xl border border-[#DCE6DB] bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Sparkles
              size={24}
              className="text-[#08785C]"
            />

            <h2 className="text-xl font-extrabold text-[#005B45]">
              Rekomendasi Desain AI
            </h2>
          </div>

          <p className="mt-5 text-sm leading-8 text-[#526A5E]">
            {recommendation.summary}
          </p>

          <div className="mt-6 rounded-2xl bg-[#F3F7F2] p-5">
            <p className="text-xs font-bold text-[#62766D]">
              Sistem Akuaponik
            </p>

            <p className="mt-2 text-lg font-extrabold text-[#005B45]">
              {recommendation.systemType}
            </p>
          </div>
        </section>
      )}

      {/* PENEMPATAN */}
      {recommendation?.placement && (
        <section className="rounded-3xl border border-[#DCE6DB] bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <MapPin
              size={23}
              className="text-[#08785C]"
            />

            <h2 className="text-xl font-extrabold text-[#005B45]">
              Rekomendasi Penempatan
            </h2>
          </div>

          <p className="mt-4 text-sm leading-8 text-[#62766D]">
            {recommendation.placement}
          </p>
        </section>
      )}

      {/* BIAYA */}
      <section className="rounded-3xl border border-[#DCE6DB] bg-white p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-[#005B45]">
          Estimasi Biaya
        </h2>

        <p className="mt-3 text-sm text-[#62766D]">
          Tipe sistem:{" "}
          <strong className="text-[#005B45]">
            {design.systemType}
          </strong>
        </p>

        <div className="mt-6 rounded-2xl bg-[#F3F7F2] p-5">
          <div className="flex items-center gap-2 font-bold text-[#005B45]">
            <Calculator size={20} />
            Perkiraan Biaya Instalasi
          </div>

          <p className="mt-3 text-3xl font-extrabold text-[#005B45]">
            {rupiah(design.estimatedCost)}
          </p>

          <p className="mt-2 text-sm text-[#62766D]">
            Anggaranmu:{" "}
            {rupiah(design.input.budget)}
          </p>

          <div className="mt-4 flex items-start gap-2">
            {design.withinBudget ? (
              <CheckCircle2
                size={19}
                className="shrink-0 text-emerald-700"
              />
            ) : (
              <AlertTriangle
                size={19}
                className="shrink-0 text-amber-700"
              />
            )}

            <p
              className={`text-sm font-bold ${
                design.withinBudget
                  ? "text-emerald-700"
                  : "text-amber-700"
              }`}
            >
              {design.withinBudget
                ? "Estimasi berada dalam anggaran."
                : "Estimasi melebihi anggaran. Perlu penyesuaian desain."}
            </p>
          </div>
        </div>
      </section>

      {/* PERAWATAN */}
      {recommendation?.maintenance &&
        recommendation.maintenance.length > 0 && (
          <section className="rounded-3xl border border-[#DCE6DB] bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Wrench
                size={23}
                className="text-[#08785C]"
              />

              <h2 className="text-xl font-extrabold text-[#005B45]">
                Panduan Perawatan
              </h2>
            </div>

            <ul className="mt-5 space-y-4">
              {recommendation.maintenance.map(
                (item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm leading-7 text-[#62766D]"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-1 shrink-0 text-[#08785C]"
                    />

                    <span>{item}</span>
                  </li>
                )
              )}
            </ul>
          </section>
        )}

      {/* KEAMANAN */}
      <section className="rounded-3xl border border-[#DCE6DB] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <ShieldAlert
            size={23}
            className="text-amber-700"
          />

          <h2 className="text-xl font-extrabold text-[#005B45]">
            Catatan Keamanan
          </h2>
        </div>

        <ul className="mt-5 space-y-4">
          {design.notes.map((note, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm leading-7 text-[#62766D]"
            >
              <span className="font-bold text-[#08785C]">
                •
              </span>

              <span>{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs leading-6 text-[#62766D]">
        Hasil ini merupakan konsep visual dan
        rekomendasi awal berbantuan AI. Volume
        tangki dan estimasi biaya bersifat
        ilustratif. Keamanan struktur, kelistrikan,
        filtrasi, serta kualitas air perlu
        diverifikasi sebelum pemasangan.
        Data desain tersimpan sementara di browser,
        belum di Supabase.
      </p>
    </main>
  );
}
