
"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowRight,
  LockKeyhole,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Sesi pemulihan tidak valid atau sudah kedaluwarsa. Minta tautan pemulihan baru."
        );
      }

      const { error: updateError } =
        await supabase.auth.updateUser({ password });

      if (updateError) throw updateError;

      setSuccess(true);
      await supabase.auth.signOut();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengubah kata sandi."
      );
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "h-13 w-full min-w-0 bg-transparent text-sm outline-none";

  return (
    <AuthShell mode="reset">
      <span className="inline-flex rounded-full bg-[#FFDA57] px-4 py-2 text-xs font-extrabold tracking-wider">
        KEAMANAN AKUN
      </span>

      <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
        Atur Kata Sandi Baru
      </h1>

      <p className="mt-3 text-sm leading-7 text-[#718573]">
        Buat kata sandi baru yang aman untuk akun SYMBIOLOGY.
      </p>

      {success ? (
        <div className="mt-8 space-y-6">
          <div role="status" className="flex gap-3 rounded-2xl bg-green-50 p-5 text-sm text-green-800">
            <CheckCircle2 size={22} className="shrink-0" />
            Kata sandi berhasil diperbarui. Silakan masuk kembali.
          </div>

          <button
            type="button"
            onClick={() => {
              router.replace("/login");
              router.refresh();
            }}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#FFDA57] font-extrabold"
          >
            Masuk Sekarang <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleReset} className="mt-8 space-y-5">
          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-bold">
              Kata Sandi Baru
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-[#DDE7D8] bg-[#F4F7ED] px-4">
              <LockKeyhole size={19} className="text-[#72917A]" />
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className={fieldClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-new-password" className="mb-2 block text-sm font-bold">
              Konfirmasi Kata Sandi
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-[#DDE7D8] bg-[#F4F7ED] px-4">
              <LockKeyhole size={19} className="text-[#72917A]" />
              <input
                id="confirm-new-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi"
                className={fieldClass}
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#FFDA57] font-extrabold shadow-[5px_6px_0_rgba(135,105,23,0.16)] disabled:opacity-60"
          >
            {loading ? "Menyimpan..." : "Simpan Kata Sandi"}
            {!loading && <ArrowRight size={19} />}
          </motion.button>
        </form>
      )}

      <Link href="/login" className="mt-8 inline-block text-sm font-bold text-[#28784A] hover:underline">
        Kembali ke Login
      </Link>
    </AuthShell>
  );
}
