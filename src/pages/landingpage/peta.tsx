"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import("@/components/MapLeafletClient"), {
  ssr: false,
});

interface TahunRow {
  tahun: number;
}

export default function PetaUserPage() {
  const [tahun, setTahun] = useState<number | null>(null);
  const [listTahun, setListTahun] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const [showFuzzy, setShowFuzzy] = useState(false);
  const [showDamkar, setShowDamkar] = useState(false);

  // =====================
  // FETCH TAHUN
  // =====================
  useEffect(() => {
    const fetchTahun = async () => {
      try {
        const res = await fetch("/api/leaflet-all");
        const json: TahunRow[] = await res.json();

        const unik = [...new Set(json.map((d) => d.tahun))].sort(
          (a, b) => b - a,
        );

        setListTahun(unik);
        if (unik.length > 0) setTahun(unik[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTahun();
  }, []);

  return (
    <section id="peta" className="py-10 bg-white">
      {/* ===================== */}
      {/* JUDUL */}
      {/* ===================== */}
      <h2 className="text-3xl font-bold text-center text-[#264653] mb-6">
        Pemetaan Kerentanan Banjir Kota Surabaya
      </h2>

      <div className="max-w-6xl mx-auto px-4">
        {/* ===================== */}
        {/* FILTER BAR (DI LUAR MAP) */}
        {/* ===================== */}
        <div className="mb-3 flex justify-start">
          <div className="bg-[#07263B] text-white px-4 py-3 rounded-lg shadow-md">
            <div className="flex items-center gap-4 text-sm">
              {/* TAHUN */}
              {loading ? (
                <span>Loading...</span>
              ) : (
                <select
                  value={tahun ?? ""}
                  onChange={(e) => setTahun(Number(e.target.value))}
                  className="px-2 py-1 rounded text-black text-sm"
                >
                  {listTahun.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}

              {/* CHECKBOX PETA */}
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showFuzzy}
                  onChange={(e) => setShowFuzzy(e.target.checked)}
                />
                Peta
              </label>

              {/* CHECKBOX DAMKAR */}
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={showDamkar}
                  onChange={(e) => setShowDamkar(e.target.checked)}
                />
                Damkar
              </label>
            </div>
          </div>
        </div>

        {/* ===================== */}
        {/* MAP (MURNI MAP) */}
        {/* ===================== */}
        <div className="border rounded-xl shadow-md overflow-hidden">
          <div className="h-[420px]">
            {tahun && (
              <MapLeaflet
                tahun={tahun}
                metode="mamdani"
                showFuzzy={showFuzzy}
                showDamkar={showDamkar}
                showBaseMap={!showFuzzy && !showDamkar}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
