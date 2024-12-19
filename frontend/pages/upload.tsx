import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";
import Dropzone from "@/components/Dropzone";

export default function Upload() {
  const [isOpenCode, setIsOpenCode] = useState(false);

  const style = useSpring({
    width: isOpenCode ? "50%" : "100%", // isOpenCode に応じて幅を変更
    config: { tension: 500, friction: 200 }, // アニメーション設定
  });

  const style2 = useSpring({
    width: isOpenCode ? "50%" : "0", // isOpenCode に応じて幅を変更
    opacity: isOpenCode ? 1 : 0, // isOpenCode に応じて透明度を変更
    config: { tension: 500, friction: 200 }, // アニメーション設定
  });

  return (
    <>
      <button
        onClick={() => setIsOpenCode(!isOpenCode)}
        className="btn"
      ></button>
      <ul className={`border-3 flex h-[300px] w-full border-red-700`}>
        <animated.div className="bg-white p-5" style={style}>
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 justify-items-center gap-5 bg-red-400 p-5">
            <div className="btn w-full"></div>
            <div className="btn w-full"></div>
            <div className="btn w-1/2 rounded-full"></div>
            <div className="btn w-1/2 rounded-full"></div>
          </div>
        </animated.div>
        <animated.div className="h-[300px] w-full bg-black" style={style2} />
      </ul>
      {/* <animated.div className="bg-black" style={style2}>
        {!isOpenCode && (
          <div className="grid h-full w-full grid-cols-2 grid-rows-2 justify-items-center gap-5 bg-red-400 p-5">
            <div className="btn w-full"></div>
            <div className="btn w-full"></div>
            <div className="btn w-1/2 rounded-full"></div>
            <div className="btn w-1/2 rounded-full"></div>
          </div>
        )}
      </animated.div> */}
    </>
  );
}
