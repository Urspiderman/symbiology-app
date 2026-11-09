
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import {
  House,
  ShoppingBag,
  Sparkles,
  Activity,
  UserRound,
} from "lucide-react";

const menus = [
  { href: "/dashboard", label: "Beranda", Icon: House },
  { href: "/marketplace", label: "Market", Icon: ShoppingBag },
  { href: "/ai-studio", label: "AI Studio", Icon: Sparkles },
  { href: "/akuaponikku", label: "Sistem", Icon: Activity },
  { href: "/profile", label: "Profil", Icon: UserRound },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Navigasi mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white bg-[#FFFBF1]/95 px-2 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-2 shadow-[0_-8px_30px_rgba(25,77,51,0.13)] backdrop-blur-lg lg:hidden"
    >
      <div className="mx-auto grid max-w-xl grid-cols-5 items-end gap-1">
        {menus.map(({ href, label, Icon }, index) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");
          const isAI = index === 2;

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-col items-center justify-end gap-1 text-[10px] font-bold ${
                active ? "text-[#194D33]" : "text-[#7B9180]"
              }`}
            >
              <motion.span
                whileTap={reduceMotion ? undefined : { scale: 0.88 }}
                animate={
                  reduceMotion
                    ? undefined
                    : { y: active && !isAI ? -2 : 0 }
                }
                className={
                  isAI
                    ? "-mt-7 flex h-14 w-14 items-center justify-center rounded-full border-[5px] border-[#FFFBF1] bg-[#FFDA57] text-[#194D33] shadow-[5px_7px_14px_rgba(132,105,24,0.2),inset_2px_2px_5px_rgba(255,255,255,0.7)]"
                    : `flex h-10 w-10 items-center justify-center rounded-2xl ${
                        active
                          ? "bg-[#E7F3E4] shadow-[inset_2px_2px_4px_white,3px_4px_9px_rgba(25,77,51,0.1)]"
                          : ""
                      }`
                }
              >
                <Icon size={isAI ? 25 : 21} />
              </motion.span>

              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
