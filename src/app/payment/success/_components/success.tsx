"use client";

import { updateOrderStatusAction } from "@/actions/order/update-order-status";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { SquareCheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Success = () => {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const { push } = useRouter();

  const { mutate } = useMutation({
    mutationKey: ["update-payment-status", orderId],
    mutationFn: async () => {
      if (!orderId) throw new Error("Order not found");
      const response = await updateOrderStatusAction({ orderId });
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response;
    },
    onError(error) {
      push(`failed?order_id=${orderId}`);
      toast.error(error.message);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  return (
    <section className="flex flex-col gap-5 justify-center items-center max-w-sm">
      <SquareCheckIcon className="size-30 text-green-500" />
      <h1 className="text-3xl font-bold">Payment Success</h1>
      <Button asChild size={"lg"}>
        <Link href={`/orders/${orderId}`}>Back to Order</Link>
      </Button>
    </section>
  );
};

export default Success;
