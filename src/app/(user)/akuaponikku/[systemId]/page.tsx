
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Droplets,
  Fish,
  Leaf,
  Power,
  Thermometer,
  Waves,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useDemoIoT } from "@/lib/iot/use-demo";
import type { DemoReading } from "@/lib/iot/demo";

type SystemData = {
  id: string;
  name: string;
  location: string | null;
  tank_capacity_liters: number | null;
  fish_type: string | null;
  plant_type: string | null;
};

type Metric = "temperature" | "ph" | "waterLevel";

const metrics = {
  temperature: {
    title: "Suhu Air",
    unit: "°C",
    min: 24,
    max: 32,
    color: "#28784A",
  },
  ph: {
    title: "pH Air",
    unit: "",
    min: 6,
    max: 8,
    color: "#D2A42B",
  },
  waterLevel: {
    title: "Ketinggian Air",
    unit: "%",
    min: 0,
    max: 100,
    color: "#3987B7",
  },
};

function Chart({
  readings,
  metric,
}: {
  readings: DemoReading[];
  metric: Metric;
}) {
  const config = metrics[metric];
  const width = 700;
  const height = 200;
  const padding = 25;

  const data = readings.slice(-40);

  const points = data
    .map((reading, index) => {
      const x =
        padding +
        (index / Math.max(data.length - 1, 1)) *
          (width - padding * 2);

      const y =
        height -
        padding -
        ((reading[metric] - config.min) /
          (config.max - config.min)) *
          (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-[#E1EADF] bg-white p-5">
      <h3 className="font-bold text-[#173D2B]">
        {config.title}
      </h3>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 w-full"
        role="img"
        aria-label={`Grafik simulasi ${config.title}`}
      >
        {[0, 1, 2, 3, 4].map((index) => {
          const y =
            padding +
            (index / 4) * (height - padding * 2);

          return (
            <line
              key={index}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="#E7EEE5"
              strokeDasharray="4 5"
            />
          );
        })}

        <polyline
          points={points}
          fill="none"
          stroke={config.color}
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      <div className="mt-2 flex justify-between text-xs text-[#819085]">
        <span>
          {data.length
            ? new Date(data[0].timestamp).toLocaleTimeString("id-ID")
            : "-"}
        </span>
        <span>
          {data.length
            ? new Date(
                data[data.length - 1].timestamp
              ).toLocaleTimeString("id-ID")
            : "-"}
        </span>
      </div>
    </div>
  );
}

export default function AkuaponikMonitoringPage() {
  const params = useParams();
  const systemId = String(params.systemId ?? "");

  const { state, change } = useDemoIoT(systemId);

  const [system, setSystem] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSystem() {
      try {
        const supabase = createClient();

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
            "id,name,location,tank_capacity_liters,fish_type,plant_type"
          )
          .eq("id", systemId)
          .eq("user_id", user.id)
          .single();

        if (queryError || !data) {
          throw new Error("Sistem tidak ditemukan.");
        }

        if (!cancelled) setSystem(data as SystemData);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat sistem."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSystem();

    return () => {
      cancelled = true;
    };
  }, [systemId]);

  const latest = state?.readings.at(-1);

  const alerts: string[] = [];

  if (latest) {
    if (latest.temperature > 30) {
      alerts.push("Suhu simulasi melebihi 30°C.");
    }

    if (latest.ph < 6.5 || latest.ph > 7.5) {
      alerts.push("pH simulasi di luar rentang contoh.");
    }

    if (latest.waterLevel < 50) {
      alerts.push("Ketinggian air simulasi rendah.");
    }
  }

  if (state && !state.pumpOn) {
    alerts.push("Pompa simulasi sedang mati.");
  }

  if (loading || !state) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#28784A]">
        Memuat monitoring...
      </div>
    );
  }

  if (error || !system) {
    return (
      <main className="p-6">
        <p className="text-red-600">
          {error || "Sistem tidak ditemukan."}
        </p>
        <Link href="/akuaponikku" className="text-[#28784A] underline">
          Kembali
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFFBF1] px-4 py-7 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href="/akuaponikku"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#28784A]"
        >
          <ArrowLeft size={17} />
          Kembali ke Akuaponikku
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#28784A]">
              SYMBIOLOGY / Monitoring
            </p>
            <h1 className="mt-1 text-3xl font-bold text-[#173D2B]">
              {system.name}
            </h1>
            <p className="mt-2 text-sm text-[#6A7B6E]">
              {system.location || "Lokasi belum diisi"}
            </p>
          </div>

          <span className="rounded-full bg-[#EAF5EC] px-4 py-2 text-sm font-semibold text-[#28784A]">
            <Activity size={16} className="mr-2 inline" />
            Mode Demo
          </span>
        </div>

        <div className="rounded-xl border border-[#F2D889] bg-[#FFF7DA] p-4 text-sm text-[#80610A]">
          Monitoring menggunakan data simulasi lokal.
          Belum terhubung dengan sensor atau ESP32 asli.
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              {
                key: "temperature" as const,
                icon: Thermometer,
              },
              {
                key: "ph" as const,
                icon: Droplets,
              },
              {
                key: "waterLevel" as const,
                icon: Waves,
              },
            ]
          ).map(({ key, icon: Icon }) => (
            <div
              key={key}
              className="rounded-2xl border border-[#E1EADF] bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6A7B6E]">
                  {metrics[key].title}
                </p>
                <Icon size={22} className="text-[#28784A]" />
              </div>

              <p className="mt-5 text-3xl font-bold text-[#173D2B]">
                {latest?.[key].toFixed(key === "ph" ? 2 : 1) ?? "—"}
                <span className="ml-1 text-sm font-normal">
                  {metrics[key].unit}
                </span>
              </p>

              <p className="mt-2 text-xs text-[#819085]">
                Data sensor simulasi
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Chart readings={state.readings} metric="temperature" />
          <Chart readings={state.readings} metric="ph" />
          <Chart readings={state.readings} metric="waterLevel" />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-[#E1EADF] bg-white p-5">
            <h2 className="mb-5 text-lg font-bold text-[#173D2B]">
              Kontrol Perangkat
            </h2>

            <div className="flex items-center justify-between rounded-xl bg-[#F7FAF6] p-4">
              <div className="flex items-center gap-3">
                <Power className="text-[#28784A]" size={24} />
                <div>
                  <p className="font-semibold text-[#173D2B]">
                    Pompa Sirkulasi
                  </p>
                  <p className="text-xs text-[#819085]">
                    {state.pumpOn ? "Simulasi ON" : "Simulasi OFF"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={state.autoMode}
                onClick={() =>
                  change((previous) => ({
                    ...previous,
                    pumpOn: !previous.pumpOn,
                  }))
                }
                className={`rounded-xl px-5 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                  state.pumpOn ? "bg-[#28784A]" : "bg-[#A04E46]"
                }`}
              >
                {state.pumpOn ? "ON" : "OFF"}
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-[#E7EEE5] p-4">
              <div>
                <p className="font-semibold text-[#173D2B]">
                  Mode Otomatis
                </p>
                <p className="text-xs text-[#819085]">
                  Matikan untuk mengontrol pompa manual
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  change((previous) => ({
                    ...previous,
                    autoMode: !previous.autoMode,
                    pumpOn: !previous.autoMode
                      ? true
                      : previous.pumpOn,
                  }))
                }
                className="rounded-full bg-[#EAF5EC] px-4 py-2 text-xs font-bold text-[#28784A]"
              >
                {state.autoMode ? "AUTO ON" : "MANUAL"}
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E1EADF] bg-white p-5">
            <h2 className="mb-5 text-lg font-bold text-[#173D2B]">
              Status & Peringatan
            </h2>

            {alerts.length ? (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert}
                    className="flex items-start gap-3 rounded-xl bg-[#FFF2E5] p-4 text-sm text-[#9C5B19]"
                  >
                    <AlertTriangle size={20} />
                    {alert}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl bg-[#EAF5EC] p-4 text-[#28784A]">
                <CheckCircle2 size={21} />
                <div>
                  <p className="font-semibold">Simulasi Normal</p>
                  <p className="mt-1 text-xs">
                    Nilai berada dalam batas contoh.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        <section className="rounded-2xl border border-[#E1EADF] bg-white p-5">
          <h2 className="mb-4 text-lg font-bold text-[#173D2B]">
            Informasi Instalasi
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Droplets size={18} className="text-[#28784A]" />
              <p className="mt-2 text-xs text-[#819085]">Tangki</p>
              <p className="font-semibold text-[#173D2B]">
                {system.tank_capacity_liters
                  ? `${system.tank_capacity_liters} Liter`
                  : "Belum diisi"}
              </p>
            </div>

            <div>
              <Fish size={18} className="text-[#28784A]" />
              <p className="mt-2 text-xs text-[#819085]">Ikan</p>
              <p className="font-semibold text-[#173D2B]">
                {system.fish_type || "Belum diisi"}
              </p>
            </div>

            <div>
              <Leaf size={18} className="text-[#28784A]" />
              <p className="mt-2 text-xs text-[#819085]">Tanaman</p>
              <p className="font-semibold text-[#173D2B]">
                {system.plant_type || "Belum diisi"}
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/akuaponikku/history?systemId=${systemId}`}
            className="rounded-xl border border-[#DCE8DE] bg-white px-5 py-3 text-sm font-semibold text-[#28784A]"
          >
            Lihat Riwayat Monitoring
          </Link>

          <Link
            href={`/akuaponikku/connect?systemId=${systemId}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#28784A] px-5 py-3 text-sm font-semibold text-white"
          >
            <Cpu size={17} />
            Hubungkan ESP32
          </Link>
        </div>
      </div>
    </main>
  );
}
