"use client";

import { DataTable } from "@/components/common/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DropwdownAction from "@/components/common/dropdown-action";
import { cn, priceToIDR } from "@/lib/utils";
import { getOrderMenuAction } from "@/actions/order-menu/get-order-menu";
import { HEADER_TABLE_ORDER_MENU } from "@/constants/order-menu-constants";
import Image from "next/image";
import { OrderMenu } from "@/types/order-menu";
import OrderSummary from "./order-summary";
import Link from "next/link";

const OrderDetail = ({ orderId }: { orderId: string }) => {
  const { currentLimit, currentPage, setCurrentPage, handleChangeLimit } =
    useDataTable();

  const {
    data: orderMenus,
    isPending,
    error,
  } = useQuery({
    queryKey: ["order-details", orderId, currentLimit, currentPage],
    queryFn: async () => {
      return await getOrderMenuAction({
        orderId,
      });
    },
  });

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  const [selectedAction, setSelectedAction] = useState<null | {
    type: "create";
    orderMenu: OrderMenu | null;
  }>(null);

  const filteredOrderMenus = useMemo(() => {
    if (!orderMenus || orderMenus.length < 1) return [];
    const results = orderMenus.map((orderMenu: OrderMenu, index: number) => {
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
              "bg-green-600": orderMenu.status === "serve",
            },
          )}
        >
          {orderMenu.status}
        </div>,
        <DropwdownAction menus={[]} />,
      ];
    });
    if (results[0].length < 1) return [];
    return results;
  }, [orderMenus]);

  return (
    <>
      <h1 className="text-3xl font-extrabold">Detail Order</h1>
      <section className="flex gap-5">
        <section className="flex flex-col w-2/3 gap-3">
          <div className="flex justify-end">
            <Button variant="default" asChild>
              <Link href={`/orders/${orderId}/add`}>Add Menu</Link>
            </Button>
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
        </section>
        <OrderSummary orderMenu={orderMenus ?? []} />
      </section>
    </>
  );
};

export default OrderDetail;
