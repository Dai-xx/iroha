import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      // Flaskエンドポイントへのリクエスト
      const response = await axios.get("http://localhost:5000/auth/profile", {
        withCredentials: true, // セッションを含める
        headers: {
          Cookie: req.headers.cookie || "", // クライアントから受け取ったCookieをFlaskに渡す
        },
      });

      // Flaskのレスポンスをそのまま返す
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
