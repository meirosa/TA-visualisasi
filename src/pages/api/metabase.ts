import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// Ganti ke URL Metabase kamu (pastikan ini URL dari server Metabase, bukan Next.js)
const METABASE_SITE_URL = "http://localhost:3000"; // misalnya: http://localhost:3000 atau http://localhost:3001
const METABASE_SECRET_KEY =
  "b758d9973ab8a154c589b734543a262b925e1fc266974ad061d302c50bea31a2";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { dashboardId, questionId } = req.body;

    if (!dashboardId && !questionId) {
      return res
        .status(400)
        .json({ error: "dashboardId or questionId is required" });
    }

    const isDashboard = !!dashboardId;
    const id = isDashboard ? Number(dashboardId) : Number(questionId);

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID value" });
    }

    const payload = {
      resource: isDashboard ? { dashboard: id } : { question: id },
      params: {},
      exp: Math.round(Date.now() / 1000) + 60 * 60, // 1 jam
    };

    const token = jwt.sign(payload, METABASE_SECRET_KEY);

    const iframeUrl = `${METABASE_SITE_URL}/embed/${
      isDashboard ? "dashboard" : "question"
    }/${token}#bordered=true&titled=true`;

    return res.status(200).json({ iframeUrl });
  } catch (error) {
    console.error("Metabase API Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: String(error) });
  }
}
