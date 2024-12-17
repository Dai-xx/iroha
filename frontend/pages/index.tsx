import { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { FaRegSquarePlus } from "react-icons/fa6";
import { filedataMock } from "@/mocks/filedataMock";
import Header from "@/components/Header";
import { PostModal } from "@/components/PostModal";
import { useOpenModal } from "@/hooks/useOpenModal";
import CodeArea from "@/components/CodeArea";
import { filecontentMock } from "@/mocks/filecontentMock";
import usePagination from "@/hooks/usePagination";

const fetcher = (url: any) => axios.get(url).then((res) => res.data);

export default function Home() {
  const mockmetaData = filedataMock;
  const mockcontentData = filecontentMock;
  const pageSize = 14;
  const { currentPage, totalPages, currentPosts, handlePageClick } =
    usePagination(mockmetaData, pageSize);

  // const { data, error } = useSWR(`/api/posts?page=${currentPage}`, fetcher, {
  //   revalidateOnFocus: false,
  //   keepPreviousData: true,
  // });

  // const { data, error } = useSWR(`/api/posts?page=${project}`, fetcher, {
  //   revalidateOnFocus: false,
  //   keepPreviousData: true,
  // });

  // const code = data.data

  const { isOpen, setIsOpen, openModal, closeModal } = useOpenModal();

  const [isOpenCode, setIsOpenCode] = useState(false);

  const [project, setProject] = useState<string | null>(null);

  const handleProject = (item: any) => {
    setProject(item.projectId);
    setIsOpenCode(true);
  };
  console.log("project", project);

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
            <div className={`${isOpenCode ? "w-1/2" : "w-full"}`}>
              <ul className="grid grid-flow-col grid-cols-2 grid-rows-7 justify-items-center gap-3">
                {currentPosts.map((item, index) => {
                  return (
                    <li
                      key={index}
                      onClick={handleProject}
                      className={`${isOpenCode ? "max-w-[270px]" : "max-w-[440px]"} btn no-animation h-[70px] w-full bg-neutral text-neutral-content`}
                    >
                      <p>{item.project}</p>
                      <p>{item.createdAt}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
            {isOpenCode && (
              <div className="w-1/2">
                {isOpenCode && (
                  <div role="tablist" className="tabs tabs-lifted">
                    {mockcontentData.map((item, index) => {
                      const isChecked = index === 0;
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
                            className="tab-content rounded-box border-base-300 bg-base-100 p-6"
                          >
                            <CodeArea code={item.content} />
                          </div>
                        </>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-3">
            <nav className="flex justify-center">
              <ReactPaginate
                previousLabel={<span className="btn join-item">Previous</span>} // DaisyUIのボタン
                nextLabel={<span className="btn join-item">Next</span>} // DaisyUIのボタン
                breakLabel={
                  <span className="btn btn-disabled join-item">...</span>
                } // "..."のボタン
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"join flex justify-center"} // DaisyUIのjoinクラス
                activeClassName={"btn-active"} // 現在のページのスタイル
                pageClassName={"btn join-item"} // 各ページ番号のボタンスタイル
                previousClassName={"btn join-item"} // 前のページのボタンスタイル
                nextClassName={"btn join-item"} // 次のページのボタンスタイル
              />
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
