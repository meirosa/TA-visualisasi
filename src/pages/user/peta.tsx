import { useEffect, useState } from "react";
import UserLayout from "@/components/UserLayout";
import { useRouter } from "next/router";

const METABASE_DASHBOARD_ID = 101; // ID dashboard yang filter-nya sudah diset langsung di Metabase

export default function PetaUserPage() {
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchIframeUrl = async () => {
      try {
        const response = await fetch("/api/metabase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dashboardId: METABASE_DASHBOARD_ID }),
        });

        const data = await response.json();
        if (response.ok) {
          setIframeUrl(data.iframeUrl);
        }
      } catch (error) {
        console.error("Failed to fetch iframe URL:", error);
      }
    };

    fetchIframeUrl();
  }, []);

  return (
    <UserLayout>
      <div className="flex flex-col flex-1">
        {/* Tombol Kembali */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => router.push("/")}
            className="text-[#1D1D1D] underline text-sm font-medium bg-[#F6F0F0] px-4 py-2 rounded-md hover:bg-[#E8E1E1]"
          >
            Kembali ke Landing Page
          </button>
        </div>

        {/* Peta dan Legenda */}
        <div className="flex gap-6 items-start">
          {/* Peta */}
          <div className="flex-1 h-[420px]">
            {iframeUrl ? (
              <iframe
                src={iframeUrl}
                frameBorder={0}
                allowTransparency
                className="w-full h-full rounded-lg shadow-md"
              />
            ) : (
              <p className="text-gray-500 text-center">Memuat peta...</p>
            )}
          </div>

          {/* Legenda */}
          <div className="w-48 p-4 bg-white rounded-lg shadow-md text-gray-700">
            <h3 className="font-bold text-lg mb-3">Keterangan</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-3">
                <span className="inline-block w-4 h-4 rounded-full bg-blue-300" />
                <span className="text-gray-800">0 - Rendah</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-block w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-gray-800">1 - Sedang</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="inline-block w-4 h-4 rounded-full bg-blue-700" />
                <span className="text-gray-800">2 - Tinggi</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
