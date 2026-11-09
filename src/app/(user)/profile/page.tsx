
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CircleUserRound,
  Droplets,
  Leaf,
  Loader2,
  LogOut,
  Mail,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "U";

  return parts
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function formatDate(value: string) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    fullName: "",
    email: "",
    phone: "",
    createdAt: "",
  });

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
  });

  const [totalSystems, setTotalSystems] = useState(0);
  const [activeSystems, setActiveSystems] = useState(0);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login");
        return;
      }

      const metadata = user.user_metadata ?? {};

      const fullName =
        typeof metadata.full_name === "string"
          ? metadata.full_name
          : "Pengguna SYMBIOLOGY";

      const phone =
        typeof metadata.phone === "string"
          ? metadata.phone
          : "";

      const nextProfile: ProfileData = {
        fullName,
        email: user.email ?? "",
        phone,
        createdAt: user.created_at,
      };

      setProfile(nextProfile);
      setForm({ fullName, phone });

      const { data: systems, error: systemError } = await supabase
        .from("aquaponics_systems")
        .select("id,status")
        .eq("user_id", user.id);

      if (systemError) throw systemError;

      setTotalSystems(systems?.length ?? 0);
      setActiveSystems(
        systems?.filter((system) => system.status === "active")
          .length ?? 0
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat profil."
      );
    } finally {
      setLoading(false);
    }
  }, [router, supabase]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setError("");
    setMessage("");

    const fullName = form.fullName.trim();
    const phone = form.phone.trim();

    if (fullName.length < 2 || fullName.length > 100) {
      setError("Nama lengkap harus terdiri dari 2–100 karakter.");
      return;
    }

    if (phone && !/^\+?[0-9\s-]{8,20}$/.test(phone)) {
      setError("Format nomor WhatsApp tidak valid.");
      return;
    }

    setSaving(true);

    try {
      const { data, error: updateError } =
        await supabase.auth.updateUser({
          data: {
            full_name: fullName,
            phone,
          },
        });

      if (updateError) throw updateError;

      if (!data.user) {
        throw new Error("Gagal memperbarui akun.");
      }

      setProfile((previous) => ({
        ...previous,
        fullName,
        phone,
      }));

      setEditing(false);
      setMessage("Profil berhasil diperbarui.");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan profil."
      );
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) throw logoutError;

      router.replace("/login");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal logout."
      );
      setConfirmLogout(false);
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#FFFBF1]">
        <Loader2
          size={30}
          className="animate-spin text-[#28784A]"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFBF1] px-4 py-7 text-[#173D2B] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-semibold text-[#28784A]">
            SYMBIOLOGY / Akun
          </p>
          <h1 className="mt-1 text-3xl font-bold">
            Profil Saya
          </h1>
          <p className="mt-2 text-sm text-[#6A7B6E]">
            Kelola informasi pribadi dan akun SYMBIOLOGY kamu.
          </p>
        </div>

        {message && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-[#E1EADF] bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-[#174D32] via-[#28784A] to-[#77A86D]" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-[#FFDA57] text-2xl font-bold text-[#174D32] shadow-sm">
                {getInitials(profile.fullName)}
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={() => {
                    setMessage("");
                    setEditing(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#28784A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1E603A]"
                >
                  <Pencil size={16} />
                  Edit Profil
                </button>
              )}
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-bold">
                {profile.fullName}
              </h2>

              <p className="mt-1 text-sm text-[#6A7B6E]">
                {profile.email}
              </p>

              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#EAF5EC] px-3 py-1.5 text-xs font-semibold text-[#28784A]">
                <ShieldCheck size={15} />
                Akun Terdaftar
              </span>
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E1EADF] bg-white p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF5EC] text-[#28784A]">
              <Leaf size={22} />
            </div>
            <p className="text-sm text-[#6A7B6E]">
              Total Sistem Akuaponik
            </p>
            <p className="mt-1 text-3xl font-bold">
              {totalSystems}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E1EADF] bg-white p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF3C4] text-[#9C7610]">
              <Droplets size={22} />
            </div>
            <p className="text-sm text-[#6A7B6E]">
              Sistem Berstatus Aktif
            </p>
            <p className="mt-1 text-3xl font-bold">
              {activeSystems}
            </p>
          </div>
        </div>

        <section className="rounded-2xl border border-[#E1EADF] bg-white p-5 sm:p-7">
          <div className="mb-6 flex items-center gap-3">
            <CircleUserRound
              size={22}
              className="text-[#28784A]"
            />
            <h2 className="text-lg font-bold">
              Informasi Pribadi
            </h2>
          </div>

          {editing ? (
            <form onSubmit={saveProfile} className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-semibold"
                >
                  Nama Lengkap
                </label>
                <input
                  id="fullName"
                  value={form.fullName}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      fullName: event.target.value,
                    }))
                  }
                  maxLength={100}
                  required
                  className="w-full rounded-xl border border-[#DCE8DE] px-4 py-3 text-sm outline-none focus:border-[#28784A]"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold"
                >
                  Nomor WhatsApp
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="Contoh: 081234567890"
                  className="w-full rounded-xl border border-[#DCE8DE] px-4 py-3 text-sm outline-none focus:border-[#28784A]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#28784A] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      fullName: profile.fullName,
                      phone: profile.phone,
                    });
                  }}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#DCE8DE] px-5 py-3 text-sm font-semibold"
                >
                  <X size={17} />
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#819085]">
                  Nama Lengkap
                </p>
                <p className="mt-1 font-semibold">
                  {profile.fullName}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-xs text-[#819085]">
                  <Mail size={14} />
                  Email
                </p>
                <p className="mt-1 break-all font-semibold">
                  {profile.email}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-xs text-[#819085]">
                  <Phone size={14} />
                  Nomor WhatsApp
                </p>
                <p className="mt-1 font-semibold">
                  {profile.phone || "Belum ditambahkan"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#819085]">
                  Bergabung Sejak
                </p>
                <p className="mt-1 font-semibold">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-[#E1EADF] bg-white p-5 sm:p-7">
          <h2 className="text-lg font-bold">
            Sistem Akuaponikku
          </h2>
          <p className="mt-2 text-sm text-[#6A7B6E]">
            Kelola instalasi akuaponik dan pantau kondisi air
            melalui dashboard monitoring.
          </p>

          <button
            type="button"
            onClick={() => router.push("/akuaponikku")}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#28784A]"
          >
            Buka Akuaponikku
            <ArrowRight size={17} />
          </button>
        </section>

        <section className="rounded-2xl border border-red-100 bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">
                Keluar dari Akun
              </h2>
              <p className="mt-1 text-sm text-[#6A7B6E]">
                Akhiri sesi login pada perangkat ini.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setConfirmLogout(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </section>
      </div>

      {confirmLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="logout-title"
              className="text-xl font-bold"
            >
              Keluar dari SYMBIOLOGY?
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#6A7B6E]">
              Kamu perlu login kembali untuk mengakses
              dashboard dan sistem akuaponik.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={loggingOut}
                onClick={() => setConfirmLogout(false)}
                className="flex-1 rounded-xl border border-[#DCE8DE] py-3 text-sm font-semibold"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={loggingOut}
                onClick={() => void logout()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loggingOut && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
