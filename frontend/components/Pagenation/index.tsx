import { FC } from "react";
import ReactPaginate from "react-paginate";

type Props = {
  totalPages: number;
  handlePageClick: any;
};

const Pagenaiton: FC<Props> = ({ totalPages, handlePageClick }) => {
  return (
    <ReactPaginate
      previousLabel={<span className="btn join-item">Previous</span>} // DaisyUIのボタン
      nextLabel={<span className="btn join-item">Next</span>} // DaisyUIのボタン
      breakLabel={<span className="btn btn-disabled join-item">...</span>} // "..."のボタン
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
  );
};

export default Pagenaiton;
