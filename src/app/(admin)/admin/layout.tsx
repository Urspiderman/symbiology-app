
import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFFBF1] text-[#194D33]">
      {children}
    </div>
  );
}
