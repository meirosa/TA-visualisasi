import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { data, error } = await supabase
    .from("data")
    .select("tahun")
    .order("tahun", { ascending: false });

  if (error) {
    return res.status(500).json([]);
  }

  const tahunUnik = Array.from(new Set(data.map((d) => d.tahun)));

  res.status(200).json(tahunUnik);
}
