import { ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F6F0F0]">
      {/* Header */}
      <header className="w-full bg-[#57B4BA] text-white px-8 py-4 text-center font-bold text-lg shadow-md">
        Peta Kerentanan Banjir
      </header>

      {/* Konten utama */}
      <main className="flex-1 p-8 text-black">{children}</main>
    </div>
  );
}
