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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/fuzzy");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch data");
        }

        setData(result.result);
      } catch (error) {
        console.error("Error fetching defuzzifikasi data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const totalData = data.length;
  const totalPages = Math.ceil(totalData / perPage);
  const displayedData = data.slice(
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

        {/* Wrapper tabel dengan flex-grow agar tabel mengisi ruang kosong */}
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
                {displayedData.map((row, index) => (
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
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination tetap di bawah, tidak ikut tergulung */}
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
