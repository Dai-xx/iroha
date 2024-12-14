import Image from "next/image";

const Header = () => {
  return (
    <>
      <header className="mt-5">
        <div className="flex w-full justify-end">
          <div className="avatar">
            <div className="mask mask-hexagon w-14">
              <Image
                src="/sources/user_icon.png"
                alt="user icon"
                style={{ objectFit: "cover" }}
                fill
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
