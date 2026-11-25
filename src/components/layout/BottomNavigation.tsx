"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Users,
  Sparkles,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import { motion, useReducedMotion } from "motion/react";

import {
  navigation,
  isNavigationActive,
} from "@/config/navigation";

const icons = {
  house: House,
  users: Users,
  sparkles: Sparkles,
  "shopping-bag": ShoppingBag,
  "user-round": UserRound,
};

export default function BottomNavigation() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Navigasi mobile"
      className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+12px)] z-40 mx-auto max-w-lg rounded-[28px] border border-white/10 bg-primary px-2 pb-3 pt-2 shadow-[0_10px_35px_rgba(0,91,69,0.28)] lg:hidden"
    >
      <div className="grid grid-cols-5 items-end gap-1">

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
              className="flex min-w-0 flex-col items-center justify-end gap-1"
            >

              <motion.span
                whileTap={
                  reduceMotion
                    ? undefined
                    : { scale: 0.9 }
                }
                className={
                  isAI
                    ? `-mt-7 flex h-[58px] w-[58px] items-center justify-center rounded-full border-[5px] border-primary bg-accent text-primary-dark shadow-lg ${
                        active ? "ring-2 ring-background" : ""
                      }`
                    : `flex h-10 w-10 items-center justify-center rounded-2xl transition-colors ${
                        active
                          ? "bg-background text-primary"
                          : "text-background/80"
                      }`
                }
              >
                <Icon size={isAI ? 25 : 21} />
              </motion.span>

              <span
                className={`max-w-full truncate text-[10px] font-semibold ${
                  isAI
                    ? "text-accent"
                    : active
                    ? "text-background"
                    : "text-background/70"
                }`}
              >
                {menu.shortLabel}
              </span>

            </Link>
          );
        })}

      </div>
    </nav>
  );
}