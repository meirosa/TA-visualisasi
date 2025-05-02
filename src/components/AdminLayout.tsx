import { useRouter } from "next/router";
import { ReactNode } from "react";
import { LayoutDashboard, Map, Database, Activity, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="mr-2" size={20} />,
      label: "Dashboard",
    },
    {
      path: "/admin/peta",
      icon: <Map className="mr-2" size={20} />,
      label: "Peta",
    },
  ];

  const dataItems = [
    {
      path: "/admin/data",
      icon: <Database className="mr-2" size={20} />,
      label: "Data",
    },
    {
      path: "/admin/defuzzifikasi",
      icon: <Activity className="mr-2" size={20} />,
      label: "Defuzzifikasi",
    },
  ];

  const renderButton = (path: string, icon: ReactNode, label: string) => (
    <button
      onClick={() => router.push(path)}
      className={`flex items-center w-full px-4 py-2 border border-black text-black ${
        isActive(path) ? "bg-[#57B4BA]" : "bg-white hover:bg-gray-200"
      } transition rounded-md mt-2`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#F7F4E9]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#46969B] text-black flex flex-col h-screen">
        {/* Header Sidebar */}
        <div className="bg-black text-white font-bold text-center py-7">
          KERENTANAN BANJIR
        </div>

        {/* MENU */}
        <div className="p-6">
          <h3 className="font-bold mb-2">MENU</h3>
          {menuItems.map((item) =>
            renderButton(item.path, item.icon, item.label)
          )}

          <h3 className="font-bold mt-4 mb-2">KELOLA DATA</h3>
          {dataItems.map((item) =>
            renderButton(item.path, item.icon, item.label)
          )}
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
        {/* Header */}
        <header className="w-full bg-white text-black px-8 py-4 flex justify-between items-center shadow-md">
          <div></div>
          <div className="text-right">
            <h2 className="font-bold">Selamat Datang Admin!</h2>
            <p className="text-gray-600">admin2905@gmail.com</p>
          </div>
        </header>

        {/* Konten dinamis */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
