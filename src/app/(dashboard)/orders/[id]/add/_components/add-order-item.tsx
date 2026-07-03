"use client";

import CardMenu from "./card-menu";
import OrderSummary from "../../_components/order-summary";
import { getOrderMenuAction } from "@/actions/order-menu/get-order-menu";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

const AddOrderItem = ({ orderId }: { orderId: string }) => {
  const { data: orderMenus, error: orderMenuError } = useQuery({
    queryKey: ["get-order-menus", orderId],
    queryFn: async () => {
      return await getOrderMenuAction({
        orderId,
      });
    },
  });

  useEffect(() => {
    if (orderMenuError) toast.error(orderMenuError.message);
  }, [orderMenuError]);

  return (
    <section>
      <h1 className="text-3xl font-extrabold">Menu</h1>
      <section className="flex flex-wrap justify-between">
        <CardMenu />
        <OrderSummary orderMenu={orderMenus ?? []} />
      </section>
    </section>
  );
};

export default AddOrderItem;
