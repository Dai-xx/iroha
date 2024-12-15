import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileArrowUp } from "react-icons/fa6";
import useSWRMutation from "swr/mutation";

type Prop = {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
};
const Dropzone: FC<Prop> = ({ files, setFiles }) => {
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

  return (
    <>
      <div
        {...getRootProps()}
        className={`${isDragActive && "bg-white/20"} relative h-[200px] w-[420px] rounded-box border border-dashed border-primary p-7`}
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
    </>
  );
};

export default Dropzone;
