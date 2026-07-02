"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import usePricing from "@/hooks/use-pricing";
import { priceToIDR } from "@/lib/utils";
import { OrderMenu } from "@/types/order-menu";

type OrderSummaryProps = {
  orderMenu: OrderMenu[];
};

export default function OrderSummary({ orderMenu }: OrderSummaryProps) {
  const { subtotal, tax, service, total } = usePricing(orderMenu);
  return (
    <Card className="w-full max-w-sm">
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
    </Card>
  );
}
