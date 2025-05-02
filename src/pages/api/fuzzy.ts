import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Ambil data dari Supabase
    const { data, error } = await supabase
      .from("data")
      .select(
        "id_data, tahun, kecamatan, kepadatan_penduduk, taman_drainase, history_banjir, curah_hujan"
      )
      .order("tahun", { ascending: true })
      .order("kecamatan", { ascending: true });;

    if (error || !data) {
      console.error("Error fetching data from Supabase:", error);
      return res
        .status(500)
        .json({ error: "Error fetching data from Supabase" });
    }

    // Kirim data ke backend FastAPI untuk diproses dengan Fuzzy Mamdani
    const fuzzyResults = await Promise.all(
      data.map(async (row) => {
        try {
          const response = await axios.post("http://localhost:8000/fuzzy", {
            curah_hujan: row.curah_hujan,
            history_banjir: row.history_banjir,
            kepadatan_penduduk: row.kepadatan_penduduk,
            taman_drainase: row.taman_drainase,
          });

          return {
            id_data: row.id_data,
            tahun: row.tahun,
            kecamatan: row.kecamatan,
            kepadatan_penduduk: row.kepadatan_penduduk,
            taman_drainase: row.taman_drainase,
            history_banjir: row.history_banjir,
            curah_hujan: row.curah_hujan,
            kategori: response.data.kategori,
            centroid: response.data.centroid,
            cluster: response.data.cluster,
          };
        } catch (error) {
          console.error("Error processing Fuzzy Mamdani:", error);
          return null;
        }
      })
    );

    // Hapus data null jika ada error
    const validResults = fuzzyResults.filter((item) => item !== null);

    // Simpan hasil ke Supabase
    const updatePromises = validResults.map((row) =>
      supabase
        .from("data")
        .update({
          kategori: row.kategori,
          centroid: row.centroid,
          cluster: row.cluster,
        })
        .eq("id_data", row.id_data)
    );

    await Promise.all(updatePromises);

    return res
      .status(200)
      .json({ message: "Data successfully updated", result: validResults });
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
