import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode } from "react";
import { Card } from "../ui/card";

type TableListProps<T> = {
  headers: string[];
  data: ReactNode[][];
  isPending: boolean;
};

export function TableList({
  headers,
  data,
  isPending,
}: TableListProps<string>) {
  return (
    <Card className="mx-auto p-0">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((item, index) => (
              <TableHead
                className="font-semibold py-4 px-24"
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
          {!isPending && data.length === 0 && (
            <TableRow className="h-16">
              <TableCell colSpan={headers.length} className="text-center">
                Empty Data
              </TableCell>
            </TableRow>
          )}

          {/* data found */}
          {!isPending && data.length > 0 && (
            <>
              {data.map((row, rowIndex) => (
                <TableRow key={`row-${rowIndex}`} className="h-16">
                  {row.map((column, columnIndex) => (
                    <TableCell
                      key={`column-${columnIndex}`}
                      className="p-4 px-24"
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
  );
}
