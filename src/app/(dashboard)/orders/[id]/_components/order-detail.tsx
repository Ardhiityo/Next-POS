"use client";

import { DataTable } from "@/components/common/data-table";
import { Input } from "@/components/ui/input";
import { useDataTable } from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import DropwdownAction from "@/components/common/dropdown-action";
import { cn, priceToIDR } from "@/lib/utils";
import { getOrderMenuAction } from "@/actions/order-menu/get-order-menu";
import { OrderMenuWithMenu } from "@/types/order-menu";
import { HEADER_TABLE_ORDER_MENU } from "@/constants/order-menu-constants";
import Image from "next/image";

const OrderDetail = ({ id }: { id: string }) => {
  const {
    currentLimit,
    currentPage,
    currentSearch,
    handleSearch,
    setCurrentPage,
    handleChangeLimit,
  } = useDataTable();

  const {
    data: orderMenus,
    isPending,
    refetch,
    error,
  } = useQuery({
    queryKey: ["order-details", id, currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      return await getOrderMenuAction({
        orderId: id,
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
    type: "create";
    orderMenu: OrderMenuWithMenu | null;
  }>(null);

  const filteredOrderMenus = useMemo(() => {
    if (!orderMenus || orderMenus.data.length < 1) return [];
    const results = orderMenus.data.map(
      (orderMenu: OrderMenuWithMenu, index: number) => {
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
      },
    );
    if (results[0].length < 1) return [];
    return results;
  }, [orderMenus]);

  const totalPages = useMemo(() => {
    if (!orderMenus) return 1;
    return orderMenus.paging.total_page;
  }, [orderMenus]);

  return (
    <section className="flex flex-col gap-8">
      <section className="flex flex-col w-2/3 gap-3">
        <h1 className="text-3xl font-extrabold">Detail Order</h1>
        <div className="flex gap-3 w-1/4 self-end">
          <Input
            placeholder="Search menu"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={() =>
              setSelectedAction({ type: "create", orderMenu: null })
            }
          >
            Add Menu
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
          totalPages={totalPages}
        />
      </section>
    </section>
  );
};

export default OrderDetail;
