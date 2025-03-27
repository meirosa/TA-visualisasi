import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase";
import AdminLayout from "@/components/AdminLayout";
import AddDataModal from "@/components/AddDataModal";
import { Pencil, Trash, Search, Plus } from "lucide-react"; // Import ikon

interface DataPeta {
  id_data: number;
  tahun: number;
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
  const [searchQuery, setSearchQuery] = useState<string>(""); // For search functionality
  const [perPage, setPerPage] = useState<number>(10); // Default 10 data per page
  const [currentPage, setCurrentPage] = useState<number>(1); // Start from page 1
  const [totalData, setTotalData] = useState<number>(0); // Total data count

  const fetchData = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("data")
      .select(
        "id_data, tahun, kecamatan, kepadatan_penduduk, taman_drainase, history_banjir, curah_hujan"
      )
      .range((currentPage - 1) * perPage, currentPage * perPage - 1); // Paginate data

    if (searchQuery) {
      query = query.ilike("kecamatan", `%${searchQuery}%`); // Search by kecamatan
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setData(data);
      fetchTotalData(); // Fetch total data for pagination
    }
    setLoading(false);
  }, [searchQuery, perPage, currentPage]);

  const fetchTotalData = async () => {
    const { count, error } = await supabase
      .from("data")
      .select("*", { count: "exact" });
    if (error) {
      console.error("Error fetching total data count:", error);
    } else {
      setTotalData(count || 0); // Set the total count of data
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id_data: number) => {
    const confirmDelete = window.confirm(
      "Apakah Anda yakin ingin menghapus data ini?"
    );
    if (confirmDelete) {
      const { error } = await supabase
        .from("data")
        .delete()
        .eq("id_data", id_data);
      if (error) {
        console.error("Error deleting data:", error);
      } else {
        fetchData();
      }
    }
  };

  const handleEdit = (row: DataPeta) => {
    setEditData(row);
    setShowModal(true);
  };

  // Pagination logic
  const totalPages = Math.ceil(totalData / perPage); // Total pages

  return (
    <AdminLayout>
      <div className="flex mb-4 justify-between items-center space-x-4 text-black">
        <div className="flex items-center space-x-2 text-black">
          <label className="mr-2">Show</label>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border p-2"
          >
            {[10, 20, 30, 40, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 bg-white border border-gray-400 px-2 py-1 rounded text-black">
          <Search size={18} className="text-gray-500 text-black" />
          <input
            type="text"
            placeholder="Cari data kecamatan"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none outline-none w-50 text-black"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 text-black"
        >
          <Plus size={18} />
          <span>Add Data</span>
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto max-h-[calc(100vh-260px)] overflow-y-auto">
          <table className="table-auto w-full border-collapse border border-gray-400">
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
                  "Aksi",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-400 px-4 py-2 text-black"
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
                    row.kepadatan_penduduk,
                    row.taman_drainase,
                    row.history_banjir,
                    row.curah_hujan,
                  ].map((val, idx) => (
                    <td
                      key={idx}
                      className="border border-gray-400 px-4 py-2 text-black"
                    >
                      {val}
                    </td>
                  ))}
                  <td className="border border-gray-400 px-4 py-2 flex justify-center space-x-2">
                    <button
                      className="text-blue-500 hover:text-blue-700"
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

      <div className="flex justify-between items-center mt-4 text-black">
        <span>
          Showing {(currentPage - 1) * perPage + 1} to{" "}
          {Math.min(currentPage * perPage, totalData)} of {totalData} entries
        </span>
        <div className="flex items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
          >
            Previous
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
          >
            Next
          </button>
        </div>
      </div>

      {showModal && (
        <AddDataModal
          editData={editData}
          onClose={() => setShowModal(false)}
          onSuccess={fetchData}
        />
      )}
    </AdminLayout>
  );
}
