
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowRight,
  Activity,
  Leaf,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  DemoStats,
  DemoSystemStatus,
  DemoRecentActivity,
} from "@/components/dashboard/DemoMonitoringSummary";

const quickActions = [
  {
    title: "AI Studio",
    desc: "Rancang akuaponik dengan bantuan AI",
    href: "/ai-studio",
    Icon: Sparkles,
    bg: "bg-[#FFDA57]",
  },
  {
    title: "Akuaponikku",
    desc: "Pantau sistem dan perangkat",
    href: "/akuaponikku",
    Icon: Activity,
    bg: "bg-[#E7F3E4]",
  },
  {
    title: "Marketplace",
    desc: "Jelajahi alat dan kebutuhan budidaya",
    href: "/marketplace",
    Icon: ShoppingBag,
    bg: "bg-[#F4EEDC]",
  },
  {
    title: "Profil",
    desc: "Kelola akun dan preferensi",
    href: "/profile",
    Icon: Leaf,
    bg: "bg-[#E7F3E4]",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const name =
    profile?.full_name ||
    user.user_metadata?.full_name ||
    "Pengguna";

  const { data: systems } = await supabase
    .from("aquaponics_systems")
    .select("id,name,status,fish_type,plant_type")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const selectedSystem =
    systems?.find((system) => system.status === "active") ??
    systems?.[0] ??
    null;

  const systemId = selectedSystem?.id ?? null;

  return (
    <div className="space-y-6">
      {/* HERO - DESAIN ASLI */}
      <section className="motion-fade-up relative overflow-hidden rounded-[34px] bg-[#194D33] shadow-[12px_15px_30px_rgba(25,77,51,0.19),inset_3px_3px_8px_rgba(255,255,255,0.12)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-[#FFDA57]/10 blur-2xl"
        />

        <div className="relative grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#FFDA57] px-4 py-2 text-xs font-extrabold tracking-wide text-[#194D33] shadow-[inset_2px_2px_4px_rgba(255,255,255,0.55)]">
              <Leaf size={15} />
              GROW UR FUTURE
            </span>

            <p className="text-sm text-[#D0E8D5]">
              Selamat datang kembali,
            </p>

            <h1 className="mt-2 break-words text-3xl font-extrabold tracking-tight text-white sm:text-4xl xl:text-5xl">
              Halo, {name}!
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#D5E8D9] sm:text-base">
              Bangun ekosistem akuaponik cerdas dari rumah.
              Rancang dengan AI, pantau perangkat, dan temukan
              kebutuhan budidaya dalam satu aplikasi.
            </p>

            <Link
              href="/ai-studio"
              className="clay-button mt-7 w-fit px-6 py-3.5 text-sm"
            >
              Mulai Desain AI
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="relative min-h-[220px] lg:min-h-[340px]">
            <Image
              src="/images/illustrations/dashboard-hero.jpg"
              alt="Sistem akuaponik SYMBIOLOGY"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#194D33]/40 to-transparent lg:bg-gradient-to-r lg:from-[#194D33] lg:to-transparent" />
          </div>
        </div>
      </section>

      {/* METRIK - TAMPILAN ASLI, DATA SINKRON */}
      <DemoStats
        systemId={systemId}
        fishType={selectedSystem?.fish_type}
        plantType={selectedSystem?.plant_type}
      />

      {/* KONTEN UTAMA */}
      <section className="grid gap-5 xl:grid-cols-[1.15fr_1fr_0.85fr]">
        {/* KONDISI SISTEM - DATA SINKRON */}
        <DemoSystemStatus
          systemId={systemId}
          systemName={selectedSystem?.name}
        />

        {/* AKSI CEPAT - DESAIN ASLI */}
        <article className="clay-card p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-[#194D33]">
            Aksi Cepat
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {quickActions.map(
              ({ title, desc, href, Icon, bg }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex min-h-[160px] flex-col justify-between rounded-[23px] border border-white/70 p-4 shadow-[5px_7px_15px_rgba(25,77,51,0.09),inset_2px_2px_5px_rgba(255,255,255,0.55)] transition duration-300 hover:-translate-y-1.5 ${bg}`}
                >
                  <Icon size={26} className="text-[#194D33]" />
                  <div>
                    <h3 className="text-sm font-extrabold text-[#194D33]">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#536E58]">
                      {desc}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="self-end text-[#194D33]"
                  />
                </Link>
              )
            )}
          </div>
        </article>

        {/* TIPS - DESAIN ASLI */}
        <article className="clay-card overflow-hidden">
          <div className="flex items-center gap-2 p-5 sm:p-6">
            <Sparkles size={20} className="text-[#D6A81B]" />
            <h2 className="text-lg font-extrabold text-[#194D33]">
              Tips Akuaponik
            </h2>
          </div>

          <div className="relative h-44">
            <Image
              src="/images/illustrations/lettuce.jpg"
              alt="Tanaman selada hijau"
              fill
              sizes="(max-width: 1280px) 100vw, 25vw"
              className="object-cover"
            />
          </div>

          <div className="p-5 sm:p-6">
            <span className="rounded-full bg-[#FFDA57] px-3 py-1.5 text-xs font-bold text-[#194D33]">
              Tips Hari Ini
            </span>
            <h3 className="mt-5 font-bold text-[#194D33]">
              Jaga keseimbangan air dan tanaman
            </h3>
            <p className="mt-3 text-sm leading-6 text-[#607665]">
              Periksa kualitas air secara berkala dan pastikan
              sirkulasi berjalan dengan baik agar ikan dan
              tanaman tumbuh optimal.
            </p>
          </div>
        </article>
      </section>

      {/* BAGIAN BAWAH */}
      <section className="grid gap-5 lg:grid-cols-2">
        {/* AKTIVITAS TERBARU - DATA SINKRON */}
        <DemoRecentActivity systemId={systemId} />

        {/* MARKETPLACE - DESAIN ASLI */}
        <article className="clay-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-[#194D33]">
              Jelajahi Marketplace
            </h2>
            <Link
              href="/marketplace"
              className="text-xs font-bold text-[#28784A]"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="mt-5 flex min-h-[160px] items-center gap-4 rounded-[24px] bg-[#FFF1B8] p-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-[#FFDA57] text-[#194D33] shadow-[inset_2px_2px_5px_white,4px_5px_12px_rgba(135,105,23,0.15)]">
              <ShoppingBag size={30} />
            </div>
            <div>
              <h3 className="font-bold text-[#194D33]">
                Kebutuhan akuaponik dalam satu tempat
              </h3>
              <p className="mt-2 text-sm text-[#607665]">
                Jelajahi peralatan, bibit, dan kebutuhan
                pendukung budidaya.
              </p>
              <Link
                href="/marketplace"
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#194D33]"
              >
                Buka Marketplace <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
