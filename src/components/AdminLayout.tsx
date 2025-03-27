import { useRouter } from "next/router";
import { ReactNode } from "react";
import { LayoutDashboard, Map, Database, Activity, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#F6F0F0]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#57B4BA] text-black flex flex-col h-screen">
        {/* 🔹 Background hitam lebih besar */}
        <div className="bg-black text-white font-bold text-center py-7">
          KERENTANAN BANJIR
        </div>

        {/* MENU */}
        <div className="p-6">
          <h3 className="font-bold mb-2">MENU</h3>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center w-full px-4 py-2 border border-black text-black bg-white hover:bg-gray-200 active:bg-[#4F959D] transition rounded-md mt-2"
          >
            <LayoutDashboard className="mr-2" size={20} />
            Dashboard
          </button>
          <button
            onClick={() => router.push("/admin/peta")}
            className="flex items-center w-full px-4 py-2 border border-black text-black bg-white hover:bg-gray-200 active:bg-[#4F959D] transition rounded-md mt-2"
          >
            <Map className="mr-2" size={20} />
            Peta
          </button>

          <h3 className="font-bold mt-4 mb-2">KELOLA DATA</h3>

          <button
            onClick={() => router.push("/admin/data")}
            className="flex items-center w-full px-4 py-2 border border-black text-black bg-white hover:bg-gray-200 active:bg-[#4F959D] transition rounded-md mt-2"
          >
            <Database className="mr-2" size={20} />
            Data
          </button>
          <button
            onClick={() => router.push("/admin/defuzzifikasi")}
            className="flex items-center w-full px-4 py-2 border border-black text-black bg-white hover:bg-gray-200 active:bg-[#4F959D] transition rounded-md mt-2"
          >
            <Activity className="mr-2" size={20} />
            Defuzzifikasi
          </button>
        </div>

        {/* Logout tetap di bawah */}
        <div className="mt-auto p-6">
          <button
            onClick={() => router.push("/")}
            className="flex items-center w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            <LogOut className="mr-2" size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Konten utama */}
      <div className="flex flex-col flex-grow">
        {/* Header utama tetap ada */}
        <header className="w-full bg-white text-black px-8 py-4 flex justify-between items-center shadow-md">
          <div></div>
          <div className="text-right">
            <h2 className="font-bold">Selamat Datang Admin!</h2>
            <p className="text-gray-600">admin2905@gmail.com</p>
          </div>
        </header>

        {/* Bagian konten berubah sesuai halaman */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
