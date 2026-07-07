import LineCharts from "@/components/common/line-charts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const startDate = new Date();
  startDate.setDate(new Date().getDate() - 7);
  startDate.setHours(0, 0, 0, 0);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Order statistic per-week</CardTitle>
        <CardDescription>
          All customers have requested statistical data for the period from{" "}
          {startDate.toLocaleDateString("id-ID")} to{" "}
          {new Date().toLocaleDateString("id-ID")}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LineCharts startDate={startDate} />
      </CardContent>
    </Card>
  );
}
