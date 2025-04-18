import { useState, useEffect } from "react";
import UserLayout from "@/components/UserLayout";
import { useRouter } from "next/router";

const mapConfig = {
  2019: 102,
  2020: 103,
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
      {/* Tahun dan Dropdown dalam satu baris */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-lg font-medium">Tahun:</span>
        <select
          className="border p-2 rounded-md bg-white"
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

      {/* Peta langsung ditampilkan tanpa container tambahan */}
      {iframeUrl ? (
        <iframe
          src={iframeUrl}
          frameBorder={0}
          width="100%"
          height="600"
          allowTransparency
          className="w-full"
        />
      ) : (
        <p className="text-gray-500 text-center">Memuat peta...</p>
      )}

      {/* Kembali ke Landing Page */}
      <button
        onClick={() => router.push("/")}
        className="mt-6 text-gray-600 underline text-sm block text-center w-full"
      >
        Kembali ke Landing Page
      </button>
    </UserLayout>
  );
}
