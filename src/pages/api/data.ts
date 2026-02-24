import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ✅ TYPE HASIL JOIN (OBJECT, BUKAN ARRAY)
type SupabaseRow = {
  id_data: number;
  tahun: number;
  kepadatan_penduduk: number;
  taman_drainase: number;
  history_banjir: number;
  curah_hujan: number;
  kecamatan: {
    nama: string;
  } | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { tahun, page = "1", limit = "10" } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
      .from("data")
      .select(
        `
        id_data,
        tahun,
        kepadatan_penduduk,
        taman_drainase,
        history_banjir,
        curah_hujan,
        kecamatan:id_kecamatan (nama)
      `,
        { count: "exact" },
      )
      .order("tahun", { ascending: false })
      .range(from, to);

    if (tahun) {
      query = query.eq("tahun", Number(tahun));
    }

    const { data, error, count } = await query;

    if (error) throw error;

const formattedData = ((data ?? []) as unknown as SupabaseRow[]).map((row) => ({
  id_data: row.id_data,
  tahun: row.tahun,
  kecamatan: row.kecamatan?.nama ?? "-",
  kepadatan_penduduk: row.kepadatan_penduduk,
  taman_drainase: row.taman_drainase,
  history_banjir: row.history_banjir,
  curah_hujan: row.curah_hujan,
}));


    return res.status(200).json({
      data: formattedData,
      total: count ?? 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
