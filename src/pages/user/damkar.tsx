import { useState, useEffect } from "react";
import UserLayout from "@/components/UserLayout";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

const mapConfig = {
  damkar: 167, // questionId Metabase
} as const;

export default function PetaDamkarPage() {
  const [iframeUrl, setIframeUrl] = useState<string>("");
  const [damkarList, setDamkarList] = useState<
    { nama: string; telepon: string; alamat: string }[]
  >([]);
  const router = useRouter();

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
          console.error("Response not OK:", data);
        }
      } catch (error) {
        console.error("Failed to fetch iframe URL:", error);
      }
    };

    const fetchDamkarList = async () => {
      const { data, error } = await supabase
        .from("damkar")
        .select("nama, telepon, alamat");

      if (error) {
        console.error("Error fetching damkar list:", error);
      } else {
        setDamkarList(data || []);
      }
    };

    fetchIframeUrl();
    fetchDamkarList();
  }, []);

  const maxContentHeight = "80vh";

  return (
    <UserLayout>
      <div
        className="flex flex-col flex-1 px-4 pb-8"
        style={{ minBlockSize: "100vh", maxBlockSize: "100vh" }}
      >
        <div className="flex justify-end my-2">
          <button
            onClick={() => router.push("/")}
            className="text-[#1D1D1D] underline text-sm font-medium bg-[#F6F0F0] px-4 py-2 rounded-md hover:bg-[#E8E1E1]"
          >
            Kembali ke Landing Page
          </button>
        </div>

        <div
          className="flex gap-6 rounded-lg p-6 mb-8"
          style={{ backgroundColor: "#F6F0F0", blockSize: maxContentHeight }}
        >
          <div
            className="w-80 bg-white rounded-lg shadow-md flex flex-col"
            style={{ blockSize: "100%" }}
          >
            <h3 className="font-bold text-lg mb-2 p-4 flex-shrink-0">
              Daftar Damkar
            </h3>
            <ul
              className="space-y-3 text-gray-700 px-4 overflow-y-auto flex-1"
              style={{ blockSize: "calc(100% - 56px)" }}
            >
              {damkarList.length === 0 && (
                <li className="text-gray-400">Memuat daftar...</li>
              )}
              {damkarList.map((damkar, index) => (
                <li key={index} className="border-b pb-2">
                  <p className="font-semibold">{damkar.nama}</p>
                  <p className="text-sm">Telepon: {damkar.telepon}</p>
                  <p className="text-sm">Alamat: {damkar.alamat}</p>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="flex-1 rounded-lg overflow-hidden shadow-md"
            style={{ blockSize: "100%" }}
          >
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
              <p className="text-gray-500 text-center">Memuat peta...</p>
            )}
          </div>
        </div>

        <footer className="h-10" />
      </div>
    </UserLayout>
  );
}
