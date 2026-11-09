
"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Fish,
  Leaf,
  Ruler,
  Wallet,
} from "lucide-react";

import type { SpacePhotoData } from "./SpaceForm";

export type SpaceDetails = {
  length: number;
  width: number;
  height: number | null;
  budget: number;
  fish: string;
  plants: string[];
  priority: "hemat-biaya" | "hemat-ruang" | "produktivitas";
  notes: string;
};

type Props = {
  photoData: SpacePhotoData;
  initialData?: SpaceDetails | null;
  onBack: () => void;
  onContinue: (details: SpaceDetails) => void;
};

const fishOptions = [
  { value: "nila", label: "Ikan Nila" },
  { value: "lele", label: "Ikan Lele" },
  { value: "mas", label: "Ikan Mas" },
  { value: "hias", label: "Ikan Hias" },
  {
    value: "belum-tahu",
    label: "Rekomendasikan dengan AI",
  },
];

const plantOptions = [
  "Selada",
  "Pakcoy",
  "Kangkung",
  "Bayam",
  "Sawi",
  "Kemangi",
];

const priorityOptions: {
  value: SpaceDetails["priority"];
  label: string;
  description: string;
}[] = [
  {
    value: "hemat-biaya",
    label: "Hemat Biaya",
    description: "Utamakan komponen terjangkau.",
  },
  {
    value: "hemat-ruang",
    label: "Hemat Ruang",
    description: "Optimalkan area yang tersedia.",
  },
  {
    value: "produktivitas",
    label: "Produktivitas",
    description: "Utamakan kapasitas budidaya.",
  },
];

const inputClass =
  "mt-2 w-full rounded-2xl border border-[#DDE7D8] bg-white px-4 py-3 text-sm text-[#194D33] outline-none transition focus:border-[#28784A] focus:ring-2 focus:ring-[#28784A]/10";

export default function SpaceDetailsForm({
  photoData,
  initialData,
  onBack,
  onContinue,
}: Props) {
  const [length, setLength] = useState(
    initialData?.length?.toString() ?? ""
  );

  const [width, setWidth] = useState(
    initialData?.width?.toString() ?? ""
  );

  const [height, setHeight] = useState(
    initialData?.height?.toString() ?? ""
  );

  const [budget, setBudget] = useState(
    initialData?.budget?.toString() ?? ""
  );

  const [fish, setFish] = useState(
    initialData?.fish ?? "belum-tahu"
  );

  const [plants, setPlants] = useState<string[]>(
    initialData?.plants ?? []
  );

  const [priority, setPriority] = useState<
    SpaceDetails["priority"]
  >(initialData?.priority ?? "hemat-ruang");

  const [notes, setNotes] = useState(
    initialData?.notes ?? ""
  );

  const [error, setError] = useState("");

  const area =
    Number(length) > 0 && Number(width) > 0
      ? Number(length) * Number(width)
      : 0;

  function togglePlant(plant: string) {
    setPlants((current) =>
      current.includes(plant)
        ? current.filter((item) => item !== plant)
        : [...current, plant]
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const l = Number(length);
    const w = Number(width);
    const h = height.trim() ? Number(height) : null;
    const b = Number(budget);

    if (
      !Number.isFinite(l) ||
      !Number.isFinite(w) ||
      l < 0.01 ||
      w < 0.01 ||
      l > 100 ||
      w > 100
    ) {
      setError(
        "Panjang dan lebar harus antara 0,01 sampai 100 meter."
      );
      return;
    }

    if (
      h !== null &&
      (!Number.isFinite(h) || h < 0.01 || h > 100)
    ) {
      setError(
        "Tinggi tersedia harus antara 0,01 sampai 100 meter."
      );
      return;
    }

    if (
      !Number.isFinite(b) ||
      b < 100000 ||
      !Number.isInteger(b)
    ) {
      setError(
        "Masukkan anggaran minimal Rp100.000 dalam angka bulat."
      );
      return;
    }

    if (plants.length === 0) {
      setError("Pilih minimal satu jenis tanaman.");
      return;
    }

    onContinue({
      length: l,
      width: w,
      height: h,
      budget: b,
      fish,
      plants,
      priority,
      notes: notes.trim(),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* HEADER DAN HASIL ANALISIS */}
      <section className="rounded-3xl border border-[#E0E9DD] bg-white p-5 shadow-sm sm:p-8">
        <span className="inline-flex rounded-full bg-[#EAF3E5] px-4 py-2 text-xs font-extrabold text-[#194D33]">
          LANGKAH 2 — DETAIL RUANGAN
        </span>

        <h2 className="mt-4 text-2xl font-extrabold text-[#194D33]">
          Sesuaikan dengan Ruanganmu
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#718573]">
          Lengkapi informasi berikut agar rancangan
          akuaponik dapat disesuaikan dengan ukuran
          area, anggaran, dan kebutuhanmu.
        </p>

        <div className="mt-6 rounded-2xl bg-[#F4F7ED] p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2
              size={21}
              className="mt-0.5 shrink-0 text-[#28784A]"
            />

            <div>
              <p className="font-extrabold text-[#194D33]">
                Foto berhasil dianalisis
              </p>

              <p className="mt-1 text-sm font-bold text-[#28784A]">
                {photoData.analysis.roomType}
              </p>

              <p className="mt-2 text-sm leading-6 text-[#536B57]">
                {photoData.analysis.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UKURAN RUANGAN */}
      <section className="rounded-3xl border border-[#E0E9DD] bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-[#EAF3E5] p-3 text-[#194D33]">
            <Ruler size={23} />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-[#194D33]">
              Ukuran Area
            </h3>

            <p className="text-sm text-[#718573]">
              Gunakan ukuran hasil pengukuran langsung.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-bold text-[#194D33]">
            Panjang Area (meter) *
            <input
              type="number"
              min="0.01"
              max="100"
              step="0.01"
              required
              value={length}
              onChange={(event) =>
                setLength(event.target.value)
              }
              placeholder="Contoh: 3"
              className={inputClass}
            />
          </label>

          <label className="text-sm font-bold text-[#194D33]">
            Lebar Area (meter) *
            <input
              type="number"
              min="0.01"
              max="100"
              step="0.01"
              required
              value={width}
              onChange={(event) =>
                setWidth(event.target.value)
              }
              placeholder="Contoh: 2"
              className={inputClass}
            />
          </label>

          <label className="text-sm font-bold text-[#194D33] sm:col-span-2">
            Tinggi Tersedia (meter) — Opsional
            <input
              type="number"
              min="0.01"
              max="100"
              step="0.01"
              value={height}
              onChange={(event) =>
                setHeight(event.target.value)
              }
              placeholder="Contoh: 2.5"
              className={inputClass}
            />
          </label>
        </div>

        {area > 0 && Number.isFinite(area) && (
          <div className="mt-5 rounded-2xl bg-[#EAF3E5] p-5">
            <p className="text-xs font-bold text-[#718573]">
              Luas Area Tersedia
            </p>

            <p className="mt-1 text-2xl font-extrabold text-[#194D33]">
              {area.toLocaleString("id-ID", {
                maximumFractionDigits: 2,
              })}{" "}
              m²
            </p>
          </div>
        )}
      </section>

      {/* ANGGARAN */}
      <section className="rounded-3xl border border-[#E0E9DD] bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-[#FFF3C4] p-3 text-[#194D33]">
            <Wallet size={23} />
          </div>

          <h3 className="text-lg font-extrabold text-[#194D33]">
            Anggaran Instalasi
          </h3>
        </div>

        <label className="block text-sm font-bold text-[#194D33]">
          Anggaran Maksimal (Rp) *
          <input
            type="number"
            min="100000"
            step="10000"
            required
            value={budget}
            onChange={(event) =>
              setBudget(event.target.value)
            }
            placeholder="Contoh: 2500000"
            className={inputClass}
          />
        </label>

        {Number(budget) > 0 && (
          <p className="mt-3 text-sm font-extrabold text-[#28784A]">
            Rp{Number(budget).toLocaleString("id-ID")}
          </p>
        )}

        <p className="mt-3 text-xs leading-5 text-[#718573]">
          Anggaran digunakan sebagai batas perencanaan,
          bukan jaminan harga akhir komponen.
        </p>
      </section>

      {/* IKAN */}
      <section className="rounded-3xl border border-[#E0E9DD] bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-[#EAF3E5] p-3 text-[#194D33]">
            <Fish size={23} />
          </div>

          <h3 className="text-lg font-extrabold text-[#194D33]">
            Preferensi Ikan
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {fishOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFish(option.value)}
              aria-pressed={fish === option.value}
              className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${
                fish === option.value
                  ? "border-[#194D33] bg-[#EAF3E5] text-[#194D33]"
                  : "border-[#DDE7D8] text-[#718573] hover:bg-[#F7FAF3]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {/* TANAMAN */}
      <section className="rounded-3xl border border-[#E0E9DD] bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-[#EAF3E5] p-3 text-[#194D33]">
            <Leaf size={23} />
          </div>

          <h3 className="text-lg font-extrabold text-[#194D33]">
            Tanaman yang Diinginkan
          </h3>
        </div>

        <p className="mb-4 text-sm text-[#718573]">
          Kamu bisa memilih lebih dari satu tanaman.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {plantOptions.map((plant) => {
            const selected = plants.includes(plant);

            return (
              <button
                key={plant}
                type="button"
                onClick={() => togglePlant(plant)}
                aria-pressed={selected}
                className={`rounded-2xl border p-4 text-sm font-bold transition ${
                  selected
                    ? "border-[#194D33] bg-[#EAF3E5] text-[#194D33]"
                    : "border-[#DDE7D8] text-[#718573] hover:bg-[#F7FAF3]"
                }`}
              >
                {plant}
              </button>
            );
          })}
        </div>
      </section>

      {/* PRIORITAS DESAIN */}
      <section className="rounded-3xl border border-[#E0E9DD] bg-white p-5 shadow-sm sm:p-8">
        <h3 className="text-lg font-extrabold text-[#194D33]">
          Prioritas Desain
        </h3>

        <p className="mt-2 text-sm text-[#718573]">
          Tentukan aspek yang paling penting bagimu.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPriority(option.value)}
              aria-pressed={priority === option.value}
              className={`rounded-2xl border p-4 text-left transition ${
                priority === option.value
                  ? "border-[#194D33] bg-[#EAF3E5]"
                  : "border-[#DDE7D8] hover:bg-[#F7FAF3]"
              }`}
            >
              <p className="text-sm font-extrabold text-[#194D33]">
                {option.label}
              </p>

              <p className="mt-2 text-xs leading-5 text-[#718573]">
                {option.description}
              </p>
            </button>
          ))}
        </div>

        <label className="mt-6 block text-sm font-bold text-[#194D33]">
          Catatan Tambahan — Opsional
          <textarea
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            maxLength={500}
            rows={4}
            placeholder="Contoh: Sistem mudah dirawat, tidak menghalangi akses balkon, dan aman untuk anak-anak."
            className={inputClass}
          />
        </label>
      </section>

      {/* ERROR */}
      {error && (
        <div
          role="alert"
          className="rounded-2xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* NAVIGASI */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DDE7D8] px-6 py-4 font-bold text-[#194D33] transition hover:bg-[#F4F7ED]"
        >
          <ArrowLeft size={19} />
          Kembali ke Foto
        </button>

        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#194D33] px-6 py-4 font-extrabold text-white transition hover:bg-[#246342]"
        >
          Lanjut ke Generate AI
          <ArrowRight size={19} />
        </button>
      </div>
    </form>
  );
}
