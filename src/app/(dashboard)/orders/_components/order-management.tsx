"use client";

import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DropwdownAction from "@/components/common/dropdown-action";
import { Order } from "@/generated/prisma/client";
import ActionLabel from "@/app/(dashboard)/admin/users/_components/action-label";
import { cn } from "@/lib/utils";
import { HEADER_TABLE_ORDER } from "@/constants/order-constants";
import { getOrderAction } from "@/actions/order/get-order";
import { OrderWithTable } from "@/types/order";
import DialogCreateOrder from "./dialog-create-order";

const OrderManagement = () => {
  const {
    currentLimit,
    currentPage,
    currentSearch,
    handleSearch,
    setCurrentPage,
    handleChangeLimit,
  } = useDataTable();

  const {
    data: orders,
    isPending,
    refetch,
    error,
  } = useQuery({
    queryKey: ["orders", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      return await getOrderAction({
        take: currentLimit,
        page: currentPage,
        search: currentSearch,
      });
    },
  });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  const [selectedAction, setSelectedAction] = useState<null | {
    type: "create" | "update" | "delete";
    order: Order | null;
  }>(null);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.data.map((order: OrderWithTable, index: number) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        order.orderId,
        order.customerName,
        order.table?.name,
        <div
          className={cn(
            "text-center text-white capitalize py-1 w-fit px-2 rounded-lg",
            {
              "bg-green-600": order.status === "settled",
              "bg-yellow-600": order.status === "processed",
              "bg-sky-600": order.status === "reserved",
              "bg-red-600": order.status === "cancelled",
            },
          )}
        >
          {order.status}
        </div>,
        <DropwdownAction
          menus={[
            {
              label: <ActionLabel type="edit" />,
              variant: "default",
              action: () => {
                setSelectedAction({
                  type: "update",
                  order,
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
                  order,
                });
              },
              type: "button",
            },
          ]}
        />,
      ];
    });
  }, [orders]);

  const totalPages = useMemo(() => {
    if (!orders) return 1;
    return orders.paging.total_page;
  }, [orders]);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex gap-3 w-1/4 self-end">
        <Input
          placeholder="Search order id/customer name"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          variant="outline"
          onClick={() => setSelectedAction({ type: "create", order: null })}
        >
          Create
        </Button>
      </div>
      <DataTable
        headers={HEADER_TABLE_ORDER}
        data={filteredOrders}
        isPending={isPending}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleChangeLimit={handleChangeLimit}
        currentLimit={currentLimit}
        totalPages={totalPages}
      />
      <DialogCreateOrder
        refetch={refetch}
        open={!!selectedAction && selectedAction.type === "create"}
        setOpen={() => setSelectedAction(null)}
      />
      {/*
      <DialogUpdateMenu
        menu={selectedAction?.menu}
        refetch={refetch}
        open={!!selectedAction && selectedAction.type === "update"}
        setOpen={() => setSelectedAction(null)}
      />
      <DialogDeleteMenu
        menu={selectedAction?.menu}
        refetch={refetch}
        open={!!selectedAction && selectedAction.type === "delete"}
        setOpen={() => setSelectedAction(null)}
      /> */}
    </section>
  );
};

export default OrderManagement;
