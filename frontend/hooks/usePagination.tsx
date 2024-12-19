import { useState, useEffect } from "react";

/**
 * ページネーションのロジックをカスタムフックにしたもの
 * @param {Array} data - 全てのデータ
 * @param {number} pageSize - 1ページあたりのアイテム数
 * @returns {object} ページ情報と操作関数
 */
const usePagination = (data: any[], pageSize: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const currentPosts = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    console.log("currentPage", currentPage); // currentPageの変更を監視
  }, [currentPage]); // currentPageが変わるたびに実行される

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  return {
    currentPage,
    totalPages,
    currentPosts,
    handlePageClick,
  };
};

export default usePagination;
