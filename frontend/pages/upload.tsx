import Dropzone from "@/components/Dropzone";

export default function Upload() {
  return (
    <>
      {/* <ThemeController /> */}
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-card bg-neutral h-[650px] w-[1000px] p-7">
          <Dropzone />
        </div>
      </div>
    </>
  );
}
