import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { Card } from "../ui/card";
import PaginationDataTable from "./pagination-data-table";

type TableListProps = {
  headers: string[];
  data: ReactNode[][];
  isPending: boolean;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  handleChangeLimit: (value: string) => void;
  currentLimit: number;
  totalPages: number;
  hideRowsPerPage?: boolean;
};

export function DataTable(props: TableListProps) {
  const {
    headers,
    data,
    isPending,
    currentPage,
    setCurrentPage,
    handleChangeLimit,
    currentLimit,
    totalPages,
    hideRowsPerPage = false,
  } = props;
  return (
    <section className="flex flex-col gap-4">
      <Card className="p-0">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              {headers.map((item, index) => (
                <TableHead
                  className="font-semibold py-3 text-center"
                  key={`header-${index}`}
                >
                  {item}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* pending */}
            {isPending && (
              <TableRow className="h-16 animate-pulse">
                <TableCell colSpan={headers.length} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}

            {/* empty data */}
            {!isPending && data?.length === 0 && (
              <TableRow className="h-16">
                <TableCell colSpan={headers.length} className="text-center">
                  Empty Data
                </TableCell>
              </TableRow>
            )}

            {/* data found */}
            {!isPending && data?.length > 0 && (
              <>
                {data.map((row, rowIndex) => (
                  <TableRow key={`row-${rowIndex}`} className="h-16">
                    {row.map((column, columnIndex) => (
                      <TableCell
                        key={`column-${columnIndex}`}
                        className="py-3 text-center"
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </Card>
      <PaginationDataTable
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleChangeLimit={handleChangeLimit}
        currentLimit={currentLimit}
        totalPages={totalPages}
        hideRowsPerPage={hideRowsPerPage}
      />
    </section>
  );
}
