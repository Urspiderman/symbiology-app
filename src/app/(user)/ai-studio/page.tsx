
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Calculator,
  Leaf,
  Ruler,
  Save,
} from "lucide-react";

const features = [
  {
    icon: Ruler,
    title: "Analisis Ruangan",
    description: "Sesuaikan rancangan dengan ukuran ruang yang tersedia.",
  },
  {
    icon: BrainCircuit,
    title: "Rekomendasi Cerdas",
    description: "Dapatkan pilihan ikan dan tanaman yang sesuai.",
  },
  {
    icon: Calculator,
    title: "Estimasi Biaya",
    description: "Perkirakan kebutuhan peralatan dan anggaran.",
  },
  {
    icon: Save,
    title: "Simpan Desain",
    description: "Kelola rancangan akuaponik favoritmu.",
  },
];

export default function AIStudioPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <section className="relative overflow-hidden rounded-[32px] bg-[#194D33] p-7 text-white sm:p-12">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold">
            <Leaf size={16} />
            SYMBIOLOGY AI STUDIO
          </div>

          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
            Rancang Akuaponik
            <span className="text-[#FFDA57]"> Impianmu</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            Ubah ruang kosong menjadi ekosistem akuaponik.
            Masukkan ukuran ruangan dan anggaran, lalu dapatkan
            rekomendasi rancangan yang sesuai kebutuhanmu.
          </p>

          <Link
            href="/ai-studio/input"
            className="mt-7 inline-flex items-center gap-3 rounded-2xl bg-[#FFDA57] px-6 py-3.5 font-extrabold text-[#194D33] transition hover:brightness-95"
          >
            Mulai Mendesain
            <ArrowRight size={19} />
          </Link>
        </div>

        <Leaf
          size={240}
          strokeWidth={0.6}
          className="pointer-events-none absolute -bottom-16 -right-12 rotate-[-20deg] text-white/10"
        />
      </section>

      <section>
        <h2 className="text-2xl font-extrabold text-[#194D33]">
          Apa yang bisa kamu lakukan?
        </h2>
        <p className="mt-2 text-sm text-[#718573]">
          Semua yang kamu butuhkan untuk memulai akuaponik.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-3xl border border-[#E0E9DD] bg-white p-6"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-[#EAF3E5] p-3 text-[#194D33]">
                <Icon size={25} />
              </div>
              <h3 className="font-extrabold text-[#194D33]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#718573]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Link
        href="/ai-studio/saved"
        className="inline-flex items-center gap-2 font-bold text-[#28784A]"
      >
        <Save size={18} />
        Lihat desain tersimpan
        <ArrowRight size={16} />
      </Link>
    </main>
  );
}
