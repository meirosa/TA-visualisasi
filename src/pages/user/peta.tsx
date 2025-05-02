import { useState, useEffect } from "react";
import UserLayout from "@/components/UserLayout"; // Pastikan import benar
import { useRouter } from "next/router";

const mapConfig = {
  2019: 158,
  2020: 159,
  2021: 104,
  2022: 100,
  2023: 101,
} as const;

export default function PetaUserPage() {
  const [selectedYear, setSelectedYear] =
    useState<keyof typeof mapConfig>(2023);
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchIframeUrl = async (year: keyof typeof mapConfig) => {
      try {
        const response = await fetch("/api/metabase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId: mapConfig[year] }),
        });
        const data = await response.json();
        if (response.ok) {
          setIframeUrl(data.iframeUrl);
        }
      } catch (error) {
        console.error("Failed to fetch iframe URL:", error);
      }
    };

    fetchIframeUrl(selectedYear);
  }, [selectedYear]);

  return (
    <UserLayout>
      <div className="flex flex-col flex-1">
        {/* Tombol Kembali di kanan atas */}
        <div className="flex justify-end mb-1">
          <button
            onClick={() => router.push("/")}
            className="text-[#1D1D1D] underline text-sm font-medium bg-[#F6F0F0] px-4 py-2 rounded-md hover:bg-[#E8E1E1]"
          >
            Kembali ke Landing Page
          </button>
        </div>

        {/* Dropdown Tahun */}
        <div className="flex items-center gap-4 mb-4 bg-[#F6F0F0] p-4 rounded-md">
          <span className="text-lg font-semibold text-[#1D1D1D]">Tahun:</span>
          <select
            className="border p-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F6F0F0]"
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(Number(e.target.value) as keyof typeof mapConfig)
            }
          >
            {Object.keys(mapConfig).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Peta dan Legenda */}
        <div className="flex gap-6 items-start mb-auto">
          {/* Peta */}
          <div className="flex-1">
            {iframeUrl ? (
              <iframe
                src={iframeUrl}
                frameBorder={0}
                width="100%" // Lebar 100% untuk penuh
                height="400vh" // Menyesuaikan tinggi sesuai layar
                allowTransparency
                className="w-full rounded-lg shadow-md"
              />
            ) : (
              <p className="text-gray-500 text-center">Memuat peta...</p>
            )}
          </div>

          {/* Kotak Legenda */}
          <div className="w-48 p-4 bg-white rounded-lg shadow-md text-gray-700">
            <h3 className="font-bold text-lg mb-2">Keterangan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-bold">0</span> - Rendah
              </li>
              <li>
                <span className="font-bold">1</span> - Sedang
              </li>
              <li>
                <span className="font-bold">2</span> - Tinggi
              </li>
            </ul>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
