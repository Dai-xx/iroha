import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { data } = await axios.get("http://127.0.0.1:5000/auth/callback", {
        params: req.query, // Flaskのcallbackで必要なクエリパラメータを渡す
      });

      console.log("req.query", req.query);

      // 認証成功したユーザー情報をフロントエンドに返す
      res.status(200).json(data);
    } catch (error) {
      console.error("Error during Flask callback:", error);
      res.status(500).json({ error: "Failed to handle callback" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
