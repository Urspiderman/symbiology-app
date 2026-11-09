
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useDemoIoT } from "@/lib/iot/use-demo";

export default function ConnectDevicePage() {
  const searchParams = useSearchParams();
  const systemId = searchParams.get("systemId") || "";

  const { state, change } = useDemoIoT(systemId);
  const [connecting, setConnecting] = useState(false);

  if (!systemId) {
    return (
      <main className="p-8">
        <p>Pilih sistem akuaponik terlebih dahulu.</p>
        <Link href="/akuaponikku" className="text-[#28784A] underline">
          Kembali ke Akuaponikku
        </Link>
      </main>
    );
  }

  function connect() {
    if (connecting) return;

    setConnecting(true);

    window.setTimeout(() => {
      change((previous) => ({
        ...previous,
        connected: true,
      }));
      setConnecting(false);
    }, 1500);
  }

  function disconnect() {
    change((previous) => ({
      ...previous,
      connected: false,
    }));
  }

  return (
    <main className="min-h-screen bg-[#FFFBF1] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-6">
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
            Hubungkan Perangkat
          </h1>
          <p className="mt-2 text-sm text-[#6A7B6E]">
            Simulasi koneksi ESP32 Smart Controller.
          </p>
        </div>

        <div className="rounded-xl border border-[#F2D889] bg-[#FFF7DA] p-4 text-sm text-[#80610A]">
          Mode Demo: tombol koneksi hanya mengubah status
          simulasi di browser. Tidak ada perangkat fisik
          yang terhubung.
        </div>

        <section className="rounded-2xl border border-[#E1EADF] bg-white p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EAF5EC] text-[#28784A]">
              <Cpu size={38} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#173D2B]">
              {state?.deviceName || "ESP32 Smart Controller"}
            </h2>

            <p className="mt-2 text-sm text-[#6A7B6E]">
              Pengendali sensor dan pompa akuaponik
            </p>

            <div className="mt-5">
              {state?.connected ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF5EC] px-4 py-2 text-sm font-semibold text-[#28784A]">
                  <CheckCircle2 size={17} />
                  Simulasi Terhubung
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600">
                  <WifiOff size={17} />
                  Belum Terhubung
                </span>
              )}
            </div>
          </div>

          <div className="mt-7">
            {state?.connected ? (
              <button
                type="button"
                onClick={disconnect}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#DCE8DE] py-3 font-semibold text-[#173D2B]"
              >
                <WifiOff size={18} />
                Putuskan Simulasi
              </button>
            ) : (
              <button
                type="button"
                onClick={connect}
                disabled={connecting || !state}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#28784A] py-3 font-semibold text-white disabled:opacity-50"
              >
                <Wifi size={18} />
                {connecting
                  ? "Menghubungkan simulasi..."
                  : "Hubungkan Simulasi"}
              </button>
            )}
          </div>
        </section>

        <Link
          href={`/akuaponikku/${systemId}`}
          className="block rounded-xl bg-[#EAF5EC] px-5 py-3 text-center text-sm font-semibold text-[#28784A]"
        >
          Buka Dashboard Monitoring
        </Link>
      </div>
    </main>
  );
}
