"use client";

import { DataTable } from "@/components/common/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DropwdownAction from "@/components/common/dropdown-action";
import { cn, priceToIDR } from "@/lib/utils";
import { HEADER_TABLE_ORDER_MENU } from "@/constants/order-menu-constants";
import Image from "next/image";
import OrderSummary from "./order-summary";
import Link from "next/link";
import { CheckCheckIcon, CircleCheckBigIcon, RocketIcon } from "lucide-react";
import { updateStatusOrderMenuAction } from "@/actions/order-menu/update-status-order-menu";
import { getOrderByOrderId } from "@/actions/order/get-order-by-orderId";
import { useAuthStore } from "@/stores/auth-store";
import { Role } from "@/generated/prisma/enums";
import { supabase } from "@/lib/supabase/default";

const OrderDetail = ({ orderId }: { orderId: string }) => {
  const { currentLimit, currentPage, setCurrentPage, handleChangeLimit } =
    useDataTable();

  const user = useAuthStore((state) => state.user);

  const {
    data: order,
    error: errorGetOrderDetail,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["get-order-detail", orderId],
    queryFn: async () => {
      const response = await getOrderByOrderId({ orderId });
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    refetchOnMount: "always",
    enabled: !!orderId,
  });

  useEffect(() => {
    if (errorGetOrderDetail) {
      toast.error(errorGetOrderDetail.message);
    }
  }, [errorGetOrderDetail]);

  useEffect(() => {
    const channel = supabase
      .channel(`order-menu`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_menu",
        },
        () => refetch(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order]);

  const { mutate } = useMutation({
    mutationKey: ["update-status-order-menu"],
    mutationFn: async (params: {
      orderMenuId: string;
      status: "process" | "ready" | "served";
    }) => {
      const response = await updateStatusOrderMenuAction(params);
      if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        toast.success("Status updated successfully");
        refetch();
      }
    },
  });

  const filteredOrderMenus = useMemo(() => {
    if (!order?.orderMenus || order.orderMenus.length < 1) return [];
    const results = order.orderMenus.map((orderMenu, index) => {
      if (!orderMenu.menu) return [];
      const discount = orderMenu.menu.price * (orderMenu.menu.discount / 100);
      const productPrice = orderMenu.menu.price - discount;
      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex gap-2 items-center">
          <Image
            src={orderMenu.menu.image}
            alt={orderMenu.menu.name}
            width={500}
            height={500}
            className="size-14 rounded-lg"
            loading="eager"
          />
          <div>
            <p>{orderMenu.menu.name}</p>
            <p className="text-gray-300">x{orderMenu.quantity}</p>
            <p className="text-gray-400">{orderMenu?.notes ?? "No Notes"}</p>
          </div>
        </div>,
        priceToIDR(orderMenu.quantity * productPrice),
        <div
          className={cn(
            "text-center text-white capitalize py-1 w-fit px-2 rounded-lg",
            {
              "bg-red-600": orderMenu.status === "pending",
              "bg-yellow-600": orderMenu.status === "process",
              "bg-blue-600": orderMenu.status === "ready",
              "bg-green-600": orderMenu.status === "served",
            },
          )}
        >
          {orderMenu.status}
        </div>,
        orderMenu.status != "served" && user?.role != Role.KITCHEN ? (
          <DropwdownAction
            menus={[
              {
                label:
                  orderMenu.status === "pending" ? (
                    <>
                      <RocketIcon />
                      Process
                    </>
                  ) : orderMenu.status === "process" ? (
                    <>
                      <CircleCheckBigIcon />
                      Ready
                    </>
                  ) : (
                    <>
                      <CheckCheckIcon />
                      Served
                    </>
                  ),
                action: () => {
                  mutate({
                    orderMenuId: orderMenu.id,
                    status:
                      orderMenu.status === "pending"
                        ? "process"
                        : orderMenu.status === "process"
                          ? "ready"
                          : "served",
                  });
                },
                type: "button",
                variant: "default",
              },
            ]}
          />
        ) : orderMenu.status != "served" &&
          orderMenu.status != "ready" &&
          user?.role === Role.KITCHEN ? (
          <DropwdownAction
            menus={[
              {
                label:
                  orderMenu.status === "pending" ? (
                    <>
                      <RocketIcon />
                      Process
                    </>
                  ) : (
                    <>
                      <CircleCheckBigIcon />
                      Ready
                    </>
                  ),
                action: () => {
                  mutate({
                    orderMenuId: orderMenu.id,
                    status:
                      orderMenu.status === "pending" ? "process" : "ready",
                  });
                },
                type: "button",
                variant: "default",
              },
            ]}
          />
        ) : null,
      ];
    });
    if (results[0].length < 1) return [];
    return results;
  }, [order]);

  return (
    <>
      <h1 className="text-3xl font-extrabold">Detail Order</h1>
      <section className="grid lg:grid-cols-3 gap-5 order-2">
        <div className="flex flex-col gap-5 xl:col-span-2 col-span-3">
          <div className="flex justify-end">
            {user?.role !== Role.KITCHEN && (
              <Button variant="default" asChild>
                {order?.status == "settled" || order?.status == "cancelled" ? (
                  <Button disabled>Add Menu</Button>
                ) : (
                  <Link href={`/orders/${orderId}/add`}>Add Menu</Link>
                )}
              </Button>
            )}
          </div>
          <DataTable
            headers={HEADER_TABLE_ORDER_MENU}
            data={filteredOrderMenus}
            isPending={isPending}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleChangeLimit={handleChangeLimit}
            currentLimit={currentLimit}
            totalPages={1}
            hideRowsPerPage={true}
          />
        </div>
        <OrderSummary order={order} />
      </section>
    </>
  );
};

export default OrderDetail;
