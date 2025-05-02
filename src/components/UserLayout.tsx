import { ReactNode } from "react";

// Pastikan className opsional pada UserLayoutProps
interface UserLayoutProps {
  children: ReactNode;
  className?: string; // className opsional
}

export default function UserLayout({ children, className }: UserLayoutProps) {
  return (
    <div className={`flex flex-col min-h-screen bg-[#F6F0F0] ${className}`}>
      {/* Header */}
      <header className="w-full bg-[#57B4BA] text-white px-8 py-4 text-center font-bold text-lg shadow-md">
        Peta Kerentanan Banjir
      </header>

      {/* Konten utama */}
      <main className="flex-1 p-8 text-black">{children}</main>
    </div>
  );
}
