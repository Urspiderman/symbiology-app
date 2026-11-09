
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Activity } from "lucide-react";
import { useDemoIoT } from "@/lib/iot/use-demo";
import type { DemoReading } from "@/lib/iot/demo";

type Metric = "temperature" | "ph" | "waterLevel";

const metrics = {
  temperature: {
    label: "Suhu Air",
    unit: "°C",
    color: "#28784A",
    min: 24,
    max: 32,
  },
  ph: {
    label: "pH Air",
    unit: "",
    color: "#D2A42B",
    min: 6,
    max: 8,
  },
  waterLevel: {
    label: "Ketinggian Air",
    unit: "%",
    color: "#3987B7",
    min: 0,
    max: 100,
  },
};

export default function MonitoringHistoryPage() {
  const searchParams = useSearchParams();
  const systemId = searchParams.get("systemId") || "";

  const { state } = useDemoIoT(systemId);
  const [metric, setMetric] = useState<Metric>("temperature");

  if (!systemId) {
    return (
      <main className="p-8">
        <p>Pilih sistem dari halaman Akuaponikku terlebih dahulu.</p>
        <Link href="/akuaponikku" className="text-[#28784A] underline">
          Kembali ke daftar sistem
        </Link>
      </main>
    );
  }

  const readings: DemoReading[] = state?.readings ?? [];
  const values = readings.map((item) => item[metric]);
  const config = metrics[metric];

  const average = values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;

  const minimum = values.length ? Math.min(...values) : 0;
  const maximum = values.length ? Math.max(...values) : 0;

  const width = 800;
  const height = 260;
  const padding = 35;

  const points = readings
    .map((reading, index) => {
      const x =
        padding +
        (index / Math.max(readings.length - 1, 1)) *
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
    <main className="min-h-screen bg-[#FFFBF1] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          href={`/akuaponikku/${systemId}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#28784A]"
        >
          <ArrowLeft size={17} />
          Kembali ke Monitoring
        </Link>

        <div>
          <p className="text-sm font-semibold text-[#28784A]">
            SYMBIOLOGY / Akuaponikku
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#173D2B]">
            Riwayat Monitoring
          </h1>
          <p className="mt-2 text-sm text-[#6A7B6E]">
            Riwayat pembacaan simulasi sistem akuaponik.
          </p>
        </div>

        <div className="rounded-xl border border-[#F2D889] bg-[#FFF7DA] p-4 text-sm text-[#80610A]">
          Mode Demo: data tersimpan di browser, bukan
          berasal dari ESP32 atau Supabase.
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {(
            ["temperature", "ph", "waterLevel"] as Metric[]
          ).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setMetric(key)}
              className={`rounded-2xl border p-5 text-left ${
                metric === key
                  ? "border-[#28784A] bg-[#EAF5EC]"
                  : "border-[#E1EADF] bg-white"
              }`}
            >
              <p className="text-sm text-[#6A7B6E]">
                {metrics[key].label}
              </p>
              <p className="mt-2 text-2xl font-bold text-[#173D2B]">
                {readings.length
                  ? readings[readings.length - 1][key].toFixed(2)
                  : "—"}
                {" "}{metrics[key].unit}
              </p>
            </button>
          ))}
        </div>

        <section className="rounded-2xl border border-[#E1EADF] bg-white p-5 sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#173D2B]">
              Grafik {config.label}
            </h2>
            <span className="rounded-full bg-[#EAF5EC] px-3 py-1 text-xs font-semibold text-[#28784A]">
              <Activity size={13} className="mr-1 inline" />
              Simulasi
            </span>
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full"
            role="img"
            aria-label={`Grafik ${config.label}`}
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
                  strokeDasharray="5 5"
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

          <div className="mt-3 flex justify-between text-xs text-[#819085]">
            <span>
              {readings.length
                ? new Date(readings[0].timestamp).toLocaleString("id-ID")
                : "-"}
            </span>
            <span>
              {readings.length
                ? new Date(
                    readings[readings.length - 1].timestamp
                  ).toLocaleString("id-ID")
                : "-"}
            </span>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Rata-rata", average],
            ["Terendah", minimum],
            ["Tertinggi", maximum],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-[#E1EADF] bg-white p-5"
            >
              <p className="text-sm text-[#6A7B6E]">
                {label}
              </p>
              <p className="mt-2 text-2xl font-bold text-[#173D2B]">
                {Number(value).toFixed(2)} {config.unit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
