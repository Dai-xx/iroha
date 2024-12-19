import Image from "next/image";
import { BiLogIn } from "react-icons/bi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";

type User = {
  email: string;
  name: string;
  picture: string;
  uid: string;
};

const fetcher = (url: string) =>
  axios
    .get(url, { withCredentials: true })
    .then((res) => res.data)
    .catch((err) => {
      console.error("認証エラー", err);
      return null; // エラー時にはnullを返す
    });

const Header = () => {
  const { setTheme, theme } = useTheme();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // 現在のテーマに基づいてトグル状態を設定
    setIsChecked(theme === "light");
  }, [theme]);

  const handleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    }
  };

  const router = useRouter();

  const handleLogin = () => {
    // Next.jsのAPI経由でFlaskのログインを開始
    router.push("/api/login");
  };

  const { data: user, error } = useSWR<User>(
    "http://localhost:5000/auth/user_info",
    fetcher,
  );

  if (error) return <p>Error loading profile.</p>;
  // if (!user) return <p>Loading...</p>;

  console.log("user", user);

  return (
    <>
      <header className="h-24 py-5">
        <div className="flex w-full justify-between">
          <label className="flex cursor-pointer gap-2">
            <span className="label-text">Current</span>
            <input
              type="checkbox"
              onChange={handleTheme}
              checked={isChecked}
              className="theme-controller toggle"
            />
            <span className="label-text">Light</span>
          </label>
          {user ? (
            <div>
              <p></p>
              <div className="avatar">
                <div className="mask mask-hexagon w-16">
                  <Image src={user.picture} alt="user icon" fill />
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="btn bg-accent text-accent-content"
            >
              Login
              <BiLogIn size={20} />
            </button>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
