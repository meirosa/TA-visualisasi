import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import Papa, { ParseResult } from "papaparse";

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

interface CsvError {
  row: number;
  reason: string;
}

// Hook debounce untuk mengurangi request/filter kecamatan saat mengetik
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
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
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvErrors, setCsvErrors] = useState<CsvError[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedKecamatan = useDebounce(form.kecamatan, 300);

  // Fetch kecamatan list
  useEffect(() => {
    const fetchKecamatan = async () => {
      const { data, error } = await supabase.from("kecamatan").select("nama");
      if (!error && data) {
        setKecamatanList(data.map((item) => item.nama));
      } else {
        console.error("Gagal fetch kecamatan:", error);
      }
    };
    fetchKecamatan();
  }, []);

  // Prefill if editing
  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  // Autocomplete filter
  useEffect(() => {
    if (debouncedKecamatan) {
      const suggestions = kecamatanList.filter((k) =>
        k.toLowerCase().includes(debouncedKecamatan.toLowerCase())
      );
      setFilteredKecamatan(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedKecamatan, kecamatanList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "kecamatan" ? value : Number(value),
    });
  };

  const handleSelectKecamatan = (nama: string) => {
    setForm({ ...form, kecamatan: nama });
    setShowSuggestions(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editData?.id_data) {
        const { error } = await supabase
          .from("data")
          .update(form)
          .eq("id_data", editData.id_data);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("data").insert([form]);
        if (error) throw error;
      }
      alert("Data berhasil disimpan!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    if (!csvFile) {
      alert("Silakan pilih file CSV terlebih dahulu.");
      return;
    }
    setLoading(true);
    setCsvErrors([]);

    Papa.parse<Record<string, string>>(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: ParseResult<Record<string, string>>) => {
        const errors: CsvError[] = [];
        const validRows: DataPeta[] = [];

        results.data.forEach((row, idx) => {
          const parsed: DataPeta = {
            tahun: Number(row.tahun),
            kecamatan: row.kecamatan,
            kepadatan_penduduk: Number(row.kepadatan_penduduk),
            taman_drainase: Number(row.taman_drainase),
            history_banjir: Number(row.history_banjir),
            curah_hujan: Number(row.curah_hujan),
          };
          const isValid =
            parsed.kecamatan &&
            !isNaN(parsed.tahun) &&
            !isNaN(parsed.kepadatan_penduduk) &&
            !isNaN(parsed.taman_drainase) &&
            !isNaN(parsed.history_banjir) &&
            !isNaN(parsed.curah_hujan);

          if (!isValid) {
            errors.push({ row: idx + 2, reason: "Format tidak valid" });
          } else {
            validRows.push(parsed);
          }
        });

        setCsvErrors(errors);

        if (validRows.length > 0) {
          const { error } = await supabase.from("data").insert(validRows);
          if (error) {
            console.error(error);
            alert("Error saat upload batch");
          } else {
            alert(`Upload berhasil: ${validRows.length} baris`);
            onSuccess();
            onClose();
          }
        } else {
          if (errors.length > 0) {
            alert("CSV berisi data yang tidak valid.");
          } else {
            alert("CSV kosong atau tidak ada data valid.");
          }
        }
        setLoading(false);
      },
      error: (err) => {
        console.error(err);
        alert("Gagal parsing CSV");
        setLoading(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {editData ? "Edit Data" : "Tambah Data"}
        </h2>

        <div className="mb-4 flex space-x-4">
          <label className="cursor-pointer">
            <input
              type="radio"
              checked={mode === "manual"}
              onChange={() => setMode("manual")}
              className="mr-1"
              disabled={loading}
            />
            Manual Entry
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              checked={mode === "csv"}
              onChange={() => setMode("csv")}
              className="mr-1"
              disabled={loading}
            />
            Upload CSV
          </label>
        </div>

        {mode === "manual" ? (
          <div className="space-y-4">
            {/* Tahun */}
            <div>
              <label className="block font-semibold">Tahun:</label>
              <input
                name="tahun"
                type="number"
                value={form.tahun}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                min={0}
                disabled={loading}
              />
            </div>
            {/* Kecamatan */}
            <div>
              <label className="block font-semibold">Kecamatan:</label>
              <div className="relative">
                <input
                  name="kecamatan"
                  value={form.kecamatan}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                  autoComplete="off"
                  disabled={loading}
                />
                {showSuggestions && (
                  <ul className="absolute left-0 right-0 bg-white border shadow-lg mt-1 max-h-40 overflow-y-auto z-20 rounded">
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
            </div>
            {/* Angka lainnya */}
            {[
              "kepadatan_penduduk",
              "taman_drainase",
              "history_banjir",
              "curah_hujan",
            ].map((field) => (
              <div key={field}>
                <label className="block font-semibold">
                  {field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                  :
                </label>
                <input
                  name={field}
                  type="number"
                  value={form[field as keyof DataPeta] as number}
                  onChange={handleChange}
                  className="border p-2 w-full rounded"
                  min={0}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <label className="block font-semibold">Pilih file CSV:</label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] ?? null)}
              disabled={loading}
            />
            {csvErrors.length > 0 && (
              <div className="max-h-32 overflow-y-auto border p-2 rounded bg-red-50 text-red-600">
                <b>Kesalahan pada file CSV:</b>
                <ul className="list-disc list-inside">
                  {csvErrors.map((err, i) => (
                    <li key={i}>
                      Baris {err.row}: {err.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tombol aksi sejajar */}
        <div className="mt-6 flex justify-end space-x-3">
          {mode === "csv" && (
            <button
              onClick={handleUpload}
              disabled={loading || !csvFile}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              type="button"
            >
              {loading ? "Mengunggah..." : "Unggah CSV"}
            </button>
          )}
          {mode === "manual" && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              type="button"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          )}
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            type="button"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
