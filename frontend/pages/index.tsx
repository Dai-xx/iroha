import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { FaRegFileCode, FaRegSquarePlus } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useSpring, animated } from "@react-spring/web";
import { filedataMock } from "@/mocks/filedataMock";
import Header from "@/components/Header";
import { PostModal } from "@/components/PostModal";
import { useOpenModal } from "@/hooks/useOpenModal";
import CodeArea from "@/components/CodeArea";
import { filecontentMock } from "@/mocks/filecontentMock";
import usePagination from "@/hooks/usePagination";
import { validateName } from "@/utils/validateName";
import Pagenaiton from "@/components/Pagenation";
import { parseDate } from "@/utils/parseDate";

interface Item {
  created_at: string;
  project_id: string;
  projectname: string;
  metadata_list: { filename: string; file_type: string }[];
}
const fetcher = (url: any) => axios.get(url).then((res) => res.data);

export default function Home() {
  const mockmetaData = filedataMock;
  const mockcontentData = filecontentMock;
  const pageSize = 14;
  const { currentPage, totalPages, currentPosts, handlePageClick } =
    usePagination(mockmetaData, pageSize);

  const { data: listData, error: listDataError } = useSWR(
    `http://127.0.0.1:5000/db/list/${currentPage}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  console.log("listData", listData);
  const [projectId, setProjectId] = useState<string | null>(null);

  const { data: previewData, error: previewDataError } = useSWR(
    `http://127.0.0.1:5000/db/preview/${projectId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  const files = previewData && previewData.files;

  const { isOpen, setIsOpen, openModal, closeModal } = useOpenModal();

  const [isOpenCode, setIsOpenCode] = useState(false);

  const handleProject = (item: Item) => {
    console.log("item", item);
    setProjectId(item.project_id);
    setIsOpenCode(true);
  };
  console.log("project", projectId);

  const style = useSpring({
    width: isOpenCode ? "50%" : "100%",
  });

  const style2 = useSpring({
    width: isOpenCode ? "50%" : "0",
    opacity: isOpenCode ? 1 : 0,
  });

  return (
    <>
      <div>
        <Header />

        <button
          onClick={openModal}
          className="btn bg-accent text-accent-content"
        >
          <FaRegSquarePlus size={20} />
          New
        </button>
        {isOpen && <PostModal isOpen={isOpen} closeModal={closeModal} />}

        <div className="mt-2">
          <div
            className={`mx-auto flex h-[650px] w-full justify-center rounded-xl bg-base-300/50 p-10`}
          >
            <animated.div style={style}>
              <ul className="grid w-full grid-flow-col grid-cols-2 grid-rows-7 justify-items-center gap-3">
                {listData &&
                  listData.map((item: any, index: number) => {
                    const dateObject = parseDate(item.created_at);
                    return (
                      <li
                        key={index}
                        onClick={() => handleProject(item)}
                        className={`btn no-animation h-[70px] w-full min-w-[250px] overflow-hidden bg-neutral`}
                      >
                        <div className="w-full">
                          <div className="flex h-full gap-5 rounded-lg p-1 text-white">
                            <div className="flex">
                              <div>
                                <div className="flex justify-between gap-2">
                                  <p>{dateObject.month}月</p>
                                  <p>{dateObject.dayOfWeek}</p>
                                </div>
                                <div className="text-4xl">
                                  {dateObject.date}
                                </div>
                              </div>
                              <div className="mx-2 rounded-full border-l-2 border-white/50"></div>
                              <div className="w-[50px] text-left text-lg">
                                <h3>{item.projectname}</h3>
                              </div>
                            </div>
                            <div className="grid w-[200px] grid-cols-2 grid-rows-2 gap-1 font-normal">
                              {item &&
                                item.metadata_list.map(
                                  (file: any, index: number) => {
                                    const validatedFilename = validateName(
                                      file.filename,
                                      10,
                                    );
                                    return (
                                      <div
                                        key={index}
                                        className="flex items-center rounded-[6px] bg-base-300/50 px-3 py-1"
                                      >
                                        <p>{validatedFilename}</p>
                                      </div>
                                    );
                                  },
                                )}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </animated.div>

            <animated.div style={style2} className="relative">
              <button
                onClick={() => setIsOpenCode(false)}
                className="absolute right-0 rounded-full bg-gray-500 p-1"
              >
                <RxCross2 size={20} />
              </button>
              <div role="tablist" className="tabs tabs-lifted">
                {files &&
                  files.map((item: any, index: number) => {
                    const isChecked = index === 0;
                    console.log("content", item.content);
                    const decodedContent = new TextDecoder("utf-8").decode(
                      Uint8Array.from(atob(item.content), (c) =>
                        c.charCodeAt(0),
                      ),
                    );
                    return (
                      <>
                        <input
                          key={index}
                          type="radio"
                          name="my_tabs"
                          role="tab"
                          className="tab"
                          aria-label={item.filename}
                          defaultChecked={isChecked}
                        />
                        <div
                          role="tabpanel"
                          className="tab-content rounded-box border-base-300 bg-base-100"
                        >
                          <div className="h-[530px] overflow-y-auto">
                            <CodeArea code={decodedContent} />
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </animated.div>
          </div>
          <div className="mt-3">
            <nav className="flex justify-center">
              <Pagenaiton
                totalPages={totalPages}
                handlePageClick={handlePageClick}
              />
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
