import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { filedataMock } from "@/mocks/filedataMock";
import Header from "@/components/Header";

export default function Home() {
  const mockData = filedataMock;
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
      <div>
        <Header />
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
        <div className="mt-5">
          <div className="mx-auto flex h-[700px] w-[1100px] flex-col items-center justify-center rounded-xl bg-base-300/50 p-5">
            <ul className="grid w-full grid-flow-col grid-cols-2 grid-rows-8 justify-items-center gap-3">
              <div className="h-[70px] w-[440px] border-collapse rounded-lg border border-dashed border-primary"></div>
              {mockData.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="btn no-animation h-[70px] w-[440px] bg-neutral text-neutral-content"
                  >
                    <p>{item.project}</p>
                    <p>{item.createdAt}</p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mt-3">
            <nav className="join flex justify-center">
              <button className="btn join-item">1</button>
              <button className="btn join-item">2</button>
              <button className="btn btn-disabled join-item">...</button>
              <button className="btn join-item">99</button>
              <button className="btn join-item">100</button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
