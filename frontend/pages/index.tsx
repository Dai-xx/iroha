import { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { FaRegSquarePlus } from "react-icons/fa6";
import { filedataMock } from "@/mocks/filedataMock";
import Header from "@/components/Header";
import { PostModal } from "@/components/PostModal";
import { useOpenModal } from "@/hooks";

const fetcher = (url: any) => axios.get(url).then((res) => res.data);

export default function Home() {
  const mockData = filedataMock;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 14;
  const totalPages = Math.ceil(mockData.length / pageSize);
  const currentPosts = mockData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    console.log("currentPage", currentPage); // currentPageの変更を監視
  }, [currentPage]); // currentPageが変わるたびに実行される

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected + 1);
  };

  // const { data, error } = useSWR(`/api/posts?page=${currentPage}`, fetcher, {
  //   revalidateOnFocus: false,
  //   keepPreviousData: true,
  // });

  const { isOpen, setIsOpen, openModal, closeModal } = useOpenModal();

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
          <div className="mx-auto flex h-[650px] w-full flex-col items-center justify-center rounded-xl bg-base-300/50 p-5">
            <ul className="grid w-full grid-flow-col grid-cols-2 grid-rows-7 justify-items-center gap-3">
              {currentPosts.map((item, index) => {
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
