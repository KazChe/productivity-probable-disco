"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { day: "Monday", ooms: 5 },
  { day: "Tuesday", ooms: 8 },
  { day: "Wednesday", ooms: 3 },
  { day: "Thursday", ooms: 6 },
  { day: "Friday", ooms: 4 },
  { day: "Saturday", ooms: 2 },
  { day: "Sunday", ooms: 1 },
]

const chartConfig = {
  ooms: {
    label: "OOMs",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig

export default function OOMMetricDashboard() {
  return (
    <Card className="bg-gray-800 text-white-100">
      <CardHeader>
        <CardTitle>Metaspace OOMs - Daily Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="day"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="ooms" type="number" hide />
            {/* <ChartTooltip
              cursor={false}
              content={({ payload }) => (
                <ChartTooltipContent
                  indicator="line"
                  content={
                    payload && payload.length > 0
                      ? [
                          {
                            label: "OOMs",
                            value: payload[0].value as string,
                          },
                        ]
                      : []
                  }
                />
              )}
            /> */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
              }}
            />
            <Bar
              dataKey="ooms"
              layout="vertical"
              fill="var(--color-ooms)"
              radius={4}
            >
              <LabelList
                dataKey="day"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="ooms"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 15% this week <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total OOMs for each day of the week
        </div>
      </CardFooter>
    </Card>
  )
}