
"use client";

import { Suspense, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  AlertCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";

// Komponen login dipisahkan agar useSearchParams
// berada di dalam Suspense.
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verificationError =
    searchParams.get("error") === "verification";

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const { error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

      if (authError) throw authError;

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      const lower = message.toLowerCase();

      if (lower.includes("invalid login")) {
        setError("Email atau kata sandi tidak sesuai.");
      } else if (lower.includes("email not confirmed")) {
        setError(
          "Email belum diverifikasi. Periksa kotak masuk email kamu."
        );
      } else {
        setError(message || "Login gagal. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "h-13 w-full min-w-0 bg-transparent text-sm text-[#194D33] outline-none placeholder:text-[#9BA99D]";

  const wrapperClass =
    "flex items-center gap-3 rounded-2xl border border-[#DDE7D8] bg-[#F4F7ED] px-4 shadow-[inset_3px_3px_7px_rgba(25,77,51,0.07),inset_-2px_-2px_5px_white] transition focus-within:border-[#28784A] focus-within:ring-2 focus-within:ring-[#28784A]/10";

  return (
    <AuthShell mode="login">
      <div>
        <span className="inline-flex rounded-full bg-[#FFDA57] px-4 py-2 text-xs font-extrabold tracking-wider text-[#194D33]">
          SELAMAT DATANG
        </span>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-[#194D33] sm:text-4xl">
          Selamat Datang Kembali
        </h1>

        <p className="mt-3 text-sm leading-7 text-[#718573]">
          Masuk untuk melanjutkan perjalanan akuaponik cerdasmu.
        </p>
      </div>

      <form onSubmit={handleLogin} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-bold"
          >
            Email
          </label>

          <div className={wrapperClass}>
            <Mail
              size={19}
              className="shrink-0 text-[#72917A]"
            />

            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className={fieldClass}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm font-bold"
          >
            Kata Sandi
          </label>

          <div className={wrapperClass}>
            <LockKeyhole
              size={19}
              className="shrink-0 text-[#72917A]"
            />

            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className={fieldClass}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
              aria-label={
                showPassword
                  ? "Sembunyikan kata sandi"
                  : "Tampilkan kata sandi"
              }
              className="shrink-0 text-[#809388] hover:text-[#194D33]"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-bold text-[#28784A] hover:underline"
          >
            Lupa kata sandi?
          </Link>
        </div>

        {(error || verificationError) && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0"
            />
            <span>
              {error ||
                "Verifikasi email gagal atau tautan sudah kedaluwarsa."}
            </span>
          </div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#FFDA57] px-6 font-extrabold text-[#194D33] shadow-[5px_6px_0_rgba(135,105,23,0.16),inset_2px_2px_5px_rgba(255,255,255,0.55)] transition hover:bg-[#FFD43B] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sedang Masuk..." : "Masuk"}
          {!loading && <ArrowRight size={19} />}
        </motion.button>
      </form>

      <div className="mt-8 border-t border-[#E0E9DD] pt-6">
        <p className="text-center text-sm text-[#718573]">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-extrabold text-[#28784A] hover:underline"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

// Suspense diperlukan untuk useSearchParams
// saat Next.js melakukan production build.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
