import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const data = [
  { month: "Apr", visits: 186 },
  { month: "May", visits: 305 },
  { month: "Jun", visits: 237 },
  { month: "Jul", visits: 273 },
  { month: "Aug", visits: 349 },
];

const config = {
  visits: { label: "Visits", color: "var(--maroon)" },
} satisfies ChartConfig;

export default function ChartDemo() {
  return (
    <ChartContainer config={config} className="h-56 w-full max-w-md">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="visits" fill="var(--color-visits)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
