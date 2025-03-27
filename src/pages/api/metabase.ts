import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

const METABASE_SITE_URL = "http://localhost:3000"; // Ganti dengan URL Metabase
const METABASE_SECRET_KEY =
  "b758d9973ab8a154c589b734543a262b925e1fc266974ad061d302c50bea31a2"; // Ganti dengan secret key Metabase

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { questionId } = req.body;
    if (!questionId) {
      return res.status(400).json({ error: "questionId is required" });
    }

    const payload = {
      resource: { question: Number(questionId) },
      params: {},
      exp: Math.round(Date.now() / 1000) + 24 * 60 * 60, // Expire dalam 24 jam
    };

    const token = jwt.sign(payload, METABASE_SECRET_KEY);
    const iframeUrl = `${METABASE_SITE_URL}/embed/question/${token}#bordered=true&titled=true`;

    res.status(200).json({ iframeUrl });
  } catch (error) {
    console.error("Metabase API Error:", error); // Menampilkan error di console
    res
      .status(500)
      .json({ error: "Internal Server Error", details: String(error) }); // Mengirim respons dengan detail error
  }
}
