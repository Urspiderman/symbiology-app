import Link from "next/link";

import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Calculator,
  Leaf,
  Ruler,
  Bookmark,
  Sparkles,
  ScanLine,
  Fish,
  Sprout,
  ShieldCheck,
  Box,
  LayoutGrid,
  WandSparkles,
} from "lucide-react";

const capabilities = [
  {
    icon: Ruler,
    title: "Adaptive Design",
    description: "Rancangan sesuai ukuran ruang yang tersedia.",
  },
  {
    icon: BrainCircuit,
    title: "Smart Recommendation",
    description: "Rekomendasi ikan dan tanaman yang sesuai.",
  },
  {
    icon: Calculator,
    title: "Budget Planning",
    description: "Perencanaan kebutuhan dan anggaran instalasi.",
  },
  {
    icon: ShieldCheck,
    title: "Aquaponics Safety",
    description: "Perawatan dengan mempertimbangkan ekosistem.",
  },
];

export default function AIStudioPage() {
  return (
    <section className="space-y-7 pb-10 text-[#005B45]">

      {/* HERO */}

      <div className="relative isolate overflow-hidden rounded-[34px] bg-[#005B45] px-7 py-10 text-[#FFFAE7] md:px-12 md:py-14">

        <div className="pointer-events-none absolute -right-20 -top-28 h-96 w-96 rounded-full bg-[#FF70AD]/20 blur-[100px]" />

        <div className="pointer-events-none absolute -bottom-40 right-16 h-80 w-80 rounded-full bg-white/10 blur-[80px]" />

        <div className="pointer-events-none absolute right-12 top-12 hidden h-64 w-64 rounded-full border border-white/10 lg:block" />

        <div className="pointer-events-none absolute right-20 top-20 hidden h-48 w-48 rounded-full border border-white/10 lg:block" />

        <Sprout
          strokeWidth={0.8}
          className="pointer-events-none absolute -bottom-12 right-8 hidden h-80 w-80 -rotate-12 text-white/10 md:block"
        />

        <div className="relative max-w-3xl">

          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-bold tracking-[0.2em] text-[#FF70AD] backdrop-blur-md">
            <Sparkles size={15} />
            SYMBIOLOGY AI STUDIO
          </span>

          <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
            Grow smarter.
            <span className="block text-[#FF70AD]">
              Live greener.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#FFFAE7]/75 md:text-base">
            Satu ruang untuk merancang, merawat, dan
            mengembangkan ekosistem akuaponikmu dengan
            teknologi kecerdasan buatan.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">

            {[
              "AI-Powered Design",
              "Smart Plant Care",
              "Sustainable Living",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-semibold backdrop-blur-md"
              >
                {item}
              </span>
            ))}

          </div>
        </div>
      </div>

      {/* SECTION HEADING */}

      <div className="flex flex-wrap items-end justify-between gap-3">

        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#62766D]">
            <LayoutGrid size={14} />
            Your AI Workspace
          </div>

          <h2 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
            Explore AI Tools
          </h2>

          <p className="mt-2 text-sm text-[#62766D]">
            Pilih teknologi yang sesuai dengan kebutuhanmu.
          </p>
        </div>

        <div className="rounded-full border border-[#005B45]/10 bg-white/70 px-4 py-2 text-xs font-bold backdrop-blur-md">
          3 AI Tools
        </div>
      </div>

      {/* MAIN BENTO GRID */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-12">

        {/* AI AQUAPONICS DESIGNER */}

        <Link
          href="/ai-studio/input"
          className="group relative isolate flex min-h-[360px] flex-col overflow-hidden rounded-[32px] bg-[#005B45] p-7 text-[#FFFAE7] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl xl:col-span-7"
        >

          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#FF70AD]/15 blur-3xl" />

          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-tl-full border-l border-t border-white/10 bg-white/5" />

          <Box
            strokeWidth={0.7}
            className="pointer-events-none absolute bottom-14 right-6 h-44 w-44 rotate-12 text-white/10 transition duration-500 group-hover:scale-110"
          />

          <div className="relative flex items-center justify-between">

            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/15 bg-white/10 backdrop-blur-xl">
              <WandSparkles
                size={30}
                className="text-[#FF70AD]"
              />
            </div>

            <div className="rounded-full bg-white/10 p-3">
              <ArrowUpRight size={22} />
            </div>
          </div>

          <div className="relative mt-7">

            <p className="text-[10px] font-bold tracking-[0.2em] text-[#FF70AD]">
              01 / DESIGN & BUILD
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              AI Aquaponics
              <span className="block">Designer.</span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-[#FFFAE7]/75">
              Ubah ruang kosong menjadi instalasi akuaponik
              yang sesuai dengan ukuran ruang, kebutuhan,
              dan anggaranmu.
            </p>

          </div>

          <div className="relative mt-auto pt-7">

            <div className="flex flex-wrap gap-2">
              {[
                "Space Analysis",
                "3D Design",
                "Smart Recommendation",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[10px]"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-[#FF70AD] px-5 py-3.5 text-sm font-extrabold text-[#005B45]">
              Mulai Mendesain
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </div>
          </div>
        </Link>

        {/* AI PLANT DOCTOR */}

        <Link
          href="/ai-studio/plant-doctor"
          className="group relative isolate flex min-h-[360px] flex-col overflow-hidden rounded-[32px] bg-[#FFE0EE] p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl xl:col-span-5"
        >

          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#FF70AD]/30 blur-3xl" />

          <Leaf
            strokeWidth={0.7}
            className="pointer-events-none absolute -bottom-5 right-0 h-56 w-56 -rotate-12 text-[#005B45]/10 transition duration-500 group-hover:scale-110"
          />

          <div className="relative flex items-center justify-between">

            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/70 bg-white/60 backdrop-blur-xl">
              <ScanLine size={31} />
            </div>

            <div className="rounded-full bg-white/60 p-3">
              <ArrowUpRight size={22} />
            </div>

          </div>

          <div className="relative mt-7">

            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-bold tracking-[0.2em]">
                02 / SCAN & CARE
              </p>

              <span className="rounded-full bg-[#005B45] px-2.5 py-1 text-[9px] font-bold text-white">
                DEMO
              </span>
            </div>

            <h2 className="mt-3 text-3xl font-black leading-tight md:text-4xl">
              AI Plant
              <span className="block">Doctor.</span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-[#005B45]/75">
              Scan tanaman, kenali kemungkinan gangguan
              kesehatan, dan temukan rekomendasi perawatan
              yang mempertimbangkan keamanan ikan.
            </p>
          </div>

          <div className="relative mt-auto pt-7">

            <div className="flex flex-wrap gap-2">
              {[
                "Plant Scanner",
                "Diagnosis",
                "Fish Safety",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#005B45]/15 px-3 py-1.5 text-[10px] font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 inline-flex items-center gap-3 rounded-2xl bg-[#005B45] px-5 py-3.5 text-sm font-extrabold text-[#FFFAE7]">
              Scan Tanaman
              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </div>

          </div>
        </Link>

        {/* COST ESTIMATOR */}

        <Link
          href="/ai-studio/input"
          className="group relative overflow-hidden rounded-[28px] border border-[#005B45]/10 bg-white/90 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-lg xl:col-span-6"
        >

          <Calculator
            strokeWidth={0.8}
            className="pointer-events-none absolute -bottom-5 right-2 h-36 w-36 -rotate-12 text-[#005B45]/5"
          />

          <div className="relative flex items-start justify-between">

            <div className="rounded-2xl bg-[#E2F0E9] p-4">
              <Calculator size={27} />
            </div>

            <ArrowUpRight
              size={23}
              className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
            />

          </div>

          <div className="relative">

            <p className="mt-5 text-[10px] font-bold tracking-widest text-[#62766D]">
              03 / PLAN & ESTIMATE
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Cost Estimator
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#62766D]">
              Perkirakan biaya instalasi, komponen, dan
              kebutuhan akuaponik berdasarkan rancanganmu.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold">
              Buat rancangan untuk estimasi
              <ArrowRight size={17} />
            </div>

          </div>
        </Link>

        {/* SAVED DESIGNS */}

        <Link
          href="/ai-studio/saved"
          className="group relative overflow-hidden rounded-[28px] border border-[#005B45]/5 bg-[#E2F0E9] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg xl:col-span-6"
        >

          <Bookmark
            strokeWidth={0.8}
            className="pointer-events-none absolute -bottom-5 right-3 h-36 w-36 rotate-12 text-[#005B45]/5"
          />

          <div className="relative flex items-start justify-between">

            <div className="rounded-2xl bg-white/70 p-4">
              <Bookmark size={27} />
            </div>

            <ArrowUpRight
              size={23}
              className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
            />

          </div>

          <div className="relative">

            <p className="mt-5 text-[10px] font-bold tracking-widest text-[#62766D]">
              YOUR PERSONAL COLLECTION
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Saved Designs
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#62766D]">
              Buka kembali, kelola, dan lanjutkan rancangan
              akuaponik yang telah kamu simpan.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold">
              Lihat Koleksi
              <ArrowRight size={17} />
            </div>

          </div>
        </Link>

      </div>

      {/* CAPABILITIES */}

      <div className="rounded-[30px] border border-[#005B45]/10 bg-white/75 p-6 shadow-sm backdrop-blur-xl md:p-8">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-[#FFE0EE] p-3">
            <BrainCircuit size={25} />
          </div>

          <div>
            <h2 className="text-xl font-black">
              Intelligence meets nature.
            </h2>

            <p className="mt-1 text-xs text-[#62766D]">
              Teknologi untuk pengalaman akuaponik yang lebih baik.
            </p>
          </div>

        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          {capabilities.map(({ icon: Icon, title, description }) => (

            <div
              key={title}
              className="rounded-[22px] border border-[#005B45]/5 bg-[#FFFAE7]/80 p-5"
            >

              <Icon size={24} />

              <h3 className="mt-4 text-sm font-extrabold">
                {title}
              </h3>

              <p className="mt-2 text-xs leading-6 text-[#62766D]">
                {description}
              </p>

            </div>

          ))}

        </div>
      </div>

      {/* FOOTER BANNER */}

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[26px] bg-[#005B45] p-6 text-[#FFFAE7]">

        <div className="flex items-center gap-4">

          <div className="rounded-2xl bg-white/10 p-3">
            <Sprout size={28} className="text-[#FF70AD]" />
          </div>

          <div>
            <p className="text-lg font-black">
              Grow ur future.
            </p>

            <p className="mt-1 text-xs text-white/65">
              Small spaces. Smarter ecosystems.
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3 text-[#FF70AD]">
          <Leaf size={22} />
          <Fish size={25} />
          <Sparkles size={22} />
        </div>

      </div>

    </section>
  );
}