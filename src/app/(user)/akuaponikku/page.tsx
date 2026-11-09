
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Droplets,
  Fish,
  Leaf,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AquaponicsSystem = {
  id: string;
  name: string;
  location: string | null;
  system_type: string;
  tank_capacity_liters: number | null;
  fish_type: string | null;
  plant_type: string | null;
  status: "setup" | "active" | "inactive";
  created_at: string;
};

type SystemForm = {
  name: string;
  location: string;
  tank_capacity_liters: string;
  fish_type: string;
  plant_type: string;
};

const emptyForm: SystemForm = {
  name: "",
  location: "",
  tank_capacity_liters: "",
  fish_type: "",
  plant_type: "",
};

const inputClass =
  "w-full rounded-xl border border-[#DCE8DE] bg-white px-4 py-3 text-sm text-[#173D2B] outline-none transition focus:border-[#28784A] focus:ring-2 focus:ring-[#28784A]/10";

function statusLabel(status: AquaponicsSystem["status"]) {
  if (status === "active") return "Aktif";
  if (status === "inactive") return "Nonaktif";
  return "Persiapan";
}

export default function AkuaponikkuPage() {
  const [systems, setSystems] = useState<AquaponicsSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<SystemForm>(emptyForm);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const supabase = createClient();

  const loadSystems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      const { data, error: queryError } = await supabase
        .from("aquaponics_systems")
        .select(
          "id,name,location,system_type,tank_capacity_liters,fish_type,plant_type,status,created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setSystems((data ?? []) as AquaponicsSystem[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat sistem akuaponik."
      );
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void loadSystems();
  }, [loadSystems]);

  async function createSystem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setFormError("");

    const name = form.name.trim();
    const capacityText = form.tank_capacity_liters.trim();
    const capacity = capacityText === "" ? null : Number(capacityText);

    if (!name || name.length > 80) {
      setFormError("Nama sistem harus berisi 1–80 karakter.");
      return;
    }

    if (
      capacity !== null &&
      (!Number.isFinite(capacity) || capacity <= 0 || capacity > 100000)
    ) {
      setFormError("Kapasitas tangki harus lebih dari 0 dan maksimal 100.000 liter.");
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Sesi login tidak ditemukan.");
      }

      const { error: insertError } = await supabase
        .from("aquaponics_systems")
        .insert({
          user_id: user.id,
          name,
          location: form.location.trim() || null,
          system_type: "media_bed",
          tank_capacity_liters: capacity,
          fish_type: form.fish_type.trim() || null,
          plant_type: form.plant_type.trim() || null,
          status: "setup",
        });

      if (insertError) throw insertError;

      setShowModal(false);
      setForm(emptyForm);
      await loadSystems();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Gagal menambahkan sistem."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFBF1] px-4 py-7 text-[#173D2B] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-semibold text-[#28784A]">
              SYMBIOLOGY / Akuaponikku
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Akuaponikku
            </h1>
            <p className="mt-2 text-sm text-[#6A7B6E]">
              Kelola dan pantau seluruh sistem akuaponikmu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormError("");
              setShowModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#28784A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1E603A]"
          >
            <Plus size={18} />
            Tambah Sistem
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E2E9DF] bg-white p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF5EC] text-[#28784A]">
              <Leaf size={22} />
            </div>
            <p className="text-sm text-[#6A7B6E]">Total Sistem</p>
            <p className="mt-1 text-3xl font-bold">
              {loading ? "—" : systems.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#E2E9DF] bg-white p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF3C4] text-[#9C7610]">
              <Droplets size={22} />
            </div>
            <p className="text-sm text-[#6A7B6E]">
              Sistem Berstatus Aktif
            </p>
            <p className="mt-1 text-3xl font-bold">
              {loading
                ? "—"
                : systems.filter((system) => system.status === "active").length}
            </p>
            <p className="mt-1 text-xs text-[#819085]">
              Status administrasi, bukan koneksi sensor.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Daftar Sistem</h2>
          <button
            type="button"
            onClick={() => void loadSystems()}
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#28784A] disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2 className="animate-spin text-[#28784A]" size={30} />
          </div>
        ) : systems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D4E2D6] bg-white px-6 py-14 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF5EC] text-[#28784A]">
              <Leaf size={30} />
            </div>
            <h3 className="text-lg font-bold">Belum Ada Sistem Akuaponik</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6A7B6E]">
              Tambahkan sistem akuaponik pertamamu untuk mulai mengelola
              perangkat dan memantau kondisi air.
            </p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-6 rounded-xl bg-[#28784A] px-5 py-3 text-sm font-semibold text-white"
            >
              Tambah Sistem Pertama
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {systems.map((system) => (
              <article
                key={system.id}
                className="rounded-2xl border border-[#E2E9DF] bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF5EC] text-[#28784A]">
                    <Leaf size={24} />
                  </div>
                  <span className="rounded-full bg-[#F1F4EF] px-3 py-1 text-xs font-semibold text-[#526A58]">
                    {statusLabel(system.status)}
                  </span>
                </div>

                <h3 className="text-lg font-bold">{system.name}</h3>

                <p className="mt-2 flex items-center gap-2 text-sm text-[#6A7B6E]">
                  <MapPin size={15} />
                  {system.location || "Lokasi belum diisi"}
                </p>

                <div className="mt-5 space-y-3 border-t border-[#EDF1EA] pt-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#6A7B6E]">
                      <Droplets size={16} /> Tangki
                    </span>
                    <span className="font-semibold">
                      {system.tank_capacity_liters
                        ? `${system.tank_capacity_liters} L`
                        : "Belum diisi"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#6A7B6E]">
                      <Fish size={16} /> Ikan
                    </span>
                    <span className="font-semibold">
                      {system.fish_type || "Belum diisi"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[#6A7B6E]">
                      <Leaf size={16} /> Tanaman
                    </span>
                    <span className="font-semibold">
                      {system.plant_type || "Belum diisi"}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/akuaponikku/${system.id}`}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#28784A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1E603A]"
                >
                  Buka Monitoring
                  <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setShowModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-system-title"
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 id="create-system-title" className="text-xl font-bold">
                  Tambah Sistem Akuaponik
                </h2>
                <p className="mt-1 text-xs text-[#6A7B6E]">
                  Daftarkan instalasi yang ingin kamu pantau.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={saving}
                aria-label="Tutup"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={createSystem} className="space-y-4">
              {(
                [
                  ["name", "Nama Sistem", "Contoh: Akuaponik Balkon"],
                  ["location", "Lokasi", "Contoh: Balkon lantai 2"],
                  ["tank_capacity_liters", "Kapasitas Tangki (Liter)", "Contoh: 200"],
                  ["fish_type", "Jenis Ikan", "Contoh: Lele"],
                  ["plant_type", "Jenis Tanaman", "Contoh: Selada"],
                ] as const
              ).map(([key, label, placeholder]) => (
                <label key={key} className="block space-y-1.5">
                  <span className="text-sm font-medium">{label}</span>
                  <input
                    className={inputClass}
                    type={key === "tank_capacity_liters" ? "number" : "text"}
                    min={key === "tank_capacity_liters" ? 0.01 : undefined}
                    max={key === "tank_capacity_liters" ? 100000 : undefined}
                    step={key === "tank_capacity_liters" ? "any" : undefined}
                    required={key === "name"}
                    maxLength={key === "name" ? 80 : 200}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(event) =>
                      setForm((previous) => ({
                        ...previous,
                        [key]: event.target.value,
                      }))
                    }
                  />
                </label>
              ))}

              {formError && (
                <p role="alert" className="text-sm text-red-600">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#28784A] py-3 font-semibold text-white disabled:opacity-60"
              >
                {saving && <Loader2 size={18} className="animate-spin" />}
                {saving ? "Menyimpan..." : "Simpan Sistem"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
