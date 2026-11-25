
import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FFFAE7] text-[#005B45]">
      {children}
    </div>
  );
}
