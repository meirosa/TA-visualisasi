"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import AdminLayout from "@/components/AdminLayout";
import AddDataModal from "@/components/AddDataModal";
import { Pencil, Trash, Plus } from "lucide-react";

interface DataPeta {
  id_data: number;
  tahun: number;
  id_kecamatan: number;
  kecamatan: string;
  kepadatan_penduduk: number;
  taman_drainase: number;
  history_banjir: number;
  curah_hujan: number;
}

export default function DataPage() {
  const [data, setData] = useState<DataPeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<DataPeta | null>(null);
  const [perPage, setPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);

  const formatAngka = (value: number) =>
    new Intl.NumberFormat("id-ID").format(value);

  // Ambil semua tahun yang tersedia
  const fetchAvailableYears = useCallback(async () => {
    const { data, error } = await supabase
      .from("data")
      .select("tahun")
      .order("tahun", { ascending: false });
    if (error) return console.error("Error fetching years:", error);

    const tahunSet = new Set<string>();
    data?.forEach((item: { tahun: number }) =>
      tahunSet.add(item.tahun.toString()),
    );
    const tahunArray = Array.from(tahunSet);
    setAvailableYears(tahunArray);

    if (!selectedYear && tahunArray.length > 0) setSelectedYear(tahunArray[0]);
  }, [selectedYear]);

  // Ambil data dari API
const fetchData = useCallback(async () => {
  if (!selectedYear) return;
  setLoading(true);

  try {
    const res = await fetch(
      `/api/data?tahun=${selectedYear}&page=${currentPage}&limit=${perPage}`,
    );
    const json = await res.json();

    if (res.ok) {
      setData(json.data);
      setTotalData(json.total);
    } else {
      setData([]);
      setTotalData(0);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    setData([]);
    setTotalData(0);
  } finally {
    setLoading(false);
  }
}, [selectedYear, currentPage, perPage]);


  useEffect(() => {
    fetchAvailableYears();
  }, [fetchAvailableYears]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id_data: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    const { error } = await supabase
      .from("data")
      .delete()
      .eq("id_data", id_data);
    if (error) console.error("Error deleting data:", error);
    else fetchData();
  };

  const handleEdit = (row: DataPeta) => {
    setEditData(row);
    setShowModal(true);
  };

  const handleAddSuccess = () => {
    fetchData();
    fetchAvailableYears();
  };

  const totalPages = Math.ceil(totalData / perPage);

  return (
    <AdminLayout>
      {/* FILTER & ADD */}
      <div className="flex mb-4 justify-between items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-black">Tampilkan</label>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border p-2 text-black"
          >
            {[10, 20, 30, 40, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <label className="text-black ml-4">Tahun</label>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 text-black"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 rounded text-white"
          style={{ backgroundColor: "#07263B" }}
        >
          <Plus size={18} />
          <span>Tambah Data</span>
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-black">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-black">Tidak ada data untuk tahun ini.</p>
      ) : (
        <div className="overflow-x-auto max-h-[calc(100vh-260px)] overflow-y-auto">
          <table className="table-auto w-full border-collapse border border-gray-400 bg-white">
            <thead>
              <tr className="text-white" style={{ backgroundColor: "#07263B" }}>
                {[
                  "No.",
                  "Tahun",
                  "Kecamatan",
                  "Kepadatan Penduduk",
                  "Taman & Drainase",
                  "History Banjir",
                  "Curah Hujan",
                  "Aksi",
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className="border px-4 py-2 text-center align-middle"
                    style={{ borderColor: "#FEFEFE" }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.id_data} className="hover:bg-gray-100">
                  {[
                    index + 1 + (currentPage - 1) * perPage,
                    row.tahun,
                    row.kecamatan,
                    formatAngka(row.kepadatan_penduduk),
                    formatAngka(row.taman_drainase),
                    formatAngka(row.history_banjir),
                    formatAngka(row.curah_hujan),
                  ].map((val, idx) => (
                    <td
                      key={idx}
                      className="border px-4 py-2 text-black text-center align-middle bg-white"
                    >
                      {val}
                    </td>
                  ))}
                  <td className="border px-4 py-2 flex justify-center space-x-2">
                    <button
                      className="text-blue-700 hover:text-blue-900"
                      onClick={() => handleEdit(row)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(row.id_data)}
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4 text-black">
        <span>
          Menampilkan {(currentPage - 1) * perPage + 1} sampai{" "}
          {Math.min(currentPage * perPage, totalData)} dari {totalData} data
        </span>
        <div className="flex items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Sebelumnya
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
          >
            Berikutnya
          </button>
        </div>
      </div>

      {/* MODAL ADD/EDIT */}
      {showModal && (
        <AddDataModal
          editData={editData}
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
          onSuccess={handleAddSuccess}
        />
      )}
    </AdminLayout>
  );
}
