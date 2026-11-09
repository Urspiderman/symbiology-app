
"use client";

import Link from "next/link";
import {
  Activity,
  Droplets,
  Fish,
  Leaf,
  Power,
  Sprout,
  Thermometer,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useDemoIoT } from "@/lib/iot/use-demo";

type Props = {
  systemId: string | null;
  systemName?: string | null;
  fishType?: string | null;
  plantType?: string | null;
};

export function DemoStats({
  systemId,
  fishType,
  plantType,
}: Props) {
  const { state } = useDemoIoT(systemId ?? "");
  const latest = state?.readings.at(-1);

  const stats = [
    {
      title: "Tanaman Aktif",
      value: plantType || "—",
      note: plantType ? "Jenis tanaman sistem" : "Belum ada data tanaman",
      Icon: Sprout,
      bg: "bg-[#E7F3E4]",
    },
    {
      title: "Ikan dalam Sistem",
      value: fishType || "—",
      note: fishType ? "Jenis ikan sistem" : "Belum ada data ikan",
      Icon: Fish,
      bg: "bg-[#FFF1B8]",
    },
    {
      title: "pH Air",
      value: latest ? latest.ph.toFixed(2) : "—",
      note: latest ? "Sensor simulasi IoT" : "Belum ada sistem",
      Icon: Droplets,
      bg: "bg-[#E7F3E4]",
    },
    {
      title: "Suhu Air",
      value: latest ? `${latest.temperature.toFixed(1)}°C` : "—",
      note: latest ? "Sensor simulasi IoT" : "Belum ada sistem",
      Icon: Thermometer,
      bg: "bg-[#FFF1B8]",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
      {stats.map(({ title, value, note, Icon, bg }, index) => (
        <article
          key={title}
          className="clay-card motion-fade-up p-4 sm:p-6"
          style={{ animationDelay: `${index * 90}ms` }}
        >
          <div
            className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${bg} text-[#194D33] shadow-[inset_2px_2px_5px_white,4px_5px_10px_rgba(25,77,51,0.1)]`}
          >
            <Icon size={24} />
          </div>
          <p className="break-words text-xl font-extrabold text-[#194D33] sm:text-3xl">
            {value}
          </p>
          <h2 className="mt-2 text-sm font-bold text-[#194D33]">
            {title}
          </h2>
          <p className="mt-2 text-xs text-[#7B8C7B]">
            {note}
          </p>
        </article>
      ))}
    </section>
  );
}

export function DemoSystemStatus({
  systemId,
  systemName,
}: Props) {
  const { state } = useDemoIoT(systemId ?? "");
  const latest = state?.readings.at(-1);

  const warnings: string[] = [];

  if (latest) {
    if (latest.temperature > 30) warnings.push("Suhu air tinggi");
    if (latest.ph < 6.5 || latest.ph > 7.5) {
      warnings.push("pH di luar batas contoh");
    }
    if (latest.waterLevel < 50) {
      warnings.push("Ketinggian air rendah");
    }
  }

  if (state && !state.pumpOn) {
    warnings.push("Pompa mati");
  }

  const detailHref = systemId
    ? `/akuaponikku/${systemId}`
    : "/akuaponikku";

  const connectHref = systemId
    ? `/akuaponikku/connect?systemId=${systemId}`
    : "/akuaponikku";

  return (
    <article className="clay-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-[#194D33]">
          Kondisi Sistem
        </h2>
        <Link href={detailHref} className="text-xs font-bold text-[#28784A]">
          Lihat Detail
        </Link>
      </div>

      <div className="mt-6 flex min-h-[245px] flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#C9DEC9] bg-[#E7F3E4] p-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#FFFBF1] text-[#194D33] shadow-[5px_6px_14px_rgba(25,77,51,0.12),inset_2px_2px_5px_white]">
          {state?.connected ? <Wifi size={30} /> : <WifiOff size={30} />}
        </div>

        {!systemId ? (
          <>
            <h3 className="mt-5 font-bold text-[#194D33]">
              Belum Ada Sistem Akuaponik
            </h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-[#607665]">
              Tambahkan sistem terlebih dahulu untuk memulai monitoring.
            </p>
          </>
        ) : (
          <>
            <h3 className="mt-5 font-bold text-[#194D33]">
              {systemName || "Sistem Akuaponik"}
            </h3>
            <p className="mt-1 text-xs font-semibold text-[#28784A]">
              {state?.connected
                ? "ESP32 Demo Terhubung"
                : "Sensor Aktif dalam Mode Demo"}
            </p>

            <div className="mt-4 grid w-full grid-cols-2 gap-2 text-left">
              <div className="rounded-xl bg-white/80 p-3">
                <p className="text-xs text-[#607665]">Ketinggian Air</p>
                <p className="mt-1 font-extrabold text-[#194D33]">
                  {latest ? `${latest.waterLevel.toFixed(1)}%` : "—"}
                </p>
              </div>
              <div className="rounded-xl bg-white/80 p-3">
                <p className="text-xs text-[#607665]">Pompa</p>
                <p className="mt-1 flex items-center gap-1 font-extrabold text-[#194D33]">
                  <Power size={15} />
                  {state ? (state.pumpOn ? "ON" : "OFF") : "—"}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-[#607665]">
              {warnings.length
                ? `${warnings.length} peringatan: ${warnings.join(", ")}`
                : "Kondisi simulasi normal"}
            </p>
          </>
        )}

        <Link
          href={systemId && !state?.connected ? connectHref : detailHref}
          className="mt-5 rounded-2xl bg-[#194D33] px-5 py-3 text-sm font-bold text-white shadow-[4px_5px_12px_rgba(25,77,51,0.18)] transition hover:-translate-y-1"
        >
          {!systemId
            ? "Tambah Sistem"
            : !state?.connected
              ? "Hubungkan Perangkat Demo"
              : "Buka Monitoring"}
        </Link>
      </div>
    </article>
  );
}

export function DemoRecentActivity({
  systemId,
}: {
  systemId: string | null;
}) {
  const { state } = useDemoIoT(systemId ?? "");
  const readings = state?.readings.slice(-3).reverse() ?? [];

  return (
    <article className="clay-card p-6">
      <h2 className="text-lg font-extrabold text-[#194D33]">
        Aktivitas Terbaru
      </h2>

      <div className="mt-5 rounded-[24px] bg-[#E7F3E4] p-5">
        {!readings.length ? (
          <div className="py-3 text-center">
            <Activity size={32} className="mx-auto text-[#28784A]" />
            <p className="mt-3 text-sm font-bold text-[#194D33]">
              Belum ada aktivitas
            </p>
            <p className="mt-2 text-xs text-[#607665]">
              Aktivitas sistemmu akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {readings.map((reading) => (
              <div
                key={reading.timestamp}
                className="flex items-center gap-3 rounded-2xl bg-white/80 p-3"
              >
                <div className="rounded-xl bg-[#E7F3E4] p-2 text-[#28784A]">
                  <Activity size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#194D33]">
                    Pembacaan Sensor Demo
                  </p>
                  <p className="mt-1 text-xs text-[#607665]">
                    pH {reading.ph.toFixed(2)} · Suhu{" "}
                    {reading.temperature.toFixed(1)}°C
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-[#7B8C7B]">
                  {new Date(reading.timestamp).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
