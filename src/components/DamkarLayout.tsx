import { ReactNode } from "react";

interface DamkarLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function DamkarLayout({
  children,
  className = "",
}: DamkarLayoutProps) {
  return (
    <div className={`flex flex-col min-h-screen bg-[#F6F0F0] ${className}`}>
      {/* Header khusus Damkar */}
      <header className="w-full bg-[#57B4BA] text-white px-8 py-4 text-center font-bold text-lg shadow-md">
        Peta Damkar Kota Surabaya
      </header>

      {/* Konten utama */}
      <main className="flex-1 p-8 text-black">{children}</main>
    </div>
  );
}
