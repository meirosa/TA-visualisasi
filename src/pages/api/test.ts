import { NextApiRequest, NextApiResponse } from "next"; // Impor tipe untuk req dan res

export default async function handler(
  req: NextApiRequest, // Tipe untuk req
  res: NextApiResponse // Tipe untuk res
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Proses lainnya di sini...
  } catch (err) {
    console.error("Internal server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
