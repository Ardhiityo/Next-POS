import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-table-constant";
import { useState } from "react";
import useDebounce from "./use-debouce";

export function useDataTable() {
  const [currentLimit, setLimit] = useState(DEFAULT_LIMIT);
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentFilter, setCurrentFilter] = useState("");
  const debounce = useDebounce();

  function handleChangeLimit(value: string) {
    setLimit(Number(value));
    setCurrentPage(1);
  }

  function handleSearch(value: string) {
    debounce(() => {
      setCurrentSearch(value);
      setCurrentPage(DEFAULT_PAGE);
    }, 500);
  }

  return {
    currentLimit,
    currentSearch,
    currentPage,
    currentFilter,
    setLimit,
    setCurrentPage,
    setCurrentFilter,
    handleChangeLimit,
    handleSearch,
  };
}
