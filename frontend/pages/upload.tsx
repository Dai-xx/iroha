import Dropzone from "@/components/Dropzone";

export default function Upload() {
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="h-[650px] w-[1000px] rounded-card bg-neutral p-7">
          <Dropzone />
        </div>
      </div>
    </>
  );
}
