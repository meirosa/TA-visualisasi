import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Map,
  Database,
  Activity,
  LogOut,
  Menu,
} from "lucide-react";
import Image from "next/image";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const email =
      localStorage.getItem("adminEmail") || localStorage.getItem("email") || "";
    setAdminEmail(email);
  }, []);

  const isActive = (path: string) => router.pathname === path;

  const pageTitleMap: Record<string, string> = {
    "/admin/dashboard": "Dashboard",
    "/admin/peta": "Peta",
    "/admin/data": "Data",
    "/admin/defuzzifikasi": "Defuzzifikasi",
  };

  const pageTitle = pageTitleMap[router.pathname] || "";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* ================= SIDEBAR ================= */}
      {sidebarOpen && (
        <aside className="w-64 bg-[#566773] text-white flex flex-col shrink-0">
          {/* LOGO */}
          <div className="bg-[#07263B] h-[70px] px-6 flex items-center gap-3">
            <Image
              src="/images/icon.png"
              alt="FuzzyFlood"
              width={32}
              height={70}
            />
            <div>
              <p className="text-sm font-bold leading-tight">FuzzyFlood</p>
              <p className="text-[6px] text-[#1292C9] whitespace-nowrap">
                Flood Vulnerability Visualization System
              </p>
            </div>
          </div>

          {/* MENU */}
          <div className="px-4 py-4 text-xs font-semibold text-gray-200">
            MENU
          </div>
          <div className="px-4 space-y-2">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm ${
                isActive("/admin/dashboard")
                  ? "bg-[#1292C9]"
                  : "bg-[#07263B]/60 hover:bg-[#07263B]"
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button
              onClick={() => router.push("/admin/peta")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm ${
                isActive("/admin/peta")
                  ? "bg-[#1292C9]"
                  : "bg-[#07263B]/60 hover:bg-[#07263B]"
              }`}
            >
              <Map size={18} />
              Peta
            </button>
          </div>

          {/* KELOLA DATA */}
          <div className="px-4 py-4 text-xs font-semibold text-gray-200">
            KELOLA DATA
          </div>
          <div className="px-4 space-y-2 flex-grow">
            <button
              onClick={() => router.push("/admin/data")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm ${
                isActive("/admin/data")
                  ? "bg-[#1292C9]"
                  : "bg-[#07263B]/60 hover:bg-[#07263B]"
              }`}
            >
              <Database size={18} />
              Data
            </button>
            <button
              onClick={() => router.push("/admin/defuzzifikasi")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm ${
                isActive("/admin/defuzzifikasi")
                  ? "bg-[#1292C9]"
                  : "bg-[#07263B]/60 hover:bg-[#07263B]"
              }`}
            >
              <Activity size={18} />
              Defuzzifikasi
            </button>
          </div>

          {/* LOGOUT */}
          <div className="p-4">
            <button
              onClick={() => {
                localStorage.clear();
                router.push("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 rounded-md text-sm hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>
      )}

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* TOP AREA */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          {/* HAMBURGER */}
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={28} className="text-gray-700" />
          </button>

          {/* GREETING */}
          <div className="text-right leading-tight">
            <p className="text-black font-semibold">Selamat Datang Admin!</p>
            <p className="text-black/50 text-sm">{adminEmail}</p>
          </div>
        </div>

        {/* PAGE TITLE */}
        <h1 className="text-xl font-semibold text-black px-6 pt-4 pb-2 flex-shrink-0">
          {pageTitle}
        </h1>

        {/* ================= CONTENT WRAPPER (abu-abu) ================= */}
        <div
          className="border rounded-md p-6"
          style={{
            backgroundColor: "rgba(7,38,59,0.1)",
            height: "80vh", // Atur tinggi div abu-abu
            width: "97%", // Atur lebar div abu-abu
            margin: "0 auto", // Tengah horizontal
          }}
        >
          <div className="h-full overflow-auto">
            {children} {/* Scrollable di sini */}
          </div>
        </div>
      </main>
    </div>
  );
}
