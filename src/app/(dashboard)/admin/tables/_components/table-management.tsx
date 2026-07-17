"use client";

import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DropwdownAction from "@/components/common/dropdown-action";
import { Table } from "@/generated/prisma/client";
import ActionLabel from "../../users/_components/action-label";
import { getTable } from "@/actions/table/get-table";
import { HEADER_TABLE_TABLE } from "@/constants/table-constants";
import { cn } from "@/lib/utils";
import DialogCreateTable from "./dialog-create-table";
import DialogUpdateTable from "./dialog-update-table";
import DialogDeleteTable from "./dialog-delete-table";
import { supabase } from "@/lib/supabase/default";

const TableManagement = () => {
  const {
    currentLimit,
    currentPage,
    currentSearch,
    handleSearch,
    setCurrentPage,
    handleChangeLimit,
  } = useDataTable();

  const {
    data: tables,
    isPending,
    refetch
  } = useQuery({
    queryKey: ["tables", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      return await getTable({
        take: currentLimit,
        page: currentPage,
        search: currentSearch,
      });
    },
    refetchOnMount: "always",
  });

  useEffect(() => {
    const channel = supabase
      .channel(`table`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "table",
        },
        () => refetch(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const [selectedAction, setSelectedAction] = useState<null | {
    type: "create" | "update" | "delete";
    table: Table | null;
  }>(null);

  const filteredTables = useMemo(() => {
    if (!tables) return [];
    return tables.data.map((table: Table, index: number) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div key={`tables-${table.id}`}>
          <h4 className="font-bold">{table.name}</h4>
          <p>{table.description}</p>
        </div>,
        table.capacity,
        <div key={`table-status-${table.id}`}
          className={cn(
            "text-white px-2 py-1 rounded-lg w-fit text-center capitalize",
            {
              "bg-green-600": table.status === "available",
              "bg-red-600": table.status === "unavailable",
              "bg-sky-600": table.status === "reserved",
            },
          )}
        >
          {table.status}
        </div>,
        <DropwdownAction key={`table-action-${table.id}`}
          menus={[
            {
              label: <ActionLabel type="edit" />,
              variant: "default",
              action: () => {
                setSelectedAction({
                  type: "update",
                  table,
                });
              },
              type: "button",
            },
            {
              label: <ActionLabel type="delete" />,
              variant: "destructive",
              action: () => {
                setSelectedAction({
                  type: "delete",
                  table,
                });
              },
              type: "button",
            },
          ]}
        />,
      ];
    });
  }, [tables, currentLimit, currentPage]);

  const totalPages = useMemo(() => {
    if (!tables) return 1;
    return tables.paging.total_page;
  }, [tables]);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-3 w-1/4 self-end">
        <Input
          placeholder="Search name/status"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={() => setSelectedAction({ type: "create", table: null })}
        >
          Create
        </Button>
      </div>
      <DataTable
        headers={HEADER_TABLE_TABLE}
        data={filteredTables}
        isPending={isPending}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleChangeLimit={handleChangeLimit}
        currentLimit={currentLimit}
        totalPages={totalPages}
      />
      <DialogCreateTable
        refetch={refetch}
        open={!!selectedAction && selectedAction.type === "create"}
        setOpen={() => setSelectedAction(null)}
      />
      <DialogUpdateTable
        refetch={refetch}
        table={selectedAction?.table}
        open={!!selectedAction && selectedAction.type === "update"}
        setOpen={() => setSelectedAction(null)}
      />
      <DialogDeleteTable
        refetch={refetch}
        table={selectedAction?.table}
        open={!!selectedAction && selectedAction.type === "delete"}
        setOpen={() => setSelectedAction(null)}
      />
    </section>
  );
};

export default TableManagement;
