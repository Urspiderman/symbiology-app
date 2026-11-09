
"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (fullName.trim().length < 2) {
      setError("Nama lengkap minimal 2 karakter.");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } =
        await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
            emailRedirectTo: `${window.location.origin}/callback`,
          },
        });

      if (authError) throw authError;

      if (data.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setSuccess(
        "Pendaftaran diterima. Silakan periksa email untuk verifikasi akun jika diwajibkan, kemudian masuk."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Pendaftaran gagal. Silakan coba kembali."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "h-13 w-full min-w-0 bg-transparent text-sm text-[#194D33] outline-none placeholder:text-[#9BA99D]";

  const wrapperClass =
    "flex items-center gap-3 rounded-2xl border border-[#DDE7D8] bg-[#F4F7ED] px-4 shadow-[inset_3px_3px_7px_rgba(25,77,51,0.07),inset_-2px_-2px_5px_white] transition focus-within:border-[#28784A] focus-within:ring-2 focus-within:ring-[#28784A]/10";

  const labelClass = "mb-2 block text-sm font-bold";

  return (
    <AuthShell mode="register">
      <div>
        <span className="inline-flex rounded-full bg-[#FFDA57] px-4 py-2 text-xs font-extrabold tracking-wider text-[#194D33]">
          BERGABUNG BERSAMA KAMI
        </span>

        <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Buat Akun Baru
        </h1>

        <p className="mt-3 text-sm leading-7 text-[#718573]">
          Mulai wujudkan ekosistem akuaponik cerdas di rumahmu.
        </p>
      </div>

      <form onSubmit={handleRegister} className="mt-7 space-y-4">
        <div>
          <label htmlFor="reg-name" className={labelClass}>
            Nama Lengkap
          </label>

          <div className={wrapperClass}>
            <UserRound size={19} className="shrink-0 text-[#72917A]" />
            <input
              id="reg-name"
              required
              minLength={2}
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-email" className={labelClass}>
            Email
          </label>

          <div className={wrapperClass}>
            <Mail size={19} className="shrink-0 text-[#72917A]" />
            <input
              id="reg-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-password" className={labelClass}>
            Kata Sandi
          </label>

          <div className={wrapperClass}>
            <LockKeyhole size={19} className="shrink-0 text-[#72917A]" />
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="shrink-0 text-[#809388]"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="reg-confirm" className={labelClass}>
            Konfirmasi Kata Sandi
          </label>

          <div className={wrapperClass}>
            <LockKeyhole size={19} className="shrink-0 text-[#72917A]" />
            <input
              id="reg-confirm"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Sembunyikan konfirmasi" : "Tampilkan konfirmasi"}
              className="shrink-0 text-[#809388]"
            >
              {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div role="status" className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-800">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <motion.button
          type="submit"
          disabled={loading || Boolean(success)}
          whileTap={{ scale: 0.97 }}
          className="mt-2 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#FFDA57] px-6 font-extrabold text-[#194D33] shadow-[5px_6px_0_rgba(135,105,23,0.16),inset_2px_2px_5px_rgba(255,255,255,0.55)] transition hover:bg-[#FFD43B] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
          {!loading && <ArrowRight size={19} />}
        </motion.button>
      </form>

      <div className="mt-7 border-t border-[#E0E9DD] pt-6">
        <p className="text-center text-sm text-[#718573]">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-extrabold text-[#28784A] hover:underline">
            Masuk Sekarang
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
