"use client";

import { generatePaymentToken } from "@/actions/payment/generate-payment-token";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import usePricing from "@/hooks/use-pricing";
import { priceToIDR } from "@/lib/utils";
import { OrderMenu } from "@/types/order-menu";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type OrderSummaryProps = {
  orderMenu: OrderMenu[];
  orderId: string;
};

export default function OrderSummary(props: OrderSummaryProps) {
  const { orderMenu, orderId } = props;

  const { subtotal, tax, service, total } = usePricing(orderMenu);

  const allMenuIsNotServed = orderMenu.some((orderMenu) => {
    return orderMenu.status != "served";
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["generate-payment-token", orderId],
    mutationFn: async () => {
      if (!orderId) throw new Error("Order not found");
      const response = await generatePaymentToken({ orderId });
      if (!response.success && response.error.message) {
        toast.error(response.error.message);
      } else if (response.success) {
        window.snap.pay(response.data.paymentToken, {
          onSuccess: function (result: any) {
            toast.success(result.status_message);
          },
          onPending: function (result: any) {
            console.log(result);
            toast.info("Waiting your payment!");
          },
          onError: function (result: any) {
            console.log(result);
            toast.error("Payment failed!");
          },
          onClose: function () {
            toast.info("You closed the popup without finishing the payment");
          },
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Card className="flex h-fit self-center xl:col-span-1 col-span-3">
      <CardContent className="flex flex-col gap-4">
        <section>
          <h1 className="text-2xl font-extrabold">Customer Information</h1>
          <h3 className="text-gray-400">Customer information order details</h3>
        </section>
        <form>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="customer_name">Customer name</Label>
              <Input
                id="customer_name"
                type="text"
                disabled
                value={orderMenu[0]?.order?.customerName ?? "-"}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="table_name">Table</Label>
              <Input
                id="table_name"
                type="text"
                disabled
                value={orderMenu[0]?.order?.table?.name ?? "-"}
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
        <Button
          className="w-full bg-slate-500 text-white font-bold hover:bg-slate-600 py-5"
          disabled={allMenuIsNotServed || isPending}
          onClick={() => mutate()}
        >
          Pay
        </Button>
      </CardFooter>
    </Card>
  );
}
