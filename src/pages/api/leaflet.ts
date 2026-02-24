import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { tahun, metode } = req.query;

  if (!tahun || !metode) {
    return res.status(400).json({ message: "tahun dan metode wajib diisi" });
  }

  try {
    // 1️⃣ Ambil data dasar dari tabel "data"
    const { data: dataRows, error: dataError } = await supabase
      .from("data")
      .select(
        `
        id_data,
        tahun,
        kepadatan_penduduk,
        curah_hujan,
        history_banjir,
        taman_drainase,
        kecamatan (
          id_kecamatan,
          nama
        )
      `,
      )
      .eq("tahun", tahun);

    if (dataError) {
      console.error("SUPABASE ERROR (data):", dataError);
      return res.status(500).json({ message: dataError.message });
    }

    if (!dataRows || dataRows.length === 0) {
      return res.status(200).json([]);
    }

    // 2️⃣ Ambil data metode dari tabel masing-masing
    const { data: methodRows, error: methodError } = await supabase
      .from(metode as string)
      .select("id_data, crisp_value, kategori");

    if (methodError) {
      console.error(`SUPABASE ERROR (${metode}):`, methodError);
      return res.status(500).json({ message: methodError.message });
    }

    // 3️⃣ Gabungkan data metode ke data utama berdasarkan id_data
    const result = dataRows.map((row: any) => {
      const kec = row.kecamatan?.nama ?? "-";
      const methodData = methodRows?.find(
        (m: any) => m.id_data === row.id_data,
      );

      return {
        kecamatan: kec,
        kategori: methodData?.kategori ?? null,
        crisp_value: methodData?.crisp_value ?? null,
        kepadatan: row.kepadatan_penduduk ?? 0,
        curah_hujan: row.curah_hujan ?? 0,
        history_banjir: row.history_banjir ?? 0,
        taman_drainase: row.taman_drainase ?? 0,
      };
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
