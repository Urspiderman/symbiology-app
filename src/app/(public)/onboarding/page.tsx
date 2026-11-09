
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Leaf,
  Sparkles,
  Droplets,
} from "lucide-react";

const slides = [
  {
    number: "01",
    eyebrow: "GROW UR FUTURE",
    title: "Pangan Segar",
    highlight: "dari Rumah Sendiri",
    description:
      "Bangun ekosistem akuaponik cerdas untuk kehidupan yang lebih sehat dan berkelanjutan.",
    image: "/images/onboarding/onboarding-1.png",
    alt: "Ilustrasi akuaponik dengan ikan dan sayuran",
    Icon: Leaf,
  },
  {
    number: "02",
    eyebrow: "DESIGN WITH AI",
    title: "Desain Akuaponik",
    highlight: "dengan Bantuan AI",
    description:
      "Unggah foto ruangan, masukkan ukuran dan anggaran, lalu dapatkan rekomendasi desain akuaponik.",
    image: "/images/onboarding/onboarding-2.png",
    alt: "Ilustrasi perancangan akuaponik dengan AI",
    Icon: Sparkles,
  },
  {
    number: "03",
    eyebrow: "SMART MONITORING",
    title: "Pantau Ekosistem",
    highlight: "Lebih Mudah",
    description:
      "Hubungkan perangkat IoT untuk memantau kondisi air dan menjaga ekosistem akuaponik tetap sehat.",
    image: "/images/onboarding/onboarding-3.png",
    alt: "Ilustrasi monitoring akuaponik berbasis IoT",
    Icon: Droplets,
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const slide = slides[step];
  const isLast = step === slides.length - 1;

  function finishOnboarding() {
    router.push("/login");
  }

  function goToSlide(index: number) {
    if (index < 0 || index >= slides.length) return;

    setDirection(index >= step ? 1 : -1);
    setStep(index);
  }

  function nextSlide() {
    if (isLast) {
      finishOnboarding();
      return;
    }

    goToSlide(step + 1);
  }

  function previousSlide() {
    goToSlide(step - 1);
  }

  const variants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : dir * 35,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : dir * -35,
    }),
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF2E4] text-[#194D33]">
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#FFDA57]/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-[440px] w-[440px] rounded-full bg-[#A8D5A4]/35 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col px-4 py-5 sm:px-8 sm:py-7 lg:px-14">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <Image
            src="/images/logo/logo.svg"
            alt="SYMBIOLOGY"
            width={185}
            height={60}
            priority
            className="h-auto w-[145px] sm:w-[185px]"
          />

          <button
            type="button"
            onClick={finishOnboarding}
            className="rounded-full border border-[#C9DEC9] bg-[#FFFBF1]/70 px-5 py-2.5 text-sm font-bold text-[#194D33] transition hover:bg-[#FFDA57]"
          >
            Lewati
          </button>
        </header>

        {/* Main content */}
        <section className="flex flex-1 items-center py-6 lg:py-8">
          <div className="grid w-full items-center gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">

            {/* Illustration panel */}
            <div className="relative order-1 flex min-h-[300px] items-center justify-center overflow-hidden rounded-[36px] border border-white/70 bg-[#194D33] shadow-[12px_15px_30px_rgba(25,77,51,0.17),inset_3px_3px_8px_rgba(255,255,255,0.12)] sm:min-h-[420px] lg:min-h-[590px]">
              <div
                aria-hidden="true"
                className="absolute h-[230px] w-[230px] rounded-full bg-[#FFDA57]/20 blur-2xl sm:h-[350px] sm:w-[350px]"
              />

              <div
                aria-hidden="true"
                className="absolute -right-14 -top-14 h-44 w-44 rounded-full border-[30px] border-[#FFDA57]/15"
              />

              <div
                aria-hidden="true"
                className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full border-[32px] border-white/10"
              />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.image}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduceMotion ? 0 : 0.35 }}
                  className="relative z-10 h-[290px] w-full max-w-[620px] sm:h-[410px] lg:h-[550px]"
                >
                  <motion.div
                    animate={
                      reduceMotion
                        ? undefined
                        : { y: [0, -10, 0] }
                    }
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={step === 0}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain p-5 drop-shadow-[0_20px_25px_rgba(0,0,0,0.18)] sm:p-8"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-5 left-5 z-20 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold tracking-widest text-white backdrop-blur-md">
                SYMBIOLOGY / {slide.number}
              </div>
            </div>

            {/* Text content */}
            <div className="order-2 flex flex-col justify-center px-1 py-3 sm:px-4 lg:px-0">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: reduceMotion ? 0 : 0.3 }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white bg-[#FFDA57] px-4 py-2 text-xs font-extrabold tracking-wider text-[#194D33] shadow-[3px_4px_10px_rgba(135,105,23,0.1),inset_2px_2px_4px_rgba(255,255,255,0.5)]">
                    <slide.Icon size={15} />
                    {slide.eyebrow}
                  </span>

                  <p className="mt-7 text-sm font-extrabold tracking-[0.2em] text-[#598269]">
                    {slide.number} / 03
                  </p>

                  <h1 className="mt-4 max-w-[640px] text-[36px] font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-[56px] xl:text-[64px]">
                    {slide.title}
                    <span className="mt-2 block text-[#28784A]">
                      {slide.highlight}
                    </span>
                  </h1>

                  <p className="mt-6 max-w-[520px] text-[15px] leading-7 text-[#607665] sm:text-lg sm:leading-8">
                    {slide.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Slide indicators */}
              <div
                className="mt-8 flex items-center gap-3"
                aria-label="Pilih slide onboarding"
              >
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Buka slide ${index + 1}`}
                    aria-current={step === index ? "step" : undefined}
                    onClick={() => goToSlide(index)}
                    className="flex h-8 items-center justify-center"
                  >
                    <motion.span
                      animate={{
                        width: step === index ? 42 : 11,
                        backgroundColor:
                          step === index ? "#194D33" : "#B8D0BA",
                      }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 320, damping: 28 }
                      }
                      className="block h-[11px] rounded-full"
                    />
                  </button>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <motion.button
                  type="button"
                  onClick={previousSlide}
                  disabled={step === 0}
                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-[#FFFBF1] text-[#194D33] shadow-[4px_5px_12px_rgba(25,77,51,0.1),inset_2px_2px_4px_white] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Slide sebelumnya"
                >
                  <ArrowLeft size={21} />
                </motion.button>

                <motion.button
                  type="button"
                  onClick={nextSlide}
                  whileHover={reduceMotion ? undefined : { y: -3 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  className="flex h-14 min-w-[170px] items-center justify-center gap-3 rounded-2xl bg-[#FFDA57] px-7 text-sm font-extrabold text-[#194D33] shadow-[5px_6px_0_rgba(135,105,23,0.16),inset_2px_2px_5px_rgba(255,255,255,0.55)] sm:min-w-[200px]"
                >
                  {isLast ? "Mulai Sekarang" : "Lanjut"}
                  <ArrowRight size={20} />
                </motion.button>
              </div>

              
<div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-medium text-[#819783]">
  <span>Smart Aquaponics • Powered by AI & IoT</span>

  <span className="text-[#B8CBB8]">•</span>

  <Link
    href="/tentang"
    className="font-bold text-[#194D33] underline-offset-4 transition hover:underline"
  >
    Tentang SYMBIOLOGY
  </Link>
</div>

            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
