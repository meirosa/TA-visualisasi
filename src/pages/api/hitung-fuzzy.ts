// src/pages/api/hitung-fuzzy.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    // 1️⃣ Ambil semua data yang belum diproses
    const { data: rows, error } = await supabase
      .from("data")
      .select("*")
      .is("is_processed", false); // pastikan tipe boolean benar

    if (error) throw error;
    if (!rows || rows.length === 0)
      return res.status(200).json({ message: "Tidak ada data baru" });

    // 2️⃣ Loop tiap row dan hitung fuzzy
    for (const row of rows) {
      // Kirim ke FastAPI
      const fuzzyRes = await fetch("http://localhost:8000/fuzzy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(row),
      });
      const result = await fuzzyRes.json();

      // Simpan ke masing-masing tabel model
      await supabase.from("mamdani").insert({
        id_data: row.id_data,
        crisp_value: result.mamdani.crisp,
        kategori: result.mamdani.kategori,
      });

      await supabase.from("sugeno").insert({
        id_data: row.id_data,
        crisp_value: result.sugeno.crisp,
        kategori: result.sugeno.kategori,
      });

      await supabase.from("tsukamoto").insert({
        id_data: row.id_data,
        crisp_value: result.tsukamoto.crisp,
        kategori: result.tsukamoto.kategori,
      });

      // Tandai data sudah diproses
      await supabase
        .from("data")
        .update({ is_processed: true })
        .eq("id_data", row.id_data);
    }

    res.status(200).json({ message: "Semua data baru berhasil dihitung" });
  } catch (err) {
    console.error("HITUNG FUZZY ERROR:", err);
    res.status(500).json({ error: "Gagal menghitung data baru" });
  }
}
