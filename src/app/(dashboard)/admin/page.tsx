"use client";

import { getOrderRevenueByMonth } from "@/actions/order/get-order-revenue-by-month";
import { getOrderTotalByStatus } from "@/actions/order/get-order-total-by-status";
import { getOrderByStatuses } from "@/actions/order/get-order-by-status";
import LineCharts from "@/components/common/line-charts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { priceToIDR } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function Page() {
  const lastWeek = new Date();
  lastWeek.setDate(new Date().getDate() - 7);
  lastWeek.setHours(0, 0, 0, 0);

  const { data: totalRevenueThisMonth } = useQuery({
    queryKey: ["get-revenue-this-month"],
    initialData: 0,
    queryFn: async () => {
      const thisMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      );
      const response = await getOrderRevenueByMonth({
        startMonth: thisMonth,
        endMonth: new Date(),
      });
      if (!response.success) {
        toast.error(response.error.message);
        return 0;
      }
      return response.data;
    },
    refetchOnMount: "always",
  });

  const { data: totalRevenueLastMonth } = useQuery({
    queryKey: ["get-revenue-last-month"],
    initialData: 0,
    queryFn: async () => {
      const lastMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        1,
      );
      const thisMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      );
      const response = await getOrderRevenueByMonth({
        startMonth: lastMonth,
        endMonth: thisMonth,
      });
      if (!response.success) {
        toast.error(response.error.message);
        return 0;
      }
      return response.data;
    },
    refetchOnMount: "always",
  });

  const { data: totalOrderSettledThisMonth } = useQuery({
    queryKey: ["get-total-order"],
    initialData: 0,
    queryFn: async () => {
      const response = await getOrderTotalByStatus({ status: "settled" });
      if (!response.success) {
        toast.error(response.error.message);
        return 0;
      }
      return response.data;
    },
    refetchOnMount: "always",
  });

  const { data: latestOrders, error } = useQuery({
    queryKey: ["get-latest-order"],
    queryFn: async () => {
      const response = await getOrderByStatuses({ statuses: ['process'] });
      if (!response.success) {
        toast.error(response.error.message)
        return [];
      }
      return response.data
    },
    refetchOnMount: "always",
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  });

  const averageRevenue = useMemo(() => {
    const total = totalRevenueThisMonth / totalOrderSettledThisMonth;
    return total > 0 ? total : 0;
  }, [totalRevenueThisMonth, totalOrderSettledThisMonth]);

  const growthRate = useMemo(() => {
    const total = totalRevenueThisMonth - totalRevenueLastMonth;
    const result = ((total / totalRevenueLastMonth) * 100).toFixed(2);
    return totalRevenueLastMonth > 0 ? result : 0;
  }, [totalRevenueThisMonth, totalRevenueLastMonth]);

  return (
    <main className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <section className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Total Revenue</CardTitle>
            <CardDescription>Revenue this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">
              {priceToIDR(totalRevenueThisMonth)}
            </h1>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Average Revenue</CardTitle>
            <CardDescription>Average per-day.</CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">{priceToIDR(averageRevenue)}</h1>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Order Settled</CardTitle>
            <CardDescription>Order settled this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">{totalOrderSettledThisMonth}</h1>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-semibold">Growth Rate</CardTitle>
            <CardDescription>Compared to last month.</CardDescription>
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold">{growthRate}%</h1>
          </CardContent>
        </Card>
      </section>
      <section className="grid lg:grid-cols-3 grid-cols-1 gap-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-semibold">
              Order statistic per-week
            </CardTitle>
            <CardDescription>
              All customers have requested statistical data for the period from{" "}
              {lastWeek.toLocaleDateString("id-ID")} to{" "}
              {new Date().toLocaleDateString("id-ID")}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineCharts startDate={lastWeek} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-semibold">Active order</CardTitle>
            <CardDescription>Showing last 5 active order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {(latestOrders || []).length > 1 ?
                (latestOrders || []).map((order) => (
                  <div
                    className="flex items-center justify-between"
                    key={`latest-order-${order.id}`}
                  >
                    <div>
                      <h3>{order.customerName}</h3>
                      <p className="text-slate-400">Table: {order.table?.name}</p>
                      <p className="text-slate-400">Order Id: {order.orderId}</p>
                    </div>
                    <Button asChild>
                      <Link href={`/orders/${order.orderId}`}>Detail</Link>
                    </Button>
                  </div>
                )) : 'No active orders were found'
              }
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
