"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Camera,
  ImagePlus,
  ScanLine,
  Sparkles,
  Leaf,
  Sprout,
  Fish,
  ShieldCheck,
  History,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Thermometer,
  Activity,
  RefreshCw,
  X,
  Upload,
  LoaderCircle,
  ChevronDown,
  Trash2,
  BookOpen,
  Info,
} from "lucide-react";

type Diagnosis = {
  id: string;
  plant: string;
  condition: string;
  severity: string;
  description: string;
  symptoms: string[];
  causes: string[];
  treatments: string[];
  safety: string;
  date: string;
};

const plants = [
  "Deteksi otomatis",
  "Pakcoy",
  "Selada",
  "Kangkung",
  "Bayam",
  "Tomat",
  "Cabai",
  "Basil",
];

const scenarios = [
  {
    condition: "Indikasi kekurangan nutrisi",
    severity: "Sedang",
    description:
      "Skenario simulasi menunjukkan daun menguning yang dapat berkaitan dengan ketersediaan nutrisi atau kondisi kualitas air.",
    symptoms: [
      "Daun bagian bawah menguning",
      "Pertumbuhan tanaman melambat",
      "Warna daun kurang merata",
    ],
    causes: [
      "Kemungkinan kekurangan nitrogen",
      "Ketersediaan zat besi rendah",
      "pH air kurang sesuai",
    ],
    treatments: [
      "Periksa pH dan suhu air menggunakan alat ukur.",
      "Periksa kadar amonia, nitrit, dan nitrat.",
      "Evaluasi kondisi akar dan sirkulasi air.",
      "Pantau perubahan kondisi tanaman secara berkala.",
    ],
    safety:
      "Jangan menambahkan pupuk atau suplemen langsung ke sistem sebelum memastikan keamanan bahan bagi ikan dan biofilter.",
  },
  {
    condition: "Indikasi gangguan pada daun",
    severity: "Sedang",
    description:
      "Skenario simulasi menunjukkan bercak atau kerusakan daun yang memerlukan pemeriksaan lebih lanjut.",
    symptoms: [
      "Bercak pada permukaan daun",
      "Perubahan warna jaringan daun",
      "Sebagian daun terlihat rusak",
    ],
    causes: [
      "Kemungkinan gangguan hama",
      "Kelembapan lingkungan tinggi",
      "Kemungkinan infeksi tanaman",
    ],
    treatments: [
      "Periksa bagian bawah daun secara menyeluruh.",
      "Pisahkan tanaman yang mengalami gangguan bila memungkinkan.",
      "Perbaiki sirkulasi udara di sekitar tanaman.",
      "Konsultasikan gejala sebelum menggunakan pestisida.",
    ],
    safety:
      "Hindari penggunaan pestisida yang dapat masuk ke air dan membahayakan ikan maupun mikroorganisme biofilter.",
  },
  {
    condition: "Indikasi stres tanaman",
    severity: "Ringan",
    description:
      "Skenario simulasi menunjukkan tanaman layu yang dapat berkaitan dengan kondisi akar, suhu, atau sirkulasi air.",
    symptoms: [
      "Daun terlihat layu",
      "Batang kurang kokoh",
      "Pertumbuhan kurang optimal",
    ],
    causes: [
      "Sirkulasi air kurang optimal",
      "Suhu lingkungan terlalu tinggi",
      "Kemungkinan gangguan akar",
    ],
    treatments: [
      "Pastikan pompa dan aliran air bekerja normal.",
      "Periksa kondisi akar tanaman.",
      "Evaluasi paparan cahaya dan suhu lingkungan.",
      "Pantau tanaman setelah kondisi diperbaiki.",
    ],
    safety:
      "Pastikan perubahan pengaturan pompa tidak mengganggu kebutuhan oksigen ikan dan sirkulasi sistem.",
  },
  {
    condition: "Tanaman terlihat sehat",
    severity: "Rendah",
    description:
      "Pada skenario simulasi ini tanaman diasumsikan berada dalam kondisi pertumbuhan yang baik.",
    symptoms: [
      "Warna daun relatif merata",
      "Tidak ada kerusakan mencolok",
      "Pertumbuhan terlihat normal",
    ],
    causes: [
      "Kondisi lingkungan diasumsikan stabil",
      "Sirkulasi air diasumsikan memadai",
    ],
    treatments: [
      "Lanjutkan pemantauan kualitas air.",
      "Lakukan pemeriksaan daun dan akar secara rutin.",
      "Jaga kebersihan instalasi akuaponik.",
      "Dokumentasikan perkembangan tanaman.",
    ],
    safety:
      "Pertahankan pemantauan kesehatan ikan dan kualitas air secara berkala.",
  },
];

const panel =
  "rounded-[28px] border border-[#005b45]/10 bg-white/90 shadow-sm backdrop-blur-xl";

const field =
  "w-full rounded-2xl border border-[#005b45]/10 bg-[#fffae7]/70 px-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-[#ff70ad]";

export default function PlantDoctorPage() {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [plant, setPlant] = useState("Deteksi otomatis");
  const [symptom, setSymptom] = useState("");
  const [age, setAge] = useState("");
  const [ph, setPh] = useState("");
  const [temperature, setTemperature] = useState("");
  const [scenario, setScenario] = useState("0");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const [result, setResult] = useState<Diagnosis | null>(null);
  const [history, setHistory] = useState<Diagnosis[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem("symbiology-plant-doctor-demo");

      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    if (!photo) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(photo);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

  useEffect(() => {
    if (!loading) return;

    const timer = window.setInterval(() => {
      setProgress((old) => Math.min(old + 4, 96));
    }, 110);

    return () => window.clearInterval(timer);
  }, [loading]);

  function selectPhoto(file?: File) {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Gunakan foto JPG, PNG, atau WEBP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5 MB.");
      return;
    }

    setError("");
    setPhoto(file);
    setResult(null);
    setSaved(false);
  }

  async function analyzePlant() {
    if (!photo) {
      setError("Upload foto tanaman terlebih dahulu.");
      return;
    }

    setError("");
    setLoading(true);
    setProgress(0);
    setSaved(false);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const selected = scenarios[Number(scenario)] ?? scenarios[0];

    const diagnosis: Diagnosis = {
      ...selected,
      id: crypto.randomUUID(),
      plant: plant === "Deteksi otomatis" ? "Pakcoy (contoh)" : plant,
      date: new Date().toISOString(),
    };

    setProgress(100);
    setResult(diagnosis);
    setLoading(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveDiagnosis() {
    if (!result || saved) return;

    const updated = [
      result,
      ...history.filter((item) => item.id !== result.id),
    ].slice(0, 30);

    try {
      localStorage.setItem(
        "symbiology-plant-doctor-demo",
        JSON.stringify(updated)
      );

      setHistory(updated);
      setSaved(true);
    } catch {
      setError("Riwayat tidak dapat disimpan pada browser.");
    }
  }

  function deleteHistory(id: string) {
    const updated = history.filter((item) => item.id !== id);

    try {
      localStorage.setItem(
        "symbiology-plant-doctor-demo",
        JSON.stringify(updated)
      );

      setHistory(updated);

      if (result?.id === id) setSaved(false);
    } catch {
      setError("Riwayat tidak dapat dihapus.");
    }
  }

  function resetScan() {
    setPhoto(null);
    setResult(null);
    setSaved(false);
    setProgress(0);
    setSymptom("");
    setAge("");
    setPh("");
    setTemperature("");
    setError("");
    setPlant("Deteksi otomatis");
    setScenario("0");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="space-y-6 pb-10 text-[#005b45]">

      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/ai-studio"
          className="inline-flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft size={19} />
          AI Studio
        </Link>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm"
        >
          <History size={18} />
          Riwayat
          <span className="rounded-full bg-[#ffe0ee] px-2 py-1 text-xs">
            {history.length}
          </span>
        </button>
      </div>

      {/* DEMO NOTICE */}

      <div className="flex items-start gap-3 rounded-2xl border border-[#005b45]/10 bg-[#e2f0e9] p-4 text-xs leading-6">
        <Info size={20} className="mt-0.5 shrink-0" />
        <p>
          <strong>Prototype Demo.</strong> Hasil diagnosis merupakan
          simulasi yang dipilih melalui skenario demo, bukan analisis
          foto oleh AI sungguhan.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* HISTORY */}

      {showHistory && (
        <div className={`${panel} space-y-4 p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Riwayat Diagnosis</h2>
              <p className="mt-1 text-xs opacity-60">
                Riwayat simulasi pada browser ini
              </p>
            </div>

            <button onClick={() => setShowHistory(false)} aria-label="Tutup riwayat">
              <X size={22} />
            </button>
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl bg-[#fffae7] p-8 text-center">
              <History size={32} className="mx-auto opacity-50" />
              <p className="mt-3 text-sm">Belum ada diagnosis tersimpan.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl bg-[#fffae7] p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#e2f0e9]">
                  <Leaf size={23} />
                </div>

                <button
                  onClick={() => {
                    setPhoto(null);
                    setResult(item);
                    setSaved(true);
                    setShowHistory(false);
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="font-bold">{item.plant}</p>
                  <p className="text-xs opacity-70">{item.condition}</p>
                  <p className="mt-1 text-[10px] opacity-50">
                    {new Date(item.date).toLocaleString("id-ID")}
                  </p>
                </button>

                <button
                  onClick={() => deleteHistory(item.id)}
                  aria-label="Hapus riwayat"
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {!result ? (
        <>

          {/* HERO */}

          <div className="relative overflow-hidden rounded-[32px] bg-[#005b45] p-7 text-[#fffae7] md:p-12">
            <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#ff70ad]/20 blur-3xl" />

            <Leaf className="pointer-events-none absolute -bottom-16 right-0 h-72 w-72 -rotate-12 text-white/10" />

            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold tracking-widest text-[#ff70ad]">
                <Sparkles size={15} />
                SMART PLANT CARE
              </span>

              <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                AI Plant
                <span className="block text-[#ff70ad]">Doctor.</span>
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">
                Kenali kondisi tanaman, pahami kemungkinan gangguan,
                dan rawat ekosistem akuaponikmu dengan lebih baik.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["Plant Scanner", "Smart Diagnosis", "Fish Safety"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/20 px-3 py-2 text-[10px] font-bold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid items-start gap-5 lg:grid-cols-2">

            {/* UPLOAD PHOTO */}

            <div className={`${panel} space-y-5 p-5 md:p-7`}>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#ffe0ee] p-3">
                  <ScanLine size={24} />
                </div>

                <div>
                  <h2 className="text-lg font-black">Scan Tanaman</h2>
                  <p className="text-xs opacity-60">
                    Mulai dengan foto tanamanmu
                  </p>
                </div>
              </div>

              <input
                ref={galleryRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => {
                  selectPhoto(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />

              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(event) => {
                  selectPhoto(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />

              {preview ? (
                <div className="relative overflow-hidden rounded-[24px] bg-[#e2f0e9]">
                  <img
                    src={preview}
                    alt="Preview tanaman"
                    className="h-72 w-full object-contain"
                  />

                  <button
                    disabled={loading}
                    onClick={() => setPhoto(null)}
                    aria-label="Hapus foto"
                    className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white"
                  >
                    <X size={19} />
                  </button>

                  {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#005b45]/65 text-white backdrop-blur-sm">
                      <ScanLine size={80} className="animate-pulse text-[#ff70ad]" />
                      <p className="mt-4 font-bold">Simulasi scanning...</p>
                      <p className="mt-2 text-2xl font-black">{progress}%</p>

                      <div className="mt-4 h-2 w-3/4 overflow-hidden rounded-full bg-white/20">
                        <div
                          className="h-full rounded-full bg-[#ff70ad] transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => galleryRef.current?.click()}
                  className="flex min-h-72 w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#005b45]/25 bg-[#e2f0e9]/70 p-6 text-center transition hover:bg-[#e2f0e9]"
                >
                  <div className="rounded-[25px] bg-white p-5 shadow-sm">
                    <ImagePlus size={40} />
                  </div>

                  <p className="mt-5 font-extrabold">Upload Foto Tanaman</p>

                  <p className="mt-2 text-xs leading-6 opacity-60">
                    Gunakan foto yang jelas dengan pencahayaan cukup.
                  </p>

                  <p className="mt-2 text-[10px] font-bold opacity-50">
                    JPG, PNG, WEBP - Maks. 5 MB
                  </p>
                </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={loading}
                  onClick={() => cameraRef.current?.click()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#005b45] p-4 text-sm font-bold text-white disabled:opacity-50"
                >
                  <Camera size={20} />
                  Kamera
                </button>

                <button
                  disabled={loading}
                  onClick={() => galleryRef.current?.click()}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#ffe0ee] p-4 text-sm font-bold disabled:opacity-50"
                >
                  <Upload size={20} />
                  Galeri
                </button>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-[#fffae7] p-4">
                <Info size={19} className="shrink-0" />
                <p className="text-xs leading-6 opacity-75">
                  Foto terbaik menampilkan bagian tanaman yang mengalami
                  gangguan, termasuk daun, batang, atau akar.
                </p>
              </div>
            </div>

            {/* PLANT INFORMATION */}

            <div className={`${panel} space-y-5 p-5 md:p-7`}>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#e2f0e9] p-3">
                  <Sprout size={25} />
                </div>

                <div>
                  <h2 className="text-lg font-black">Informasi Tanaman</h2>
                  <p className="text-xs opacity-60">
                    Lengkapi informasi tambahan
                  </p>
                </div>
              </div>

              <label className="block space-y-2">
                <span className="text-xs font-bold">Jenis tanaman</span>

                <select
                  value={plant}
                  disabled={loading}
                  onChange={(event) => setPlant(event.target.value)}
                  className={field}
                >
                  {plants.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold">Usia tanaman (opsional)</span>

                <input
                  value={age}
                  disabled={loading}
                  onChange={(event) => setAge(event.target.value)}
                  placeholder="Contoh: 21 hari"
                  className={field}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold">Gejala yang terlihat</span>

                <textarea
                  value={symptom}
                  disabled={loading}
                  onChange={(event) => setSymptom(event.target.value)}
                  placeholder="Contoh: daun menguning dan pertumbuhan melambat..."
                  className={`${field} min-h-28 resize-y`}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold">Skenario simulasi diagnosis</span>

                <select
                  value={scenario}
                  disabled={loading}
                  onChange={(event) => setScenario(event.target.value)}
                  className={field}
                >
                  <option value="0">Kekurangan nutrisi</option>
                  <option value="1">Gangguan pada daun</option>
                  <option value="2">Tanaman layu</option>
                  <option value="3">Tanaman sehat</option>
                </select>
              </label>

              <div className="rounded-2xl bg-[#e2f0e9] p-4">
                <div className="flex items-center gap-2">
                  <Activity size={19} />
                  <p className="text-sm font-extrabold">Kualitas Air</p>
                </div>

                <p className="mt-2 text-xs opacity-60">
                  Input manual untuk preview integrasi IoT.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <label className="space-y-2">
                    <span className="flex items-center gap-1 text-xs font-bold">
                      <Droplets size={15} />
                      pH Air
                    </span>

                    <input
                      type="number"
                      min="0"
                      max="14"
                      step="0.1"
                      value={ph}
                      disabled={loading}
                      onChange={(event) => setPh(event.target.value)}
                      placeholder="6.8"
                      className="w-full rounded-xl bg-white p-3 text-sm outline-none"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="flex items-center gap-1 text-xs font-bold">
                      <Thermometer size={15} />
                      Suhu Air
                    </span>

                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      disabled={loading}
                      onChange={(event) => setTemperature(event.target.value)}
                      placeholder="27 C"
                      className="w-full rounded-xl bg-white p-3 text-sm outline-none"
                    />
                  </label>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={analyzePlant}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff70ad] p-4 font-extrabold transition hover:brightness-95 disabled:opacity-50"
              >
                {loading ? (
                  <LoaderCircle size={22} className="animate-spin" />
                ) : (
                  <Sparkles size={22} />
                )}

                {loading ? "Memproses Simulasi..." : "Analisis Tanaman"}
              </button>
            </div>
          </div>

          {/* SCANNER GUIDE */}

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Camera,
                title: "Capture",
                description: "Ambil foto bagian tanaman yang mengalami gangguan.",
              },
              {
                icon: ScanLine,
                title: "Analyze",
                description: "Lihat simulasi proses analisis kesehatan tanaman.",
              },
              {
                icon: ShieldCheck,
                title: "Take Care",
                description: "Pelajari langkah pemeriksaan dan penanganan.",
              },
            ].map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className={`rounded-[25px] p-6 ${
                  index === 1
                    ? "bg-[#005b45] text-[#fffae7]"
                    : index === 2
                    ? "bg-[#ffe0ee]"
                    : "bg-white"
                }`}
              >
                <Icon size={28} />
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-xs leading-6 opacity-70">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>

          {/* RESULT HEADER */}

          <div className="flex items-center justify-between">
            <button
              onClick={resetScan}
              className="flex items-center gap-2 text-sm font-bold"
            >
              <ArrowLeft size={19} />
              Scan Baru
            </button>

            <span className="rounded-full bg-[#ffe0ee] px-4 py-2 text-xs font-bold">
              HASIL SIMULASI
            </span>
          </div>

          {/* RESULT BENTO GRID */}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            <div className={`${panel} overflow-hidden p-3`}>
              {preview ? (
                <img
                  src={preview}
                  alt="Tanaman yang diunggah"
                  className="h-72 w-full rounded-[22px] object-contain"
                />
              ) : (
                <div className="flex h-72 flex-col items-center justify-center rounded-[22px] bg-[#e2f0e9]">
                  <Leaf size={65} />
                  <p className="mt-4 text-sm font-bold">{result.plant}</p>
                  <p className="mt-1 text-xs opacity-60">Foto tidak disimpan</p>
                </div>
              )}
            </div>

            <div className="rounded-[28px] bg-[#005b45] p-7 text-[#fffae7]">
              <span className="text-[10px] font-bold tracking-widest text-[#ff70ad]">
                PLANT IDENTIFICATION
              </span>

              <Leaf size={36} className="mt-5 text-[#ff70ad]" />

              <h1 className="mt-4 text-3xl font-black">{result.plant}</h1>

              <div className="my-5 border-t border-white/15" />

              <p className="text-xs opacity-60">Kondisi tanaman</p>

              <h2 className="mt-2 text-xl font-black text-[#ff70ad]">
                {result.condition}
              </h2>

              <p className="mt-4 text-xs leading-6 opacity-70">
                {result.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:col-span-2 xl:col-span-1 xl:grid-cols-1">
              <div className="rounded-[28px] bg-[#ffe0ee] p-6">
                <AlertTriangle size={27} />
                <p className="mt-3 text-xs font-bold">TINGKAT KEPARAHAN</p>
                <h2 className="mt-2 text-3xl font-black">{result.severity}</h2>
                <p className="mt-2 text-xs opacity-60">Skenario demo</p>
              </div>

              <div className="rounded-[28px] bg-[#e2f0e9] p-6">
                <Fish size={28} />
                <h2 className="mt-3 text-lg font-black">Aquaponics Safety</h2>
                <p className="mt-2 text-xs leading-6">
                  Penanganan tanaman harus mempertimbangkan kesehatan ikan.
                </p>
              </div>
            </div>

            {/* SYMPTOMS */}

            <div className={`${panel} p-6`}>
              <div className="flex items-center gap-2">
                <ScanLine size={23} />
                <h2 className="text-lg font-black">Gejala Tanaman</h2>
              </div>

              <div className="mt-5 space-y-3">
                {result.symptoms.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl bg-[#fffae7] p-3 text-sm"
                  >
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* POSSIBLE CAUSES */}

            <div className={`${panel} p-6`}>
              <div className="flex items-center gap-2">
                <Activity size={23} />
                <h2 className="text-lg font-black">Kemungkinan Penyebab</h2>
              </div>

              <div className="mt-5 space-y-3">
                {result.causes.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl bg-[#ffe0ee]/60 p-3 text-sm"
                  >
                    <AlertTriangle size={17} className="mt-0.5 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* SAFETY */}

            <div className="rounded-[28px] bg-[#005b45] p-6 text-[#fffae7]">
              <ShieldCheck size={35} className="text-[#ff70ad]" />

              <h2 className="mt-4 text-xl font-black">
                Fish Safety First.
              </h2>

              <p className="mt-4 text-sm leading-7 opacity-85">
                {result.safety}
              </p>
            </div>

            {/* TREATMENT */}

            <div className={`${panel} p-6 md:col-span-2 xl:col-span-3`}>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#e2f0e9] p-3">
                  <BookOpen size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black">Rekomendasi Penanganan</h2>
                  <p className="mt-1 text-xs opacity-60">
                    Langkah pemeriksaan awal
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {result.treatments.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 rounded-2xl bg-[#fffae7] p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#005b45] text-sm font-black text-white">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <p className="pt-1 text-sm leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ACTIONS */}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={saveDiagnosis}
              disabled={saved}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#005b45] p-4 font-bold text-white disabled:opacity-60"
            >
              <CheckCircle2 size={21} />
              {saved ? "Diagnosis Tersimpan" : "Simpan Diagnosis"}
            </button>

            <button
              onClick={resetScan}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#ff70ad] p-4 font-bold"
            >
              <RefreshCw size={21} />
              Scan Tanaman Lain
            </button>
          </div>
        </>
      )}
    </section>
  );
}