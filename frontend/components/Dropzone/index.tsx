import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileArrowUp } from "react-icons/fa6";
import useSWRMutation from "swr/mutation";

const style = {
  border: "3px dotted #888",
};
const Dropzone = () => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    console.log("acceptedFiles:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemove = (fileToRemove: File) => {
    // ファイルを削除するロジック
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileToRemove.name),
    );
  };

  const handleUpload = async (url: any) => {
    if (files.length === 0) {
      alert("ファイルを選択してください！");
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file); // 各ファイルを追加
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData, // FormDataを送信
      });

      if (response.ok) {
        alert("ファイルがアップロードされました！");
      } else {
        alert("アップロードに失敗しました。");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("エラーが発生しました。");
    }
  };

  const url = "http://127.0.0.1:5000/upload";
  const { trigger, isMutating } = useSWRMutation(url, handleUpload);

  return (
    <>
      <div
        {...getRootProps()}
        style={style}
        className={`${isDragActive && "bg-white/20"} relative h-1/2 w-full rounded-[36px] p-7`}
      >
        <FaFileArrowUp
          size={40}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"
        />
        {files[0] ? (
          <div className="relative z-10 grid h-full grid-cols-4 grid-rows-2 gap-2">
            {files.map((file, index) => {
              return (
                <div key={index}>
                  <div className="h-1/2 rounded-lg bg-primary text-primary-content">
                    {file.name}
                  </div>
                  <button onClick={() => handleRemove(file)}>remove</button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <input {...getInputProps()} />
          </div>
        )}
      </div>
      <div className="mt-5 flex justify-end">
        <button onClick={() => trigger()} className="btn">
          send
        </button>
      </div>
    </>
  );
};

export default Dropzone;
