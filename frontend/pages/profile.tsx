import useSWR from "swr";
import { useEffect } from "react";
import axios from "axios";

type User = {
  name: string;
  email: string;
};

// axiosのfetcher関数を作成
const fetcher = (url: string) =>
  axios
    .get(url, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      console.error("認証エラー", err);
      return null; // エラー時にはnullを返す
    });

const Profile = () => {
  const { data: user, error } = useSWR<User>(
    "http://localhost:5000/auth/user_info",
    fetcher,
  );

  if (error) {
    return <p>エラーが発生しました。</p>;
  }

  if (!user) {
    return <p>ユーザー情報を取得できませんでした。</p>;
  }

  return (
    <div>
      <h1>ようこそ、{user.name}さん</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
