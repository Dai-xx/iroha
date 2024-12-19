import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      // Flaskのログインエンドポイントを呼び出す
      const flaskLoginUrl = "http://localhost:5000/auth/login"; // FlaskのログインURL
      res.redirect(flaskLoginUrl);
    } catch (error) {
      console.error("Error connecting to Flask:", error);
      res.status(500).json({ error: "Failed to redirect to Flask login" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
