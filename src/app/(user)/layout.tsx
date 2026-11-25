import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import AppHeader from "@/components/layout/AppHeader";
import BottomNavigation from "@/components/layout/BottomNavigation";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";

export default async function UserLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-background text-foreground">

      {/* BACKGROUND DECORATION */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-primary-light/70 blur-3xl" />

        <div className="absolute -left-40 top-[500px] h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative z-10">

        <AppHeader />

        <main className="w-full min-w-0 pb-32 lg:pb-12">

          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            {children}
          </div>

        </main>

        <BottomNavigation />

        <ChatbotWidget />

      </div>
    </div>
  );
}