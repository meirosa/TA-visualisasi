import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface DataPeta {
  id_data?: number;
  tahun: number;
  kecamatan: string;
  kepadatan_penduduk: number;
  taman_drainase: number;
  history_banjir: number;
  curah_hujan: number;
}

interface AddDataProps {
  editData?: DataPeta | null;
  onClose: () => void;
  onSuccess: () => void;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function AddDataModal({
  editData,
  onClose,
  onSuccess,
}: AddDataProps) {
  const [form, setForm] = useState<DataPeta>({
    tahun: 0,
    kecamatan: "",
    kepadatan_penduduk: 0,
    taman_drainase: 0,
    history_banjir: 0,
    curah_hujan: 0,
  });

  const [kecamatanList, setKecamatanList] = useState<string[]>([]);
  const [filteredKecamatan, setFilteredKecamatan] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // State for debounced input
  const debouncedKecamatan = useDebounce(form.kecamatan, 300);

  // Fetch kecamatan from Supabase
  useEffect(() => {
    const fetchKecamatan = async () => {
      const { data, error } = await supabase.from("kecamatan").select("nama");
      if (error) {
        console.error("Error fetching kecamatan:", error);
      } else {
        setKecamatanList(data.map((item) => item.nama));
      }
    };
    fetchKecamatan();
  }, []);

  useEffect(() => {
    if (editData) {
      setForm(editData); // Populate form with edit data if any
    }
  }, [editData]);

  useEffect(() => {
    if (debouncedKecamatan) {
      const suggestions = kecamatanList.filter((item) =>
        item.toLowerCase().includes(debouncedKecamatan.toLowerCase())
      );
      setFilteredKecamatan(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setFilteredKecamatan([]);
      setShowSuggestions(false);
    }
  }, [debouncedKecamatan, kecamatanList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "kecamatan" ? value : Number(value) });
  };

  const handleSelectKecamatan = (nama: string) => {
    setForm({ ...form, kecamatan: nama });
    setShowSuggestions(false);
  };

  const handleSave = async () => {
    const newData = { ...form };

    try {
      if (editData) {
        // Update existing data
        const { error } = await supabase
          .from("data")
          .update(newData)
          .eq("id_data", editData.id_data);
        if (error) throw error;
      } else {
        // Insert new data
        const { error } = await supabase.from("data").insert([newData]);
        if (error) throw error;
      }

      onSuccess();
      onClose();
      alert("Data berhasil disimpan!"); // Show success notification
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Gagal menyimpan data!"); // Show error notification
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">
          {editData ? "Edit Data" : "Tambah Data"}
        </h2>
        <div className="space-y-2">
          <label>Tahun:</label>
          <input
            name="tahun"
            type="number"
            value={form.tahun || ""} // Prevent 0 as default value
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <label>Kecamatan:</label>
          <div className="relative">
            <input
              name="kecamatan"
              value={form.kecamatan}
              onChange={handleChange}
              className="border p-2 w-full"
            />
            {showSuggestions && (
              <ul className="absolute left-0 right-0 bg-white border shadow-lg mt-1 max-h-40 overflow-y-auto">
                {filteredKecamatan.map((nama) => (
                  <li
                    key={nama}
                    onClick={() => handleSelectKecamatan(nama)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {nama}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <label>Kepadatan Penduduk:</label>
          <input
            name="kepadatan_penduduk"
            type="number"
            value={form.kepadatan_penduduk || ""} // Prevent 0 as default value
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <label>Taman & Drainase:</label>
          <input
            name="taman_drainase"
            type="number"
            value={form.taman_drainase || ""} // Prevent 0 as default value
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <label>Sejarah Banjir:</label>
          <input
            name="history_banjir"
            type="number"
            value={form.history_banjir || ""} // Prevent 0 as default value
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <label>Curah Hujan:</label>
          <input
            name="curah_hujan"
            type="number"
            value={form.curah_hujan || ""} // Prevent 0 as default value
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2"
            onClick={handleSave}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
