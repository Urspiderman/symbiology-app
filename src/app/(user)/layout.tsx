
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
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#FFFBF1]">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -right-36 top-24 h-80 w-80 rounded-full bg-[#E7F3E4]/55 blur-3xl" />

        <div className="absolute -left-32 top-[500px] h-72 w-72 rounded-full bg-[#FFDA57]/15 blur-3xl" />
      </div>

      <div className="relative z-10">
        <AppHeader />

        <main className="w-full min-w-0 pb-28 lg:pb-10">
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
