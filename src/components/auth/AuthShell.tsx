
"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  Leaf,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

type AuthShellProps = {
  children: ReactNode;
  mode?: "login" | "register" | "forgot" | "reset";
};

export default function AuthShell({
  children,
  mode = "login",
}: AuthShellProps) {
  const reduceMotion = useReducedMotion();

  const isRegister = mode === "register";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EAF2E4] text-[#194D33]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#FFDA57]/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-[#A8D5A4]/35 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col px-4 py-5 sm:px-8 lg:px-12 lg:py-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/onboarding" aria-label="Ke onboarding">
            <Image
              src="/images/logo/logo.svg"
              alt="SYMBIOLOGY"
              width={185}
              height={60}
              priority
              className="h-auto w-[145px] sm:w-[185px]"
            />
          </Link>

          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-full border border-white bg-[#FFFBF1]/80 px-4 py-2.5 text-xs font-bold text-[#194D33] transition hover:bg-[#FFDA57] sm:text-sm"
          >
            <ArrowLeft size={16} />
            Kembali
          </Link>
        </header>

        <div className="flex flex-1 items-center py-6 lg:py-8">
          <div className="grid w-full overflow-hidden rounded-[34px] border border-white/80 bg-[#FFFBF1] shadow-[12px_16px_40px_rgba(25,77,51,0.12),inset_2px_2px_5px_white] lg:grid-cols-[0.95fr_1.05fr]">
            {/* Left illustration */}
            <div className="relative hidden min-h-[650px] overflow-hidden bg-[#194D33] p-10 text-white lg:flex lg:flex-col xl:p-12">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border-[45px] border-[#FFDA57]/10" />
              <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full border-[45px] border-white/10" />
              <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFDA57]/15 blur-3xl" />

              <motion.div
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 18 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold tracking-wider text-[#FFDA57]">
                  <Leaf size={15} />
                  GROW UR FUTURE
                </span>

                <h2 className="mt-6 max-w-[450px] text-4xl font-extrabold leading-[1.15] xl:text-[48px]">
                  {isRegister
                    ? "Mulai Perjalanan Hijaumu."
                    : "Selamat Datang di Masa Depan Hijau."}
                </h2>

                <p className="mt-5 max-w-[440px] text-sm leading-7 text-[#D5E8D9]">
                  Rancang, kelola, dan pantau ekosistem akuaponik
                  dengan teknologi AI dan IoT.
                </p>
              </motion.div>

              <motion.div
                animate={
                  reduceMotion ? undefined : { y: [0, -12, 0] }
                }
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative z-10 my-auto h-[340px] w-full xl:h-[410px]"
              >
                <Image
                  src="/images/auth/aquaponics.png"
                  alt="Ilustrasi akuaponik SYMBIOLOGY"
                  fill
                  priority
                  sizes="45vw"
                  className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.2)]"
                />
              </motion.div>

              <div className="relative z-10 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-[#E7F3E4]">
                  <Sparkles size={15} className="text-[#FFDA57]" />
                  AI-Powered
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-[#E7F3E4]">
                  <ShieldCheck size={15} className="text-[#FFDA57]" />
                  Smart Aquaponics
                </span>
              </div>
            </div>

            {/* Right form */}
            <div className="flex min-w-0 items-center justify-center px-5 py-9 sm:px-10 sm:py-12 lg:px-12 xl:px-20">
              <motion.div
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, x: 22 }
                }
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-[480px]"
              >
                {children}
              </motion.div>
            </div>
          </div>
        </div>

        <footer className="text-center text-xs font-medium text-[#718573]">
          SYMBIOLOGY • Grow UR Future
        </footer>
      </div>
    </main>
  );
}
