import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

const mapConfig = {
  damkar: 167, // questionId Metabase
} as const;

export default function PetaDamkarPage() {
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [damkarList, setDamkarList] = useState<
    { nama: string; telepon: string; alamat: string }[]
  >([]);

  useEffect(() => {
    const fetchIframeUrl = async () => {
      try {
        const response = await fetch("/api/metabase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ questionId: mapConfig.damkar }),
        });
        const data = await response.json();
        if (response.ok) {
          setIframeUrl(data.iframeUrl);
        } else {
          console.error("Gagal mendapatkan iframe:", data);
        }
      } catch (error) {
        console.error("Gagal mengambil iframe URL:", error);
      }
    };

    const fetchDamkarList = async () => {
      const { data, error } = await supabase
        .from("damkar")
        .select("nama, telepon, alamat");

      if (error) {
        console.error("Gagal mengambil daftar damkar:", error);
      } else {
        setDamkarList(data || []);
      }
    };

    fetchIframeUrl();
    fetchDamkarList();
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col flex-1 px-6 pb-8">
        <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Daftar Damkar */}
          <div className="w-72 bg-white rounded-lg shadow-none flex flex-col h-full">
            <h3 className="text-black font-bold text-xl p-4 border-b">
              Daftar Damkar
            </h3>
            <ul className="space-y-5 text-gray-900 px-6 py-4 overflow-y-auto flex-1">
              {damkarList.length === 0 && (
                <li className="text-gray-400">Memuat daftar...</li>
              )}
              {damkarList.map((damkar, index) => (
                <li key={index} className="border-b pb-4">
                  <p className="font-semibold text-lg">{damkar.nama}</p>
                  <p className="text-base">Telepon: {damkar.telepon}</p>
                  <p className="text-base">Alamat: {damkar.alamat}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Iframe Peta */}
          <div className="flex-1 rounded-lg overflow-hidden shadow-md h-full">
            {iframeUrl ? (
              <iframe
                src={iframeUrl}
                frameBorder={0}
                width="100%"
                height="100%"
                allowTransparency
                className="w-full h-full rounded-lg"
                title="Peta Damkar Surabaya"
              />
            ) : (
              <p className="text-gray-500 text-center mt-10">Memuat peta...</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
