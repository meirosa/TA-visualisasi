import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { data, error } = await supabase.from("data").select("tahun");

  if (error) return res.status(500).json([]);

  res.status(200).json(data ?? []);
}
