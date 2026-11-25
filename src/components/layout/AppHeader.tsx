"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  House,
  Users,
  Sparkles,
  ShoppingBag,
  UserRound,
  Bell,
  ChevronDown,
  LogOut,
  LoaderCircle,
  Settings,
} from "lucide-react";

import {
  navigation,
  isNavigationActive,
} from "@/config/navigation";

import { createClient } from "@/lib/supabase/client";

const icons = {
  house: House,
  users: Users,
  sparkles: Sparkles,
  "shopping-bag": ShoppingBag,
  "user-round": UserRound,
};

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function handleOutside(event: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setOpen(false);
      router.replace("/onboarding");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal keluar dari akun."
      );

      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-primary text-background shadow-md">

      <div className="mx-auto flex h-[78px] max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* BRAND */}

        <Link
          href="/dashboard"
          aria-label="SYMBIOLOGY Beranda"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/images/logo/logo-white.svg"
            alt="SYMBIOLOGY"
            width={180}
            height={60}
            priority
            className="h-auto w-[135px] object-contain xl:w-[180px]"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}

        <nav
          aria-label="Navigasi desktop"
          className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5 lg:flex"
        >
          {navigation.map((menu) => {
            const Icon = icons[menu.icon];

            const active = isNavigationActive(
              pathname,
              menu.matchPaths
            );

            const isAI = menu.icon === "sparkles";

            return (
              <Link
                key={menu.href}
                href={menu.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-3 text-xs font-semibold transition-all xl:px-5 xl:text-sm ${
                  isAI
                    ? "bg-accent text-primary-dark hover:bg-accent-hover"
                    : active
                    ? "bg-background text-primary"
                    : "text-background/80 hover:bg-white/10 hover:text-white"
                } ${isAI && active ? "ring-2 ring-background" : ""}`}
              >
                <Icon size={18} />
                <span>{menu.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* HEADER ACTIONS */}

        <div className="flex shrink-0 items-center gap-2">

          <Link
            href="/profile/notifications"
            aria-label="Notifikasi"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 transition hover:bg-white/20"
          >
            <Bell size={20} />
          </Link>

          <div className="relative" ref={dropdownRef}>

            <button
              type="button"
              aria-label="Menu akun"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="flex h-11 items-center gap-2 rounded-2xl bg-accent px-3 text-primary-dark transition hover:bg-accent-hover"
            >
              <UserRound size={20} />
              <ChevronDown
                size={15}
                className={`transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {open && (
              <div className="absolute right-0 top-[calc(100%+14px)] z-50 w-64 max-w-[calc(100vw-24px)] rounded-3xl border border-border bg-white p-3 text-primary shadow-xl">

                <div className="border-b border-border px-3 pb-4 pt-2">
                  <p className="font-bold">
                    Akun SYMBIOLOGY
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    Kelola akun dan preferensi
                  </p>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center gap-3 rounded-xl p-3 text-sm font-semibold hover:bg-primary-light"
                >
                  <UserRound size={18} />
                  Profil Saya
                </Link>

                <Link
                  href="/profile/notifications"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold hover:bg-primary-light"
                >
                  <Bell size={18} />
                  Notifikasi
                </Link>

                <Link
                  href="/profile/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold hover:bg-primary-light"
                >
                  <Settings size={18} />
                  Pengaturan
                </Link>

                <div className="mt-2 border-t border-border pt-2">

                  <button
                    type="button"
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    {loggingOut ? (
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                    ) : (
                      <LogOut size={18} />
                    )}

                    {loggingOut
                      ? "Sedang keluar..."
                      : "Keluar Akun"}
                  </button>

                  {error && (
                    <p role="alert" className="p-3 text-xs text-red-600">
                      {error}
                    </p>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}