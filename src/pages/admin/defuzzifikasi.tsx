import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

interface DataFuzzy {
  id_data: number;
  tahun: number;
  kecamatan: string;
  kepadatan_penduduk: number;
  taman_drainase: number;
  history_banjir: number;
  curah_hujan: number;
  centroid: number;
  kategori: string;
  cluster: number;
}

export default function DefuzzifikasiPage() {
  const [data, setData] = useState<DataFuzzy[]>([]);
  const [loading, setLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTahun, setSelectedTahun] = useState<number | null>(null); // default null, diubah otomatis

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/fuzzy");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch data");
        }

        // Pastikan result bertipe DataFuzzy[]
        if (Array.isArray(result.result)) {
          setData(result.result);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching defuzzifikasi data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Ambil semua tahun unik dari data
  const tahunList = Array.from(new Set(data.map((d) => d.tahun))).sort();

  // Set default selectedTahun jika belum ada
  useEffect(() => {
    if (tahunList.length > 0 && selectedTahun === null) {
      setSelectedTahun(tahunList[0]); // Set tahun pertama sebagai default jika null
    }
  }, [tahunList, selectedTahun]);

  const filteredData = data.filter((d) => d.tahun === selectedTahun);
  const totalData = filteredData.length;
  const totalPages = Math.ceil(totalData / perPage);
  const displayedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <AdminLayout>
      <div className="h-[75vh] flex flex-col">
        <h1 className="text-xl font-bold mb-4 text-black">
          Hasil Defuzzifikasi
        </h1>

        <div className="flex justify-between items-center mb-4 text-black">
          <div>
            <label className="mr-2">Tahun</label>
            <select
              value={selectedTahun || ""}
              onChange={(e) => {
                setSelectedTahun(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="border p-2 mr-4"
            >
              {tahunList.map((tahun) => (
                <option key={tahun} value={tahun}>
                  {tahun}
                </option>
              ))}
            </select>

            <label className="mr-2">Show</label>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border p-2"
            >
              {[10, 20, 30, 40, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-grow overflow-auto border border-gray-400">
          {loading ? (
            <p className="text-black">Loading...</p>
          ) : (
            <table className="table-auto w-full border-collapse border border-gray-400 text-black">
              <thead>
                <tr className="bg-gray-200 text-black">
                  {[
                    "No",
                    "Tahun",
                    "Kecamatan",
                    "Kepadatan Penduduk",
                    "Taman & Drainase",
                    "Sejarah Banjir",
                    "Curah Hujan",
                    "Centroid",
                    "Kategori",
                    "Cluster",
                  ].map((header, index) => (
                    <th key={index} className="border px-4 py-2 text-black">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedData.length > 0 ? (
                  displayedData.map((row, index) => (
                    <tr
                      key={row.id_data}
                      className="hover:bg-gray-100 text-black"
                    >
                      <td className="border px-4 py-2">
                        {(currentPage - 1) * perPage + index + 1}
                      </td>
                      <td className="border px-4 py-2">{row.tahun}</td>
                      <td className="border px-4 py-2">{row.kecamatan}</td>
                      <td className="border px-4 py-2">
                        {row.kepadatan_penduduk}
                      </td>
                      <td className="border px-4 py-2">{row.taman_drainase}</td>
                      <td className="border px-4 py-2">{row.history_banjir}</td>
                      <td className="border px-4 py-2">{row.curah_hujan}</td>
                      <td className="border px-4 py-2">{row.centroid}</td>
                      <td className="border px-4 py-2">{row.kategori}</td>
                      <td className="border px-4 py-2">{row.cluster}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center py-4">
                      No data available for the selected year.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-between items-center mt-4 text-black">
          <span>
            Showing {(currentPage - 1) * perPage + 1} to{" "}
            {Math.min(currentPage * perPage, totalData)} of {totalData} entries
          </span>
          <div className="flex items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
