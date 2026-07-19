"use client";

import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DropwdownAction from "@/components/common/dropdown-action";
import { cn } from "@/lib/utils";
import { HEADER_TABLE_ORDER } from "@/constants/order-constants";
import { getOrder } from "@/actions/order/get-order";
import { OrderWithTable, UpdateOrder } from "@/types/order";
import {
  CircleXIcon,
  HandbagIcon,
  RocketIcon,
  ScrollTextIcon,
  UtensilsIcon,
} from "lucide-react";
import { updateOrder } from "@/actions/order/update-order";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/default";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DialogCreateOrderDineIn from "./dialog-create-order-dine-in";
import DialogCreateOrderTakeaway from "./dialog-create-order-takeaway";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableMap from "./table-map";
import { getAllTable } from "@/actions/table/get-all-table";
import { getOrderByStatuses } from "@/actions/order/get-order-by-status";

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
    refetch: refetchOrders,
    error: errorGetOrders,
  } = useQuery({
    queryKey: ["orders", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      return await getOrder({
        take: currentLimit,
        page: currentPage,
        search: currentSearch,
      });
    },
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (errorGetOrders) toast.error(errorGetOrders.message);
  }, [errorGetOrders]);

  const { data: tables, error: errorGetTables, refetch: refetchTables } = useQuery({
    queryKey: ["get-all-tables"],
    queryFn: async () => {
      const response = await getAllTable();
      return response.data;
    },
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (errorGetTables) toast.error(errorGetTables.message);
  }, [errorGetTables]);

  const { data: orderByStatuses, error: errorGetOrderByStatus, refetch: refetchOrderByStatuses } = useQuery({
    queryKey: ["get-order-by-statuses"],
    queryFn: async () => {
      const response = await getOrderByStatuses({
        statuses: ['process', 'reserved']
      });
      if (!response.success) {
        toast.error(response.error.message);
        return
      }
      return response.data;
    },
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (errorGetOrderByStatus) toast.error(errorGetOrderByStatus.message);
  }, [errorGetOrderByStatus]);

  const [selectedAction, setSelectedAction] = useState<null | {
    orderType: "dine-in" | "takeaway";
  }>(null);

  const { mutate } = useMutation({
    mutationKey: ["update-order"],
    mutationFn: async ({ order, status }: UpdateOrder) => {
      const response = await updateOrder({ order, status });
      if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Order updated successfully");
        refetchOrders();
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
        order.table?.name ?? "Takeaway",
        <div key={`order-status-${order.id}`}
          className={cn(
            "text-white capitalize py-1 w-fit px-2 mx-auto rounded-lg",
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
        <DropwdownAction key={`order-action-${order.id}`}
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
  }, [orders, currentLimit, currentPage, mutate, push]);

  const totalPages = useMemo(() => {
    if (!orders) return 1;
    return orders.paging.total_page;
  }, [orders]);

  useEffect(() => {
    const orderChannel = supabase
      .channel(`order}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order",
        },
        () => {
          refetchOrders()
          refetchTables()
          refetchOrderByStatuses()
        },
      )
      .subscribe();

    const tableChannel = supabase
      .channel(`table}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "table",
        },
        () => {
          refetchTables()
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(tableChannel);
    };
  }, [refetchOrders, refetchTables, refetchOrderByStatuses]);

  return (
    <section>
      <Tabs defaultValue="order-list" className="w-full flex flex-col gap-5">
        <TabsList>
          <TabsTrigger value="order-list">Order List</TabsTrigger>
          <TabsTrigger value="table-map">Table Map</TabsTrigger>
        </TabsList>
        <TabsContent value="order-list">
          <div className="flex flex-col gap-8">
            <div className="flex gap-3 w-80 self-end">
              <Input
                placeholder="Search order id/customer name"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Create</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() =>
                          setSelectedAction({ orderType: "dine-in" })
                        }
                      >
                        <UtensilsIcon /> Dine In
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          setSelectedAction({ orderType: "takeaway" })
                        }
                      >
                        <HandbagIcon /> Takeaway
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
          </div>
        </TabsContent>
        <TabsContent value="table-map">
          <TableMap tables={tables} orders={orderByStatuses} refetch={refetchOrderByStatuses} />
        </TabsContent>
      </Tabs>
      {selectedAction?.orderType === "dine-in" && (
        <DialogCreateOrderDineIn
          refetch={refetchOrders}
          open={true}
          setOpen={() => setSelectedAction(null)}
        />
      )}
      {selectedAction?.orderType === "takeaway" && (
        <DialogCreateOrderTakeaway
          refetch={refetchOrders}
          open={true}
          setOpen={() => setSelectedAction(null)}
        />
      )}
    </section>
  );
};

export default OrderManagement;
