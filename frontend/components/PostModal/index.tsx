import * as Dialog from "@radix-ui/react-dialog";
import { Dispatch, FC, SetStateAction, useState } from "react";
import useSWRMutation from "swr/mutation";
import Dropzone from "@/components/Dropzone";
import { userDataType } from "@/types/userDataType";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  userData: userDataType;
};

export const PostModal: FC<Props> = ({ isOpen, closeModal, userData }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const handleUpload = async (url: any) => {
    if (files.length === 0) {
      alert("ファイルを選択してください！");
      return;
    }

    if (!title) return alert("titleを入力してください");

    const formData = new FormData();
    formData.append("title", title); // タイトルを追加
    formData.append("user_id", userData.google_id); // ユーザーIDを追加
    console.log("handle user_id", userData.google_id);

    // ファイルをリストとして追加
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
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

  const url = "http://127.0.0.1:5000/db/upload";
  const { trigger, isMutating } = useSWRMutation(url, handleUpload);

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-box bg-base-200 p-10">
          {/* <Dialog.Title>Add new files</Dialog.Title> */}
          <Dialog.Description />
          <Dropzone files={files} setFiles={setFiles} />
          <div className="mt-2">
            <input
              type="text"
              placeholder="Type here"
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered input-primary w-full"
            />
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button onClick={closeModal} className="btn bg-slate-500">
              Cancel
            </button>

            <button
              onClick={() => trigger()}
              className="btn bg-success text-success-content"
            >
              Send
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
