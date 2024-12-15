import Image from "next/image";
import { BiLogIn } from "react-icons/bi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type User = {
  name: string;
  email: string;
  id: string;
};

const Header = () => {
  const [user, setUser] = useState<User | null>(null);

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

  useEffect(() => {
    // サーバーサイドのAPI経由でユーザー情報を取得
    fetch("/api/callback")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to fetch user:", err));
  }, []);

  console.log("user", user);

  const router = useRouter();

  const handleLogin = () => {
    // Next.jsのAPI経由でFlaskのログインを開始
    router.push("/api/login");
  };

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
          {user !== null ? (
            <div>
              <p>{user.name}</p>
              <div className="avatar">
                <div className="mask mask-hexagon w-16">
                  <Image
                    src="/sources/user_icon.png"
                    alt="user icon"
                    style={{ objectFit: "cover" }}
                    fill
                  />
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
