
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Camera,
  Check,
  Fish,
  Leaf,
  LoaderCircle,
  Ruler,
  Sparkles,
  Wallet,
} from "lucide-react";

import SpaceForm, {
  type SpacePhotoData,
} from "@/components/ai-studio/SpaceForm";

import SpaceDetailsForm, {
  type SpaceDetails,
} from "@/components/ai-studio/SpaceDetailsForm";

import {
  saveDesignImage,
} from "@/lib/ai/design-image-storage";

type GeneratedDesign = {
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
  createdAt: string;
  input: SpaceDetails & {
    analysis: SpacePhotoData["analysis"];
  };
  recommendation: {
    summary: string;
    systemType: string;
    recommendedFish: string;
    recommendedPlants: string[];
    placement: string;
    maintenance: string[];
    safetyNotes: string[];
  };
};

const steps = [
  {
    number: 1,
    title: "Foto Ruangan",
    icon: Camera,
  },
  {
    number: 2,
    title: "Detail Ruangan",
    icon: Ruler,
  },
  {
    number: 3,
    title: "Generate AI",
    icon: Sparkles,
  },
];

const fishLabels: Record<string, string> = {
  nila: "Ikan Nila",
  lele: "Ikan Lele",
  mas: "Ikan Mas",
  hias: "Ikan Hias",
  "belum-tahu": "Rekomendasi AI",
};

const priorityLabels: Record<
  SpaceDetails["priority"],
  string
> = {
  "hemat-biaya": "Hemat Biaya",
  "hemat-ruang": "Hemat Ruang",
  produktivitas: "Produktivitas",
};

export default function AIStudioInputPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [photoData, setPhotoData] =
    useState<SpacePhotoData | null>(null);

  const [details, setDetails] =
    useState<SpaceDetails | null>(null);

  const [generating, setGenerating] =
    useState(false);

  const [generationStage, setGenerationStage] =
    useState("");

  const [error, setError] = useState("");

  function goToStep(nextStep: number) {
    setStep(nextStep);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handlePhotoContinue(data: SpacePhotoData) {
    setPhotoData(data);
    setDetails(null);
    goToStep(2);
  }

  function handleDetailsContinue(data: SpaceDetails) {
    setDetails(data);
    goToStep(3);
  }

  async function handleGenerate() {
    if (!photoData || !details || generating) {
      return;
    }

    setGenerating(true);
    setError("");

    try {
      // TAHAP A: Generate rekomendasi desain
      setGenerationStage(
        "Gemini sedang menyusun rancangan akuaponik..."
      );

      const designResponse = await fetch(
        "/api/ai/generate-design",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...details,
            analysis: photoData.analysis,
          }),
        }
      );

      const designResult: {
        success?: boolean;
        error?: string;
        design?: GeneratedDesign;
      } = await designResponse.json();

      if (
        !designResponse.ok ||
        !designResult.success ||
        !designResult.design
      ) {
        throw new Error(
          designResult.error ||
            "Gagal membuat rekomendasi desain."
        );
      }

      const design = designResult.design;

      if (!design.id) {
        throw new Error(
          "ID rancangan tidak tersedia."
        );
      }

      // TAHAP B: Generate foto AFTER
      setGenerationStage(
        "Gemini sedang menambahkan akuaponik ke foto ruanganmu..."
      );

      const formData = new FormData();

      formData.append(
        "image",
        photoData.image
      );

      formData.append(
        "design",
        JSON.stringify(design)
      );

      // SpaceForm sudah meminta persetujuan AI
      // sebelum analisis foto.
      formData.append(
        "aiConsent",
        "true"
      );

      const imageResponse = await fetch(
        "/api/ai/render-photo",
        {
          method: "POST",
          body: formData,
        }
      );

      const imageResult: {
        success?: boolean;
        error?: string;
        image?: string;
      } = await imageResponse.json();

      if (
        !imageResponse.ok ||
        !imageResult.success ||
        !imageResult.image
      ) {
        throw new Error(
          imageResult.error ||
            "Gemini gagal menghasilkan foto AFTER."
        );
      }

      // TAHAP C: Simpan hasil
      setGenerationStage(
        "Menyimpan foto hasil rancangan..."
      );

      await saveDesignImage(
        design.id,
        imageResult.image
      );

      sessionStorage.setItem(
        `symbiology-design-${design.id}`,
        JSON.stringify(design)
      );

      // TAHAP D: Buka halaman hasil
      router.push(
        `/ai-studio/result/${encodeURIComponent(
          design.id
        )}`
      );
    } catch (err) {
      console.error(
        "SYMBIOLOGY generate error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat membuat desain."
      );
    } finally {
      setGenerating(false);
      setGenerationStage("");
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-7 px-4 py-8 sm:px-6">
      <Link
        href="/ai-studio"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#08785C]"
      >
        <ArrowLeft size={17} />
        Kembali ke AI Studio
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold text-[#005B45]">
          Rancang Akuaponik dengan AI
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#62766D]">
          Upload foto ruangan, lengkapi kebutuhan,
          lalu lihat visualisasi akuaponik langsung
          pada ruanganmu.
        </p>
      </div>

      {/* INDIKATOR LANGKAH */}
      <div className="grid grid-cols-3 gap-3">
        {steps.map((item) => {
          const Icon = item.icon;
          const active = step === item.number;
          const completed = step > item.number;

          return (
            <div
              key={item.number}
              className={`rounded-2xl p-3 text-center sm:p-4 ${
                active || completed
                  ? "bg-[#005B45] text-white"
                  : "bg-[#E2F0E9] text-[#62766D]"
              }`}
            >
              <div className="mb-2 flex justify-center">
                {completed ? (
                  <Check size={20} />
                ) : (
                  <Icon size={20} />
                )}
              </div>

              <p className="text-xs font-bold sm:text-sm">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <SpaceForm
          onContinue={handlePhotoContinue}
        />
      )}

      {/* STEP 2 */}
      {step === 2 && photoData && (
        <SpaceDetailsForm
          photoData={photoData}
          initialData={details}
          onBack={() => goToStep(1)}
          onContinue={handleDetailsContinue}
        />
      )}

      {/* STEP 3 */}
      {step === 3 && photoData && details && (
        <section className="space-y-6 rounded-3xl border border-[#DCE6DB] bg-white p-5 shadow-sm sm:p-8">
          <div className="inline-flex rounded-2xl bg-[#E2F0E9] p-3 text-[#005B45]">
            <Sparkles size={26} />
          </div>

          <div>
            <span className="text-xs font-extrabold text-[#08785C]">
              LANGKAH 3 — GENERATE FOTO AI
            </span>

            <h2 className="mt-3 text-2xl font-extrabold text-[#005B45]">
              Siap Membuat Visualisasi Akuaponik
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#62766D]">
              Gemini akan menggunakan foto ruangan
              asli dan informasi kebutuhanmu untuk
              membuat satu foto hasil desain.
            </p>
          </div>

          {/* RINGKASAN FOTO */}
          <div className="rounded-2xl bg-[#F3F7F2] p-5">
            <p className="text-xs font-bold text-[#62766D]">
              Hasil Analisis Foto
            </p>

            <p className="mt-2 font-extrabold text-[#005B45]">
              {photoData.analysis.roomType}
            </p>

            <p className="mt-2 text-sm leading-6 text-[#526A5E]">
              {photoData.analysis.description}
            </p>
          </div>

          {/* RINGKASAN KEBUTUHAN */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#DCE6DB] p-5">
              <Ruler
                size={22}
                className="text-[#08785C]"
              />

              <p className="mt-3 text-xs text-[#62766D]">
                Luas Area
              </p>

              <p className="mt-1 text-xl font-extrabold text-[#005B45]">
                {(
                  details.length * details.width
                ).toLocaleString("id-ID", {
                  maximumFractionDigits: 2,
                })}{" "}
                m²
              </p>
            </div>

            <div className="rounded-2xl border border-[#DCE6DB] p-5">
              <Wallet
                size={22}
                className="text-[#08785C]"
              />

              <p className="mt-3 text-xs text-[#62766D]">
                Anggaran
              </p>

              <p className="mt-1 text-xl font-extrabold text-[#005B45]">
                Rp
                {details.budget.toLocaleString(
                  "id-ID"
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-[#DCE6DB] p-5">
              <Fish
                size={22}
                className="text-[#08785C]"
              />

              <p className="mt-3 text-xs text-[#62766D]">
                Preferensi Ikan
              </p>

              <p className="mt-1 font-extrabold text-[#005B45]">
                {fishLabels[details.fish] ||
                  details.fish}
              </p>
            </div>

            <div className="rounded-2xl border border-[#DCE6DB] p-5">
              <Leaf
                size={22}
                className="text-[#08785C]"
              />

              <p className="mt-3 text-xs text-[#62766D]">
                Pilihan Tanaman
              </p>

              <p className="mt-1 font-extrabold text-[#005B45]">
                {details.plants.join(", ")}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DCE6DB] p-5">
            <p className="text-sm font-extrabold text-[#005B45]">
              Prioritas Desain
            </p>

            <p className="mt-2 text-sm text-[#62766D]">
              {priorityLabels[details.priority]}
            </p>

            {details.notes && (
              <p className="mt-3 text-sm leading-6 text-[#62766D]">
                {details.notes}
              </p>
            )}
          </div>

          {/* LOADING */}
          {generating && (
            <div
              role="status"
              className="rounded-2xl bg-[#E2F0E9] p-6 text-center"
            >
              <LoaderCircle
                size={30}
                className="mx-auto animate-spin text-[#005B45]"
              />

              <p className="mt-4 font-extrabold text-[#005B45]">
                Sedang Membuat Desain
              </p>

              <p className="mt-2 text-sm text-[#62766D]">
                {generationStage}
              </p>

              <p className="mt-2 text-xs text-[#62766D]">
                Jangan tutup halaman selama
                proses berlangsung.
              </p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="rounded-2xl bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* TOMBOL */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={generating}
              onClick={() => goToStep(2)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#DCE6DB] px-5 py-4 font-bold text-[#005B45] disabled:opacity-50"
            >
              <ArrowLeft size={18} />
              Ubah Detail
            </button>

            <button
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="inline-flex flex-1 items-center justify-center gap-3 rounded-2xl bg-[#005B45] px-6 py-4 font-extrabold text-white transition hover:bg-[#246342] disabled:opacity-60"
            >
              {generating ? (
                <>
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />
                  Sedang Generate Foto...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Foto Akuaponik
                </>
              )}
            </button>
          </div>

          <p className="text-xs leading-6 text-[#62766D]">
            Hasil foto adalah visualisasi konsep AI,
            bukan rancangan teknik yang telah
            diverifikasi. Pastikan kondisi struktur,
            listrik, dan keamanan air diperiksa
            sebelum pemasangan.
          </p>
        </section>
      )}
    </main>
  );
}
