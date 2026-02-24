// src/pages/defuzzifikasi.tsx
import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/components/AdminLayout";

interface FuzzyResult {
  id_data: number;
  tahun: number;
  kecamatan: string;
  mamdani: { crisp_value: number; kategori: string };
  sugeno: { crisp_value: number; kategori: string };
  tsukamoto: { crisp_value: number; kategori: string };
}

export default function DefuzzifikasiPage() {
  const [data, setData] = useState<FuzzyResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTahun, setSelectedTahun] = useState<number | null>(null);
  const [tahunList, setTahunList] = useState<number[]>([]);
  const [totalData, setTotalData] = useState(0);

  const formatAngka = (value: number) =>
    new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(value);

  const labelBg = (label: string) => {
    switch (label.toLowerCase()) {
      case "tinggi":
        return "bg-red-500 text-black";
      case "sedang":
        return "bg-yellow-400 text-black";
      case "rendah":
        return "bg-green-500 text-black";
      default:
        return "bg-gray-300 text-black";
    }
  };

  // ================= FETCH DATA DEFUZZIFIKASI =================
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: perPage.toString(),
      });
      if (selectedTahun !== null)
        params.append("tahun", selectedTahun.toString());

      const res = await fetch(`/api/defuzzifikasi?${params.toString()}`);
      const result = await res.json();

      setData(result.data || []);
      setTotalData(result.total || 0);
    } catch (err) {
      console.error("Fetch Defuzzifikasi Error:", err);
    }
    setLoading(false);
  }, [currentPage, perPage, selectedTahun]);

  // ================= EFFECT UTAMA =================
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      try {
        // 1️⃣ Panggil hitung fuzzy
        const res = await fetch("/api/hitung-fuzzy", {
          method: "POST",
        });

        if (!res.ok) {
          console.error("Hitung fuzzy gagal");
          setLoading(false);
          return;
        }

        // 2️⃣ Tunggu backend benar-benar selesai
        await res.json();

        // 3️⃣ Tambah delay kecil biar Supabase commit dulu
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 4️⃣ Baru fetch tabel
        await fetchData();
      } catch (err) {
        console.error("Init Defuzzifikasi Error:", err);
      }

      setLoading(false);
    };

    init();
  }, [currentPage, perPage, selectedTahun, fetchData]);
  // ================= FETCH LIST TAHUN =================
  useEffect(() => {
    const fetchTahun = async () => {
      try {
        const res = await fetch("/api/tahun");
        const tahun = await res.json();
        setTahunList(tahun);
      } catch (err) {
        console.error("Fetch Tahun Error:", err);
      }
    };
    fetchTahun();
  }, []);

  const totalPages = Math.ceil(totalData / perPage);

  return (
    <AdminLayout>
      <div className="h-[75vh] flex flex-col text-black">
        {/* Controls */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <div>
              <label className="mr-2 text-sm">Show</label>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border px-2 py-1 rounded text-sm"
              >
                {[10, 20, 30, 50].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mr-2 text-sm">Tahun</label>
              <select
                value={selectedTahun ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedTahun(val === "" ? null : Number(val));
                  setCurrentPage(1);
                }}
                className="border px-2 py-1 rounded text-sm"
              >
                <option value="">Semua Tahun</option>
                {tahunList.map((tahun) => (
                  <option key={tahun} value={tahun}>
                    {tahun}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-grow overflow-auto border rounded shadow-sm">
          {loading ? (
            <p className="p-4">Loading...</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead className="bg-[#0f2a44] text-white">
                <tr>
                  <th rowSpan={2} className="border px-3 py-2">
                    No
                  </th>
                  <th rowSpan={2} className="border px-3 py-2">
                    Tahun
                  </th>
                  <th rowSpan={2} className="border px-3 py-2">
                    Kecamatan
                  </th>
                  <th colSpan={2} className="border px-3 py-2">
                    Fuzzy Mamdani
                  </th>
                  <th colSpan={2} className="border px-3 py-2">
                    Fuzzy Sugeno
                  </th>
                  <th colSpan={2} className="border px-3 py-2">
                    Fuzzy Tsukamoto
                  </th>
                </tr>
                <tr className="bg-[#07263B]">
                  <th className="border px-3 py-2">Nilai Crisp</th>
                  <th className="border px-3 py-2">Label</th>
                  <th className="border px-3 py-2">Nilai Crisp</th>
                  <th className="border px-3 py-2">Label</th>
                  <th className="border px-3 py-2">Nilai Crisp</th>
                  <th className="border px-3 py-2">Label</th>
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <tr key={row.id_data} className="bg-white">
                      <td className="border px-3 py-2 text-center">
                        {(currentPage - 1) * perPage + index + 1}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {row.tahun}
                      </td>
                      <td className="border px-3 py-2">{row.kecamatan}</td>

                      <td className="border px-3 py-2 text-center">
                        {formatAngka(row.mamdani.crisp_value)}
                      </td>
                      <td
                        className={`border px-3 py-2 text-center font-semibold ${labelBg(row.mamdani.kategori)}`}
                      >
                        {row.mamdani.kategori}
                      </td>

                      <td className="border px-3 py-2 text-center">
                        {formatAngka(row.sugeno.crisp_value)}
                      </td>
                      <td
                        className={`border px-3 py-2 text-center font-semibold ${labelBg(row.sugeno.kategori)}`}
                      >
                        {row.sugeno.kategori}
                      </td>

                      <td className="border px-3 py-2 text-center">
                        {formatAngka(row.tsukamoto.crisp_value)}
                      </td>
                      <td
                        className={`border px-3 py-2 text-center font-semibold ${labelBg(row.tsukamoto.kategori)}`}
                      >
                        {row.tsukamoto.kategori}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-4 bg-white">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
            Showing {(currentPage - 1) * perPage + 1} to{" "}
            {Math.min(currentPage * perPage, totalData)} of {totalData} entries
          </span>
          <div className="flex items-center gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
