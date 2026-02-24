import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import Papa, { ParseResult } from "papaparse";

interface Kecamatan {
  id_kecamatan: number;
  nama: string;
}

interface DataPeta {
  id_data?: number;
  tahun: number;
  id_kecamatan: number;
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

export default function AddDataModal({
  editData,
  onClose,
  onSuccess,
}: AddDataProps) {
  const [form, setForm] = useState<DataPeta>({
    tahun: undefined as unknown as number,
    id_kecamatan: undefined as unknown as number,
    kepadatan_penduduk: undefined as unknown as number,
    taman_drainase: undefined as unknown as number,
    history_banjir: undefined as unknown as number,
    curah_hujan: undefined as unknown as number,
  });

  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvErrors, setCsvErrors] = useState<CsvError[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch kecamatan list
  useEffect(() => {
    const fetchKecamatan = async () => {
      const { data, error } = await supabase.from("kecamatan").select("*");
      if (!error && data) setKecamatanList(data);
      else console.error("Gagal fetch kecamatan:", error);
    };
    fetchKecamatan();
  }, []);

  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "id_kecamatan"
          ? value
            ? Number(value)
            : undefined
          : Number(value),
    });
  };

  // ================================
  // 🔹 Manual Entry
  // ================================
  const handleSave = async () => {
    if (!editData && !form.id_kecamatan) {
      alert("Silakan pilih kecamatan");
      return;
    }

    setLoading(true);
    try {
      const { id_data, id_kecamatan, ...rest } = form;

      // Bersihkan data
      const cleanedData: Record<string, number> = {};
      Object.entries(rest).forEach(([key, value]) => {
        if (typeof value === "number" && !isNaN(value))
          cleanedData[key] = value;
      });

      let insertError;
      let newId: number | undefined;

      if (editData && id_data) {
        ({ error: insertError } = await supabase
          .from("data")
          .update(cleanedData)
          .eq("id_data", id_data));
        newId = id_data;
      } else {
        // Tambah data baru → ambil id_data hasil insert
        const { data: inserted, error } = await supabase
          .from("data")
          .insert([{ ...cleanedData, id_kecamatan }])
          .select()
          .single();
        insertError = error;
        newId = inserted?.id_data;
      }

      if (insertError || !newId)
        throw insertError || new Error("Gagal insert data");

      // ❌ HAPUS pemanggilan hitung fuzzy otomatis
      // await fetch("/api/hitung-fuzzy", { method: "POST" });

      alert("Data berhasil disimpan!"); // tanpa hitung fuzzy
      onSuccess();
      onClose();
    } catch (err) {
      console.error("ERROR SIMPAN:", err);
      alert("Gagal menyimpan data!");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // 🔹 CSV Upload
  // ================================
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
          const kecamatan = kecamatanList.find(
            (k) => k.nama.toLowerCase() === (row.kecamatan ?? "").toLowerCase(),
          );

          const parsed: DataPeta = {
            tahun: Number(row.tahun),
            id_kecamatan: kecamatan?.id_kecamatan ?? 0,
            kepadatan_penduduk: Number(row.kepadatan_penduduk),
            taman_drainase: Number(row.taman_drainase),
            history_banjir: Number(row.history_banjir),
            curah_hujan: Number(row.curah_hujan),
          };

          const isValid =
            parsed.id_kecamatan &&
            !isNaN(parsed.tahun) &&
            !isNaN(parsed.kepadatan_penduduk) &&
            !isNaN(parsed.taman_drainase) &&
            !isNaN(parsed.history_banjir) &&
            !isNaN(parsed.curah_hujan);

          if (!isValid) {
            errors.push({
              row: idx + 2,
              reason: "Format tidak valid / kecamatan tidak ditemukan",
            });
          } else validRows.push(parsed);
        });

        setCsvErrors(errors);

        if (validRows.length > 0) {
          // Insert batch + ambil semua id_data baru
          const { data: insertedRows, error } = await supabase
            .from("data")
            .insert(validRows)
            .select("id_data")
            .returns<{ id_data: number }[]>();

          if (error) {
            console.error(error);
            alert("Error saat upload batch");
          } else {
            // ❌ HAPUS pemanggilan hitung fuzzy otomatis
            // const idList = insertedRows.map((r) => r.id_data);
            // await fetch("/api/hitung-fuzzy", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ id_data_list: idList }),
            // });

            alert(
              `Upload berhasil: ${validRows.length} baris!`, // tanpa hitung fuzzy
            );
            onSuccess();
            onClose();
          }
        } else {
          alert(
            errors.length > 0
              ? "CSV berisi data yang tidak valid."
              : "CSV kosong atau tidak ada data valid.",
          );
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

  // ================================
  // Render Form
  // ================================
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {editData ? "Edit Data" : "Tambah Data"}
        </h2>

        {/* Mode toggle */}
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
            <div>
              <label className="block font-semibold">Tahun:</label>
              <input
                name="tahun"
                type="number"
                value={form.tahun ?? ""}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                min={0}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block font-semibold">Kecamatan:</label>
              <select
                name="id_kecamatan"
                value={form.id_kecamatan ?? ""}
                onChange={handleChange}
                className="border p-2 w-full rounded bg-gray-100"
                disabled={!!editData || loading}
              >
                {!editData && (
                  <option value="" disabled>
                    Pilih Kecamatan
                  </option>
                )}
                {kecamatanList.map((k) => (
                  <option key={k.id_kecamatan} value={k.id_kecamatan}>
                    {k.nama}
                  </option>
                ))}
              </select>
              {editData && (
                <p className="text-xs text-gray-500 mt-1">
                  Kecamatan tidak dapat diubah saat edit data
                </p>
              )}
            </div>

            {/* Input angka lainnya */}
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
                  value={form[field as keyof DataPeta] ?? ""}
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

        {/* Tombol aksi */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Batal
          </button>
          {mode === "manual" ? (
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-[#07263B] text-white px-4 py-2 rounded hover:bg-[#061f2f]"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          ) : (
            <button
              onClick={handleUpload}
              disabled={loading || !csvFile}
              className="bg-[#07263B] text-white px-4 py-2 rounded hover:bg-[#061f2f]"
            >
              {loading ? "Mengunggah..." : "Unggah CSV"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
