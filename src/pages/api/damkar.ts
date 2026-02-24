import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { data, error } = await supabase
    .from("damkar")
    .select("id_damkar, nama, alamat, telepon, latitude, longitude");

  if (error) {
    console.error(error);
    return res.status(500).json(error);
  }

  res.json(data);
}
