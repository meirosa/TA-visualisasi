import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

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

    // 1️⃣ Ambil data utama
    let dataQuery = supabase
      .from("data")
      .select(
        `
        id_data,
        tahun,
        kecamatan:id_kecamatan (nama)
        `,
        { count: "exact" },
      )
      .order("tahun", { ascending: false })
      .range(from, to);

    if (tahun) {
      dataQuery = dataQuery.eq("tahun", Number(tahun));
    }

    const { data: dataRows, error: dataError, count } = await dataQuery;
    if (dataError) throw dataError;

    const idList = (dataRows ?? []).map((d) => d.id_data);

    // 2️⃣ Ambil hasil fuzzy terpisah
    const { data: mamdaniRows } = await supabase
      .from("mamdani")
      .select("id_data, crisp_value, kategori")
      .in("id_data", idList);

    const { data: sugenoRows } = await supabase
      .from("sugeno")
      .select("id_data, crisp_value, kategori")
      .in("id_data", idList);

    const { data: tsukamotoRows } = await supabase
      .from("tsukamoto")
      .select("id_data, crisp_value, kategori")
      .in("id_data", idList);

    // 3️⃣ Gabungkan manual
const formatted = (dataRows ?? []).map((row) => {
  const mam = mamdaniRows?.find((m) => m.id_data === row.id_data);
  const sug = sugenoRows?.find((s) => s.id_data === row.id_data);
  const tsu = tsukamotoRows?.find((t) => t.id_data === row.id_data);

  return {
    id_data: row.id_data,
    tahun: row.tahun,
    kecamatan: row.kecamatan?.nama ?? "-",
    mamdani: mam ?? { crisp_value: 0, kategori: "-" },
    sugeno: sug ?? { crisp_value: 0, kategori: "-" },
    tsukamoto: tsu ?? { crisp_value: 0, kategori: "-" },
  };
});

    return res.status(200).json({
      data: formatted,
      total: count ?? 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    console.error("DEFUZZ ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
