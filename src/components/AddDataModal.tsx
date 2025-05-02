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

  const debouncedKecamatan = useDebounce(form.kecamatan, 300);

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
      setForm(editData);
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
        const { error } = await supabase
          .from("data")
          .update(newData)
          .eq("id_data", editData.id_data);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("data").insert([newData]);
        if (error) throw error;
      }
      onSuccess();
      onClose();
      alert("Data berhasil disimpan!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Gagal menyimpan data!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">
          {editData ? "Edit Data" : "Tambah Data"}
        </h2>
        <div className="space-y-2">
          <label>Tahun:</label>
          <input
            name="tahun"
            type="number"
            value={form.tahun || ""}
            onChange={handleChange}
            className="border p-2 w-full placeholder:text-gray-500"
          />
          <label>Kecamatan:</label>
          <div className="relative">
            <input
              name="kecamatan"
              value={form.kecamatan}
              onChange={handleChange}
              className="border p-2 w-full placeholder:text-gray-500"
            />
            {showSuggestions && (
              <ul className="absolute left-0 right-0 bg-white border shadow-lg mt-1 max-h-40 overflow-y-auto z-10">
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
            value={form.kepadatan_penduduk || ""}
            onChange={handleChange}
            className="border p-2 w-full placeholder:text-gray-500"
          />
          <label>Taman & Drainase:</label>
          <input
            name="taman_drainase"
            type="number"
            value={form.taman_drainase || ""}
            onChange={handleChange}
            className="border p-2 w-full placeholder:text-gray-500"
          />
          <label>Sejarah Banjir:</label>
          <input
            name="history_banjir"
            type="number"
            value={form.history_banjir || ""}
            onChange={handleChange}
            className="border p-2 w-full placeholder:text-gray-500"
          />
          <label>Curah Hujan:</label>
          <input
            name="curah_hujan"
            type="number"
            value={form.curah_hujan || ""}
            onChange={handleChange}
            className="border p-2 w-full placeholder:text-gray-500"
          />
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
            onClick={handleSave}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
