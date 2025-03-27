import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";

const mapConfig = {
  2019: 57,
  2020: 58,
  2021: 59,
  2022: 60,
  2023: 61,
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
      <h2 className="text-2xl font-bold mb-4 text-black">
        Peta Kerentanan Banjir
      </h2>

      <label className="block mb-2 text-lg font-medium text-black">
        Tahun:
      </label>
      <select
        className="border p-2 rounded-md w-48 bg-white text-black"
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

      {/* Kontainer untuk Peta */}
      <div className="mt-6 max-h-[80vh] overflow-y-auto pr-2 border p-4 rounded-lg shadow-md bg-white">
        {iframeUrl && (
          <iframe
            src={iframeUrl}
            frameBorder={0}
            width="100%"
            height="460"
            allowTransparency
            className="border rounded-md shadow-md"
          />
        )}
      </div>
    </AdminLayout>
  );
}
