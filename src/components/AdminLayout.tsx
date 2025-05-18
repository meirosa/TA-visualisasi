import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  Map,
  Database,
  Activity,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [showPetaSubmenu, setShowPetaSubmenu] = useState(false);

  const isActive = (path: string) => router.pathname === path;

  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="mr-2" size={20} />,
      label: "Dashboard",
    },
  ];

  const petaSubItems = [
    {
      path: "/admin/peta",
      label: "Peta Kerentanan",
    },
    {
      path: "/admin/damkar",
      label: "Peta Damkar",
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

  const renderButton = (
    path: string,
    icon: ReactNode,
    label: string,
    onClick?: () => void
  ) => (
    <button
      onClick={onClick || (() => router.push(path))}
      className={`flex items-center w-full px-4 py-2 border border-black text-black ${
        isActive(path) ? "bg-[#57B4BA]" : "bg-white hover:bg-gray-200"
      } transition rounded-md mt-2`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F7F4E9]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#46969B] text-black flex flex-col h-screen">
        {/* Header Sidebar */}
        <div className="bg-black text-white font-bold text-center py-7">
          KERENTANAN BANJIR
        </div>

        {/* MENU */}
        <div className="p-6 flex flex-col flex-grow overflow-auto">
          <h3 className="font-bold mb-2">MENU</h3>
          {menuItems.map((item) =>
            renderButton(item.path, item.icon, item.label)
          )}

          {/* Peta - dropdown menu */}
          <div className="mt-2">
            <button
              onClick={() => setShowPetaSubmenu(!showPetaSubmenu)}
              className="flex items-center w-full px-4 py-2 border border-black text-black bg-white hover:bg-gray-200 transition rounded-md"
            >
              <Map className="mr-2" size={20} />
              Peta
              {showPetaSubmenu ? (
                <ChevronUp className="ml-auto" size={18} />
              ) : (
                <ChevronDown className="ml-auto" size={18} />
              )}
            </button>

            {showPetaSubmenu && (
              <div className="ml-6 mt-2 space-y-2">
                {petaSubItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`block w-full text-left px-4 py-2 text-sm rounded-md ${
                      isActive(item.path)
                        ? "bg-[#57B4BA] text-white"
                        : "text-black hover:bg-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <h3 className="font-bold mt-4 mb-2">KELOLA DATA</h3>
          {dataItems.map((item) =>
            renderButton(item.path, item.icon, item.label)
          )}
        </div>

        {/* Logout tetap di bawah */}
        <div className="p-6">
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

        {/* Konten dinamis dengan scroll */}
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
