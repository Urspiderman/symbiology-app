
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  House,
  ShoppingBag,
  Sparkles,
  Activity,
  UserRound,
  Bell,
  ChevronDown,
  LogOut,
  LoaderCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const menus = [
  { href: "/dashboard", label: "Beranda", Icon: House },
  { href: "/marketplace", label: "Marketplace", Icon: ShoppingBag },
  { href: "/ai-studio", label: "AI Studio", Icon: Sparkles },
  { href: "/akuaponikku", label: "Akuaponikku", Icon: Activity },
  { href: "/profile", label: "Profil", Icon: UserRound },
];

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const closeOutside = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [open]);

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) throw logoutError;

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
    <header className="sticky top-0 z-40 border-b border-[#E9E9DB] bg-[#FFFBF1]/95 shadow-[0_6px_24px_rgba(25,77,51,0.05)] backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* LOGO TANPA BACKGROUND */}
        <Link
          href="/dashboard"
          aria-label="SYMBIOLOGY Beranda"
          className="flex shrink-0 items-center"
        >
          <Image
            src="/images/logo/logo.svg"
            alt="SYMBIOLOGY"
            width={190}
            height={60}
            priority
            className="h-auto w-[135px] object-contain sm:w-[160px] xl:w-[190px]"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav
          aria-label="Navigasi desktop"
          className="hidden items-center gap-1 rounded-full border border-[#E6EBDD] bg-[#F4F0E5] p-1.5 lg:flex"
        >
          {menus.map(({ href, label, Icon }) => {
            const active =
              pathname === href ||
              pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-2 rounded-full px-3 py-2.5 text-xs font-semibold transition-colors xl:px-4 xl:text-sm ${
                  active
                    ? "text-white"
                    : "text-[#607665] hover:text-[#194D33]"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="symbiology-nav-pill"
                    className="absolute inset-0 rounded-full bg-[#194D33] shadow-[3px_4px_9px_rgba(25,77,51,0.18),inset_1px_1px_3px_rgba(255,255,255,0.15)]"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            type: "spring",
                            stiffness: 360,
                            damping: 30,
                          }
                    }
                  />
                )}

                <Icon size={17} className="relative z-10" />
                <span className="relative z-10">
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="flex shrink-0 items-center gap-2">
          <motion.div
            whileHover={reduceMotion ? undefined : { y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.94 }}
          >
            <Link
              href="/profile/notifications"
              aria-label="Notifikasi"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-[#E7F3E4] text-[#194D33] shadow-[3px_4px_10px_rgba(25,77,51,0.08),inset_2px_2px_4px_white]"
            >
              <Bell size={20} />
            </Link>
          </motion.div>

          <div className="relative" ref={dropdownRef}>
            <motion.button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              aria-label="Menu akun"
              aria-expanded={open}
              aria-haspopup="menu"
              className="flex h-11 items-center gap-1.5 rounded-2xl border border-white/70 bg-[#FFDA57] px-3 text-[#194D33] shadow-[4px_5px_12px_rgba(135,105,23,0.14),inset_2px_2px_4px_rgba(255,255,255,0.55)]"
            >
              <UserRound size={21} />
              <ChevronDown
                size={15}
                className={`transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            <AnimatePresence>
              {open && (
                <motion.div
                  role="menu"
                  aria-label="Menu akun"
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: -8, scale: 0.96 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={
                    reduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : { opacity: 0, y: -6, scale: 0.97 }
                  }
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-[calc(100%+14px)] z-50 w-[245px] max-w-[calc(100vw-24px)] rounded-[25px] border border-white bg-[#FFFBF1] p-3 shadow-[8px_12px_28px_rgba(25,77,51,0.16),inset_2px_2px_5px_white]"
                >
                  <div className="border-b border-[#E6EBDD] px-3 pb-3">
                    <p className="text-sm font-extrabold text-[#194D33]">
                      Akun SYMBIOLOGY
                    </p>
                    <p className="mt-1 text-xs text-[#718573]">
                      Kelola akun dan preferensi
                    </p>
                  </div>

                  <Link
                    role="menuitem"
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="mt-2 flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[#194D33] transition hover:bg-[#E7F3E4]"
                  >
                    <UserRound size={18} />
                    Profil Saya
                  </Link>

                  <Link
                    role="menuitem"
                    href="/profile/notifications"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-[#194D33] transition hover:bg-[#E7F3E4]"
                  >
                    <Bell size={18} />
                    Notifikasi
                  </Link>

                  <div className="mt-2 border-t border-[#E6EBDD] pt-2">
                    <button
                      role="menuitem"
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
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
                      <p role="alert" className="px-3 text-xs text-red-600">
                        {error}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
