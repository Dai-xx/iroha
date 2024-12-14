import Image from "next/image";
import { BiLogIn } from "react-icons/bi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Header = () => {
  const [isLogin, setIsLogin] = useState(true);

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
          {isLogin ? (
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
          ) : (
            <button className="btn bg-accent text-accent-content">
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
