
"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  RefreshCw,
  ScanEye,
  ShieldAlert,
  Upload,
} from "lucide-react";

export type SpaceAnalysis = {
  isSuitablePhoto: boolean;
  roomType: string;
  description: string;
  lighting: string;
  visibleObjects: string[];
  obstacles: string[];
  potentialPlacement: string[];
  recommendations: string[];
  warnings: string[];
  confidence: "rendah" | "sedang" | "tinggi";
};

export type SpacePhotoData = {
  image: File;
  analysis: SpaceAnalysis;
};

type SpaceFormProps = {
  onContinue: (data: SpacePhotoData) => void;
};

export default function SpaceForm({
  onContinue,
}: SpaceFormProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [analysis, setAnalysis] =
    useState<SpaceAnalysis | null>(null);

  const [aiConsent, setAiConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Format foto harus JPG, PNG, atau WebP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setAnalysis(null);
    setError("");
    event.target.value = "";
  }

  async function analyzePhoto() {
    if (!image) {
      setError("Silakan pilih foto ruangan terlebih dahulu.");
      return;
    }

    if (!aiConsent) {
      setError(
        "Setujui pengiriman foto ke Gemini terlebih dahulu."
      );
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("aiConsent", "true");

      const response = await fetch(
        "/api/ai/analyze-photo",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Gagal menganalisis foto."
        );
      }

      setAnalysis(result.analysis as SpaceAnalysis);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat analisis."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetPhoto() {
    setImage(null);
    setPreview("");
    setAnalysis(null);
    setAiConsent(false);
    setError("");
  }

  function continueToNextStep() {
    if (!image || !analysis) return;

    onContinue({
      image,
      analysis,
    });
  }

  const analysisSections = analysis
    ? [
        {
          title: "Objek yang Terdeteksi",
          items: analysis.visibleObjects,
        },
        {
          title: "Hambatan Ruangan",
          items: analysis.obstacles,
        },
        {
          title: "Potensi Penempatan Akuaponik",
          items: analysis.potentialPlacement,
        },
        {
          title: "Rekomendasi Awal AI",
          items: analysis.recommendations,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-[#E0E9DD] bg-white p-5 shadow-sm sm:p-8">
        <div className="mb-6">
          <span className="inline-flex rounded-full bg-[#EAF3E5] px-4 py-2 text-xs font-extrabold text-[#194D33]">
            LANGKAH 1 — FOTO RUANGAN
          </span>

          <h2 className="mt-4 text-2xl font-extrabold text-[#194D33]">
            Tunjukkan Ruanganmu
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#718573]">
            Ambil foto menggunakan kamera atau unggah
            dari galeri. AI SYMBIOLOGY akan menganalisis
            kondisi visual ruangan untuk membantu
            perencanaan sistem akuaponik.
          </p>
        </div>

        <input
          ref={cameraRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={handleImage}
          className="hidden"
          aria-label="Ambil foto ruangan"
        />

        <input
          ref={galleryRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImage}
          className="hidden"
          aria-label="Pilih foto dari galeri"
        />

        {!preview ? (
          <div className="rounded-3xl border-2 border-dashed border-[#C7D9C4] bg-[#F7FAF3] p-7 text-center sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E5F0DF] text-[#194D33]">
              <ImagePlus size={36} />
            </div>

            <h3 className="mt-5 text-lg font-extrabold text-[#194D33]">
              Tambahkan Foto Ruangan
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#718573]">
              Pastikan area yang akan digunakan terlihat
              jelas, termasuk lantai, dinding, dan benda
              di sekitarnya.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#194D33] px-6 py-3 font-bold text-white transition hover:bg-[#246342]"
              >
                <Camera size={19} />
                Ambil Foto
              </button>

              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFDA57] px-6 py-3 font-bold text-[#194D33] transition hover:brightness-95"
              >
                <Upload size={19} />
                Pilih dari Galeri
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="overflow-hidden rounded-3xl border border-[#E0E9DD] bg-[#F7FAF3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Foto ruangan pengguna"
                className="max-h-[480px] w-full object-contain"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => galleryRef.current?.click()}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl border border-[#DDE7D8] px-4 py-3 text-sm font-bold text-[#194D33] disabled:opacity-50"
              >
                <RefreshCw size={17} />
                Ganti Foto
              </button>

              <button
                type="button"
                onClick={resetPhoto}
                disabled={loading}
                className="rounded-xl px-4 py-3 text-sm font-bold text-[#718573] disabled:opacity-50"
              >
                Hapus Foto
              </button>
            </div>

            {!analysis && (
              <div className="space-y-4">
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#DDE7D8] bg-[#F4F7ED] p-4 text-sm leading-6 text-[#536B57]">
                  <input
                    type="checkbox"
                    checked={aiConsent}
                    onChange={(event) =>
                      setAiConsent(event.target.checked)
                    }
                    disabled={loading}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#194D33]"
                  />

                  <span>
                    Saya setuju foto ruangan saya dikirim
                    ke Google Gemini untuk dianalisis.
                    Saya memahami bahwa pada free tier,
                    data dapat digunakan Google untuk
                    meningkatkan produknya.
                  </span>
                </label>

                <button
                  type="button"
                  onClick={analyzePhoto}
                  disabled={loading || !aiConsent}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#FFDA57] px-6 py-4 font-extrabold text-[#194D33] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        size={20}
                        className="animate-spin"
                      />
                      AI Sedang Menganalisis...
                    </>
                  ) : (
                    <>
                      <ScanEye size={20} />
                      Analisis Foto dengan AI
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}
      </section>

      {analysis && (
        <section className="space-y-6 rounded-3xl border border-[#E0E9DD] bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[#EAF3E5] p-3 text-[#194D33]">
              <ScanEye size={24} />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-[#194D33]">
                Hasil Analisis AI
              </h3>

              <p className="mt-1 text-xs text-[#718573]">
                Keyakinan penilaian AI:{" "}
                {analysis.confidence}
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F4F7ED] p-5">
            <p className="text-sm font-extrabold text-[#194D33]">
              {analysis.roomType}
            </p>

            <p className="mt-2 text-sm leading-7 text-[#536B57]">
              {analysis.description}
            </p>
          </div>

          <div>
            <h4 className="font-extrabold text-[#194D33]">
              Kondisi Pencahayaan
            </h4>

            <p className="mt-2 text-sm leading-6 text-[#718573]">
              {analysis.lighting}
            </p>
          </div>

          {analysisSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 font-extrabold text-[#194D33]">
                {section.title}
              </h4>

              {section.items.length > 0 ? (
                <ul className="space-y-3">
                  {section.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm leading-6 text-[#718573]"
                    >
                      <CheckCircle2
                        size={18}
                        className="mt-1 shrink-0 text-[#28784A]"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#718573]">
                  Tidak ada temuan khusus.
                </p>
              )}
            </div>
          ))}

          {analysis.warnings.length > 0 && (
            <div className="rounded-2xl bg-amber-50 p-5">
              <h4 className="flex items-center gap-2 font-extrabold text-amber-800">
                <ShieldAlert size={19} />
                Hal yang Perlu Diperiksa
              </h4>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-800">
                {analysis.warnings.map((warning, index) => (
                  <li key={index}>
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.isSuitablePhoto ? (
            <button
              type="button"
              onClick={continueToNextStep}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#194D33] px-6 py-4 font-extrabold text-white transition hover:bg-[#246342]"
            >
              Lanjut ke Detail Ruangan
              <ArrowRight size={19} />
            </button>
          ) : (
            <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
              AI belum dapat mengidentifikasi ruangan
              dengan cukup baik. Silakan unggah foto
              lain yang lebih jelas.
            </div>
          )}

          <p className="text-xs leading-5 text-[#718573]">
            Analisis ini berdasarkan foto yang terlihat.
            Ukuran sebenarnya, kekuatan lantai,
            pencahayaan aktual, serta keamanan
            instalasi masih harus diverifikasi.
          </p>
        </section>
      )}
    </div>
  );
}
