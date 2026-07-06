"use client";

import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DropwdownAction from "@/components/common/dropdown-action";
import { Order } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { HEADER_TABLE_ORDER } from "@/constants/order-constants";
import { getOrderAction } from "@/actions/order/get-order";
import { OrderWithTable, UpdateOrder } from "@/types/order";
import DialogCreateOrder from "./dialog-create-order";
import { CircleXIcon, RocketIcon, ScrollTextIcon } from "lucide-react";
import { updateOrderAction } from "@/actions/order/update-order";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/default";

const OrderManagement = () => {
  const {
    currentLimit,
    currentPage,
    currentSearch,
    handleSearch,
    setCurrentPage,
    handleChangeLimit,
  } = useDataTable();

  const { push } = useRouter();

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
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  useEffect(() => {
    const channel = supabase
      .channel(`order}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order",
        },
        () => refetch(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const [selectedAction, setSelectedAction] = useState<null | {
    type: "create";
    order: Order | null;
  }>(null);

  const { mutate } = useMutation({
    mutationKey: ["update-order"],
    mutationFn: async ({ order, status }: UpdateOrder) => {
      const response = await updateOrderAction({ order, status });
      if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Order updated successfully");
        refetch();
      }
    },
  });

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
              "bg-yellow-600": order.status === "process",
              "bg-sky-600": order.status === "reserved",
              "bg-red-600": order.status === "cancelled",
            },
          )}
        >
          {order.status}
        </div>,
        <DropwdownAction
          menus={
            order.status === "reserved"
              ? [
                  {
                    label: (
                      <div className="flex gap-1 items-center">
                        <RocketIcon />
                        Process
                      </div>
                    ),
                    variant: "default",
                    action: () => {
                      mutate({ order, status: "process" });
                    },
                    type: "button",
                  },
                  {
                    label: (
                      <div className="flex gap-1 items-center">
                        <CircleXIcon />
                        Cancel
                      </div>
                    ),
                    variant: "destructive",
                    action: () => {
                      mutate({ order, status: "cancelled" });
                    },
                    type: "button",
                  },
                ]
              : [
                  {
                    label: (
                      <div className="flex gap-1 items-center">
                        <ScrollTextIcon />
                        Details
                      </div>
                    ),
                    variant: "default",
                    action: () => {
                      push(`/orders/${order.orderId}`);
                    },
                    type: "button",
                  },
                ]
          }
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
    </section>
  );
};

export default OrderManagement;
