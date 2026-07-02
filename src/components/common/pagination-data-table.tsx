import { LIMIT_LIST } from "@/constants/data-table-constant";
import { Field, FieldLabel } from "../ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dispatch, SetStateAction } from "react";

type PaginationDataTableProps = {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  handleChangeLimit: (value: string) => void;
  currentLimit: number;
  totalPages: number;
  hideRowsPerPage?: boolean;
};

const PaginationDataTable = (props: PaginationDataTableProps) => {
  const {
    currentPage,
    setCurrentPage,
    handleChangeLimit,
    currentLimit,
    totalPages,
    hideRowsPerPage,
  } = props;
  return (
    <div className="flex justify-between">
      {!hideRowsPerPage && (
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select
            defaultValue={String(currentLimit)}
            onValueChange={handleChangeLimit}
          >
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                {LIMIT_LIST.map((limit: number, index) => (
                  <SelectItem
                    value={String(limit)}
                    key={`row-perpage-${index}`}
                  >
                    {limit}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      )}
      {totalPages > 1 && (
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setCurrentPage(
                      currentPage > 1 ? currentPage - 1 : totalPages,
                    )
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;

                if (page === 1 || page === totalPages || page === currentPage) {
                  return (
                    <PaginationLink
                      key={`current-page-${index}`}
                      isActive={page === currentPage}
                      onClick={() =>
                        currentPage != page && setCurrentPage(page)
                      }
                    >
                      {page}
                    </PaginationLink>
                  );
                } else if (Math.abs(page - currentPage) <= 1) {
                  return (
                    <PaginationLink
                      key={`middle-page-${index}`}
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  );
                } else if (
                  (page === currentPage - 2 && page > 1) ||
                  (page === currentPage + 2 && page < totalPages)
                ) {
                  return (
                    <PaginationLink key={`ellipsis-page-${index}`}>
                      <PaginationEllipsis />
                    </PaginationLink>
                  );
                }
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setCurrentPage(
                      currentPage < totalPages ? currentPage + 1 : 1,
                    )
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default PaginationDataTable;
