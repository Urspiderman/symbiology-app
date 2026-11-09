
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  Fish,
  Droplets,
  Sparkles,
  Activity,
  ShoppingBag,
  Sprout,
  CheckCircle2,
  Camera,
  Cpu,
  HeartHandshake,
} from "lucide-react";

const features = [
  {
    title: "AI Studio",
    description:
      "Rancang sistem akuaponik sesuai ruang, kebutuhan, dan anggaran dengan bantuan kecerdasan buatan.",
    Icon: Sparkles,
    color: "bg-[#FFDA57]",
  },
  {
    title: "Smart Monitoring",
    description:
      "Hubungkan perangkat IoT untuk membantu memantau kondisi air dan ekosistem akuaponik.",
    Icon: Activity,
    color: "bg-[#E7F3E4]",
  },
  {
    title: "Marketplace",
    description:
      "Jelajahi berbagai kebutuhan akuaponik, mulai dari peralatan, bibit, hingga perlengkapan budidaya.",
    Icon: ShoppingBag,
    color: "bg-[#FFF1B8]",
  },
];

const steps = [
  {
    number: "01",
    title: "Kenali Ruanganmu",
    description:
      "Siapkan informasi mengenai ruang yang akan digunakan untuk akuaponik.",
    Icon: Camera,
  },
  {
    number: "02",
    title: "Rancang dengan AI",
    description:
      "Masukkan kebutuhan dan anggaran untuk mendapatkan rekomendasi rancangan.",
    Icon: Sparkles,
  },
  {
    number: "03",
    title: "Bangun Ekosistem",
    description:
      "Siapkan tanaman, ikan, serta peralatan sesuai rancangan yang dipilih.",
    Icon: Sprout,
  },
  {
    number: "04",
    title: "Pantau dan Rawat",
    description:
      "Gunakan perangkat yang kompatibel untuk membantu memantau kondisi sistem.",
    Icon: Cpu,
  },
];

export default function TentangPage() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    initial: reduceMotion ? false : { opacity: 0, y: 25 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: reduceMotion ? 0 : 0.5 },
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#FFFBF1] text-[#194D33]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#E6EBDD] bg-[#FFFBF1]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link
            href="/onboarding"
            aria-label="Kembali ke onboarding"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/images/logo/logo.svg"
              alt="SYMBIOLOGY"
              width={185}
              height={60}
              priority
              className="h-auto w-[140px] sm:w-[185px]"
            />
          </Link>

          <Link
            href="/onboarding"
            className="flex items-center gap-2 rounded-full border border-[#DDE7D8] bg-[#E7F3E4] px-4 py-2.5 text-xs font-bold text-[#194D33] transition hover:bg-[#FFDA57] sm:text-sm"
          >
            <ArrowLeft size={17} />
            Kembali
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-[#E7F3E4] blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFDA57] px-4 py-2 text-xs font-extrabold tracking-wider text-[#194D33] shadow-[inset_2px_2px_5px_rgba(255,255,255,0.6),4px_5px_12px_rgba(135,105,23,0.1)]">
              <Leaf size={16} />
              ABOUT SYMBIOLOGY
            </span>

            <h1 className="mt-7 max-w-[650px] text-[38px] font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[60px]">
              Grow Your Future,
              <span className="mt-2 block text-[#28784A]">
                Start from Home.
              </span>
            </h1>

            <p className="mt-6 max-w-[570px] text-base leading-8 text-[#607665]">
              SYMBIOLOGY adalah konsep platform akuaponik cerdas
              yang mengintegrasikan kecerdasan buatan (AI),
              Internet of Things (IoT), dan marketplace untuk
              membantu masyarakat merancang serta mengelola
              ekosistem akuaponik dari rumah.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="clay-button px-7 py-4 text-sm"
              >
                Mulai Sekarang
                <ArrowRight size={18} />
              </Link>

              <Link
                href="/onboarding"
                className="flex items-center gap-2 rounded-2xl border border-[#DDE7D8] bg-[#E7F3E4] px-6 py-4 text-sm font-bold text-[#194D33] transition hover:-translate-y-1"
              >
                Lihat Pengenalan
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={
              reduceMotion
                ? false
                : { opacity: 0, scale: 0.92 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.65 }}
            className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-[36px] bg-[#194D33] shadow-[12px_15px_30px_rgba(25,77,51,0.18),inset_3px_3px_8px_rgba(255,255,255,0.12)] sm:min-h-[470px]"
          >
            <div className="absolute h-[290px] w-[290px] rounded-full bg-[#FFDA57]/15 blur-2xl sm:h-[390px] sm:w-[390px]" />

            <motion.div
              animate={
                reduceMotion ? undefined : { y: [0, -10, 0] }
              }
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 h-[320px] w-full sm:h-[440px]"
            >
              <Image
                src="/images/onboarding/onboarding-1.png"
                alt="Ilustrasi ekosistem akuaponik SYMBIOLOGY"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-5 drop-shadow-[0_18px_22px_rgba(0,0,0,0.15)]"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* WHAT IS AQUAPONICS */}
      <section className="bg-[#E7F3E4] py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <motion.div {...fadeUp} className="order-2 lg:order-1">
            <div className="relative min-h-[310px] overflow-hidden rounded-[32px] border border-white/70 bg-[#FFFBF1] shadow-[8px_10px_25px_rgba(25,77,51,0.1),inset_2px_2px_6px_white] sm:min-h-[430px]">
              <Image
                src="/images/onboarding/onboarding-1.png"
                alt="Tanaman dan ikan dalam ekosistem akuaponik"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-6"
              />
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="order-1 lg:order-2">
            <span className="text-xs font-extrabold tracking-[0.2em] text-[#28784A]">
              KENALI AKUAPONIK
            </span>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Satu Ekosistem,
              <span className="block text-[#28784A]">
                Dua Kehidupan.
              </span>
            </h2>

            <p className="mt-6 text-base leading-8 text-[#607665]">
              Akuaponik menggabungkan budidaya ikan dan tanaman
              dalam sistem yang saling mendukung. Limbah
              metabolisme ikan diolah oleh mikroorganisme menjadi
              nutrisi yang dapat dimanfaatkan tanaman, sementara
              tanaman membantu proses pemurnian air.
            </p>

            <div className="mt-7 space-y-4">
              {[
                {
                  Icon: Fish,
                  text: "Ikan menghasilkan sumber nutrisi bagi tanaman.",
                },
                {
                  Icon: Sprout,
                  text: "Tanaman memanfaatkan nutrisi untuk pertumbuhan.",
                },
                {
                  Icon: Droplets,
                  text: "Air disirkulasikan kembali dalam sistem.",
                },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFDA57] shadow-[inset_2px_2px_4px_white,3px_4px_9px_rgba(25,77,51,0.1)]">
                    <Icon size={21} />
                  </div>
                  <p className="pt-2 text-sm font-medium leading-6 text-[#355F43]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <motion.div {...fadeUp} className="text-center">
          <span className="text-xs font-extrabold tracking-[0.2em] text-[#28784A]">
            OUR FEATURES
          </span>

          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            Semua dalam Satu Ekosistem
          </h2>

          <p className="mx-auto mt-5 max-w-[650px] text-base leading-7 text-[#607665]">
            Dari perencanaan hingga pemantauan, SYMBIOLOGY
            dirancang untuk mendukung perjalanan akuaponikmu.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map(({ title, description, Icon, color }, index) => (
            <motion.article
              key={title}
              {...fadeUp}
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : index * 0.1,
              }}
              whileHover={
                reduceMotion ? undefined : { y: -7 }
              }
              className="rounded-[30px] border border-white bg-[#FFFBF1] p-7 shadow-[8px_10px_22px_rgba(25,77,51,0.1),inset_2px_2px_5px_white]"
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-[22px] ${color} shadow-[inset_2px_2px_5px_white,4px_5px_12px_rgba(25,77,51,0.1)]`}
              >
                <Icon size={30} />
              </div>

              <h3 className="mt-7 text-xl font-extrabold">
                {title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#607665]">
                {description}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[#194D33] py-16 text-white lg:py-24">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <motion.div {...fadeUp} className="text-center">
            <span className="text-xs font-extrabold tracking-[0.2em] text-[#FFDA57]">
              HOW IT WORKS
            </span>

            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
              Mulai dalam 4 Langkah
            </h2>

            <p className="mx-auto mt-5 max-w-[650px] text-sm leading-7 text-[#D5E8D9]">
              Proses sederhana untuk membantu kamu memulai
              perjalanan akuaponik dari rumah.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ number, title, description, Icon }, index) => (
              <motion.div
                key={number}
                {...fadeUp}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  delay: reduceMotion ? 0 : index * 0.08,
                }}
                className="rounded-[28px] border border-white/15 bg-white/10 p-6 shadow-[inset_2px_2px_5px_rgba(255,255,255,0.07)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-[#FFDA57]">
                    {number}
                  </span>
                  <Icon size={26} className="text-[#FFDA57]" />
                </div>

                <h3 className="mt-8 text-lg font-bold">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#D5E8D9]">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <motion.div
          {...fadeUp}
          className="grid items-center gap-8 rounded-[36px] bg-[#E7F3E4] p-7 shadow-[8px_10px_25px_rgba(25,77,51,0.08),inset_2px_2px_6px_white] sm:p-10 lg:grid-cols-2 lg:p-14"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFDA57] px-4 py-2 text-xs font-extrabold">
              <HeartHandshake size={16} />
              OUR PURPOSE
            </span>

            <h2 className="mt-6 text-3xl font-extrabold leading-tight sm:text-4xl">
              Teknologi untuk
              <span className="block text-[#28784A]">
                Masa Depan yang Hijau.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-8 text-[#607665] sm:text-base">
              SYMBIOLOGY bertujuan membuat akuaponik lebih
              mudah dipahami dan direncanakan oleh masyarakat,
              termasuk pemula yang ingin mencoba budidaya
              di lingkungan rumah atau apartemen.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Mendukung budidaya di ruang terbatas",
              "Membantu perencanaan berbasis AI",
              "Mengintegrasikan pemantauan IoT",
              "Mendorong gaya hidup berkelanjutan",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white bg-[#FFFBF1] p-4 shadow-[3px_4px_12px_rgba(25,77,51,0.06)]"
              >
                <CheckCircle2
                  size={22}
                  className="shrink-0 text-[#28784A]"
                />
                <span className="text-sm font-semibold">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
        <motion.div
          {...fadeUp}
          className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] bg-[#FFDA57] px-7 py-12 text-center shadow-[10px_12px_25px_rgba(135,105,23,0.12),inset_3px_3px_7px_rgba(255,255,255,0.5)] sm:px-12 lg:py-16"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-[#194D33]/10" />

          <div className="relative">
            <Leaf size={38} className="mx-auto text-[#194D33]" />

            <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
              Siap Menumbuhkan Masa Depanmu?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#355F43] sm:text-base">
              Mulai jelajahi SYMBIOLOGY dan temukan cara
              merancang ekosistem akuaponik yang sesuai
              dengan kebutuhanmu.
            </p>

            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#194D33] px-8 py-4 text-sm font-extrabold text-white shadow-[5px_6px_14px_rgba(25,77,51,0.18)] transition hover:-translate-y-1"
            >
              Mulai Sekarang
              <ArrowRight size={19} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#E6EBDD] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <Image
            src="/images/logo/logo.svg"
            alt="SYMBIOLOGY"
            width={150}
            height={50}
            className="h-auto w-[140px]"
          />

          <p className="text-xs font-medium text-[#718573]">
            SYMBIOLOGY — Grow UR Future
          </p>

          <Link
            href="/onboarding"
            className="text-sm font-bold text-[#194D33] hover:underline"
          >
            Kembali ke Onboarding
          </Link>
        </div>
      </footer>
    </main>
  );
}
