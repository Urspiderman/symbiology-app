
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SYMBIOLOGY",
    template: "%s | SYMBIOLOGY",
  },
  description:
    "AI-Powered Smart Aquaponics Ecosystem — Grow UR Future",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-[#FFFBF1] text-[#194D33] antialiased">
        {children}
      </body>
    </html>
  );
}
