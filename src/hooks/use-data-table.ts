import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-table-constant";
import { useState } from "react";

export function useDataTable() {
  const [currentLimit, setLimit] = useState(DEFAULT_LIMIT);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  function handleChangeLimit(value: string) {
    setLimit(Number(value));
    setCurrentPage(1);
  }

  return {
    currentLimit,
    setLimit,
    currentPage,
    setCurrentPage,
    handleChangeLimit,
  };
}
