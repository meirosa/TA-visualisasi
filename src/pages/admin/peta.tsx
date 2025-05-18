import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

const mapConfig = {
  2019: 158,
  2020: 161,
  2021: 162,
  2022: 163,
  2023: 165,
} as const;

export default function PetaPage() {
  const [selectedYear, setSelectedYear] =
    useState<keyof typeof mapConfig>(2023);
  const [iframeUrl, setIframeUrl] = useState<string>("");

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
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-3 text-black">
        Peta Kerentanan Banjir
      </h2>

      {/* Dropdown Tahun sejajar */}
      <div className="flex items-center space-x-4 mb-4">
        <label className="text-lg font-medium text-black">Tahun:</label>
        <select
          className="border p-1 rounded-md bg-white text-black"
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(Number(e.target.value) as keyof typeof mapConfig)
          }
        >
          {Object.keys(mapConfig).map((year) => (
            <option key={year} value={year} className="text-black">
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Peta dan Legenda dalam 1 baris */}
      <div className="flex gap-6 items-start">
        {/* Tampilan Peta */}
        <div className="w-full h-[357px] overflow-hidden rounded-md shadow-md">
          {iframeUrl && (
            <iframe
              src={iframeUrl}
              frameBorder={0}
              className="w-full h-full"
              allowTransparency
              scrolling="no"
            />
          )}
        </div>

        {/* Legenda di sebelah kanan */}
        <div className="bg-white p-4 rounded-md shadow-sm text-black w-48">
          <h3 className="font-semibold mb-2">Kerentanan</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <span className="font-bold">0</span> = Rendah
            </li>
            <li>
              <span className="font-bold">1</span> = Sedang
            </li>
            <li>
              <span className="font-bold">2</span> = Tinggi
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
