"use client";

import { generatePaymentToken } from "@/actions/payment/generate-payment-token";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Role } from "@/generated/prisma/enums";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import usePricing from "@/hooks/use-pricing";
import { useRouter } from "next/navigation";
import { priceToIDR } from "@/lib/utils";
import { toast } from "sonner";
import { OrderWithRelations } from "@/types/order";
import { useRef } from "react";
import { OrderMenuWithMenu } from "@/types/order-menu";

type OrderSummaryProps = {
  order: OrderWithRelations | undefined;
};

export default function OrderSummary(props: OrderSummaryProps) {
  const { order } = props;
  const { push } = useRouter();
  const user = useAuthStore((state) => state.user);

  const { subtotal, tax, service, total } = usePricing(order);

  const menuIsNotServed =
    order?.orderMenus.length === 0
      ? true
      : order?.orderMenus.some((orderMenu) => {
          return orderMenu.status != "served";
        });

  const { mutate, isPending } = useMutation({
    mutationKey: ["generate-payment-token", order?.id],
    mutationFn: async () => {
      if (!order) throw new Error("Order is not found");
      const response = await generatePaymentToken({ id: order?.id });
      if (!response.success && response.error.message) {
        throw new Error(response.error.message);
      } else if (response.success) {
        window.snap.pay(response.data.paymentToken, {
          onSuccess: function (result: any) {
            push(`/payment/success?order_id=${result.order_id}`);
          },
          onPending: function (result: any) {
            toast.info("Waiting your payment!");
          },
          onError: function (result: any) {
            push(`/payment/failed?order_id=${result.order_id}`);
          },
          onClose: function () {
            toast.info("You closed the popup without finishing the payment");
          },
        });
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const priceMenu = (orderMenu: OrderMenuWithMenu | null) => {
    const productPrice = orderMenu?.menu?.price ?? 0;
    const discountPercentage = (orderMenu?.menu?.discount ?? 0) / 100;
    const discount = productPrice * discountPercentage;
    const productDiscount = productPrice - discount;
    const productTotalPrice = (orderMenu?.quantity ?? 0) * productDiscount;
    return productTotalPrice;
  };

  return (
    <section className="flex h-fit self-center xl:col-span-1 col-span-3">
      <div className="flex flex-col gap-5 w-full">
        {order?.status === "settled" && (
          <Button className="self-end" onClick={reactToPrintFn}>
            Print Receipt
          </Button>
        )}
        <Card>
          <CardContent className="flex flex-col gap-4">
            <section>
              <h1 className="text-2xl font-extrabold">Customer Information</h1>
              <h3 className="text-gray-400">
                Customer information order details
              </h3>
            </section>
            <form>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="customer_name">Customer name</Label>
                  <Input
                    id="customer_name"
                    type="text"
                    disabled
                    value={order?.customerName ?? "-"}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="table_name">Table</Label>
                  <Input
                    id="table_name"
                    type="text"
                    disabled
                    value={order?.table?.name ?? "-"}
                  />
                </div>
              </div>
            </form>
            <Separator />
            <section className="flex flex-col gap-3">
              <h1 className="text-2xl font-extrabold">Order Summary</h1>
              <div className="flex justify-between">
                <h3>Subtotal</h3>
                <p>{priceToIDR(subtotal)}</p>
              </div>
              <div className="flex justify-between">
                <h3>Tax (12%)</h3>
                <p>{priceToIDR(tax)}</p>
              </div>
              <div className="flex justify-between">
                <h3>Service (5%)</h3>
                <p>{priceToIDR(service)}</p>
              </div>
            </section>
            <Separator />
            <section className="flex justify-between">
              <h1 className="text-2xl font-extrabold">Total</h1>
              <h1 className="text-2xl font-extrabold">{priceToIDR(total)}</h1>
            </section>
          </CardContent>
          <CardFooter>
            {user?.role != Role.KITCHEN && (
              <Button
                className="w-full bg-slate-500 text-white font-bold hover:bg-slate-600 py-5"
                disabled={
                  menuIsNotServed ||
                  isPending ||
                  order?.status === "settled" ||
                  order?.status === "cancelled"
                }
                onClick={() => mutate()}
              >
                Pay
              </Button>
            )}
          </CardFooter>
        </Card>
        <div ref={contentRef} className="hidden print:block">
          <div className="p-10 mx-auto flex flex-col gap-5">
            <h1 className="text-2xl font-bold text-center">Cafeku.</h1>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <div className="border-2 border-dashed"></div>
                <p>
                  Bill No:{" "}
                  <span className="font-semibold">{order?.orderId}</span>
                </p>
                <p>
                  Table:{" "}
                  <span className="font-semibold">{order?.table?.name}</span>
                </p>
                <p>
                  Customer:{" "}
                  <span className="font-semibold">{order?.customerName}</span>
                </p>
                <p>
                  Date:
                  <span className="font-semibold">
                    {order?.createdAt.toLocaleString("id-ID")}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="border-2 border-dashed"></div>
                <div>
                  {order?.orderMenus.map((orderMenu) => (
                    <div
                      className="flex justify-between"
                      key={`order-summary-menu-${orderMenu.id}`}
                    >
                      <p>
                        {orderMenu.menu?.name} x{orderMenu.quantity}
                      </p>
                      <p>{priceToIDR(priceMenu(orderMenu))}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="border-2 border-dashed"></div>
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>{priceToIDR(subtotal)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Tax</p>
                  <p>{priceToIDR(tax)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Service</p>
                  <p>{priceToIDR(service)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Total</p>
                  <p>{priceToIDR(total)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
