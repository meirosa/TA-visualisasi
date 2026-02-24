import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const { id_data, result } = req.body;

    await supabase.from("mamdani").insert({
      id_data,
      crisp_value: result.mamdani.crisp,
      kategori: result.mamdani.kategori,
    });

    await supabase.from("sugeno").insert({
      id_data,
      crisp_value: result.sugeno.crisp,
      kategori: result.sugeno.kategori,
    });

    await supabase.from("tsukamoto").insert({
      id_data,
      crisp_value: result.tsukamoto.crisp,
      kategori: result.tsukamoto.kategori,
    });

    await supabase
      .from("data")
      .update({ is_processed: true })
      .eq("id_data", id_data);

    return res.status(200).json({ message: "Berhasil disimpan" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Gagal simpan hasil" });
  }
}
