"use client";

import { getOrderByDate } from "@/actions/order/get-order-by-date";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { toast } from "sonner";
import colors from "tailwindcss/colors";

const LineCharts = ({ startDate }: { startDate: Date }) => {
  const { data: orders } = useQuery({
    queryKey: ["get-order-by-date"],
    queryFn: async () => {
      const response = await getOrderByDate({ startDate });
      if (!response.success) {
        toast.error(response.error.message);
        return;
      }
      return response.data.orders;
    },
  });

  const data = useMemo(() => {
    const dates: { date: string; order: number }[] = [];
    orders?.forEach((item) => {
      const date = item.createdAt.toLocaleDateString("id-ID");

      const index = dates.findIndex((item) => item.date === date);

      // index != -1 (if date already exist)
      if (index != -1) {
        dates[index].order += 1;
      } else {
        dates.push({
          date,
          order: 1,
        });
      }
    });
    return dates;
  }, [orders]);

  return (
    <LineChart
      style={{
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        maxHeight: "40vh",
        aspectRatio: 2,
      }}
      responsive
      data={data}
      margin={{
        top: 40,
        right: 50,
        left: 10,
        bottom: 0,
      }}
    >
      <XAxis dataKey="date" stroke={colors.slate[400]} />
      <YAxis
        width="auto"
        stroke={colors.slate[400]}
        label={{
          value: "Orders",
          angle: -90,
          position: "insideLeft",
          style: {
            textAnchor: "middle",
            fill: colors.slate[400],
          },
        }}
      />
      <Tooltip
        cursor={{
          stroke: colors.slate[400],
          strokeWidth: 2,
        }}
        contentStyle={{
          backgroundColor: colors.slate[500],
          borderColor: colors.slate[300],
        }}
        labelStyle={{
          color: colors.slate[200],
        }}
        itemStyle={{
          color: colors.slate[200],
        }}
      />
      <Legend />
      <Line
        type="monotone"
        strokeWidth={3}
        dataKey="order"
        stroke={colors.slate[500]}
        dot={{
          fill: colors.slate[300],
        }}
        activeDot={{ r: 5, stroke: colors.white }}
      />
    </LineChart>
  );
};

export default LineCharts;
