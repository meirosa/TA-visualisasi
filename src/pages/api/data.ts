import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("📡 Fetching data from Supabase...");

    // Ambil data dari tabel "data"
    const { data, error } = await supabase.from("data").select("*");

    // Cek apakah ada error dari Supabase
    if (error) {
      console.error("❌ Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("✅ Data retrieved:", data);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: (error as Error).message });
  }
}
