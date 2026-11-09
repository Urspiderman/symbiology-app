
"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth/AuthShell";

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
          {
            redirectTo: `${window.location.origin}/callback?next=/reset-password`,
          }
        );

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengirim email pemulihan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell mode="forgot">
      <span className="inline-flex rounded-full bg-[#FFDA57] px-4 py-2 text-xs font-extrabold tracking-wider">
        PEMULIHAN AKUN
      </span>

      <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
        Lupa Kata Sandi?
      </h1>

      <p className="mt-3 text-sm leading-7 text-[#718573]">
        Masukkan alamat email yang terdaftar. Kami akan mengirim
        tautan untuk mengatur ulang kata sandi.
      </p>

      {success ? (
        <div className="mt-8 space-y-6">
          <div role="status" className="flex gap-3 rounded-2xl border border-green-100 bg-green-50 p-5 text-sm leading-7 text-green-800">
            <CheckCircle2 size={22} className="shrink-0" />
            <p>
              Jika email terdaftar, tautan pemulihan akan dikirim.
              Periksa kotak masuk dan folder spam.
            </p>
          </div>

          <Link
            href="/login"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-[#FFDA57] font-extrabold"
          >
            Kembali ke Login <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="forgot-email" className="mb-2 block text-sm font-bold">
              Email
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-[#DDE7D8] bg-[#F4F7ED] px-4 shadow-[inset_3px_3px_7px_rgba(25,77,51,0.07)] focus-within:border-[#28784A]">
              <Mail size={19} className="text-[#72917A]" />
              <input
                id="forgot-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="h-13 w-full bg-transparent text-sm outline-none"
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
            {loading ? "Mengirim..." : "Kirim Tautan Pemulihan"}
            {!loading && <ArrowRight size={19} />}
          </motion.button>
        </form>
      )}

      <Link
        href="/login"
        className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#28784A] hover:underline"
      >
        <ArrowLeft size={17} />
        Kembali ke Login
      </Link>
    </AuthShell>
  );
}
