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
import React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type ChartDataItem = {
  day: string;
  ooms: number;
  instances: Record<string, number>;
};

// TODO: Replace with actual data coming from the backend
const chartData = [
  { day: "Monday", ooms: 5, instances: { "unicorn-sparkle": 2, "dragon-breath": 3} },
  { day: "Tuesday", ooms: 8, instances: { "pixie-dust": 5, "mermaid-scale": 3} },
  { day: "Wednesday", ooms: 3, instances: { "wizard-whisker": 2, "phoenix-feather": 1} },
  { day: "Thursday", ooms: 6, instances: { "goblin-gold": 2, "fairy-floss": 4} },
  { day: "Friday", ooms: 4, instances: { "troll-toe": 2, "elf-ears": 2} },
  { day: "Saturday", ooms: 2, instances: { "centaur-hoof": 1, "griffin-claw": 1} },
  { day: "Sunday", ooms: 1, instances: { "kraken-ink": 1, "pegasus-wing": 0} },
]

const chartConfig = {
  ooms: {
    label: "OOM",
    color: "hsl(var(--chart-3))",
  },
  instances: {
    label: "Instances",
    color: "hsl(var(--chart-3))",
  },
  label: {
    color: "black",
  },
} satisfies ChartConfig

export default function OOMMetricDashboard() {
  return (
    <div className="flex gap-4">
      <Card className="bg-gray-800 text-white-100 w-1/2"> 
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
                right: 50,
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
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
                labelFormatter={(label) => (
                  <span style={{ fontStyle: "bold", fontSize: "14px", color: "black"}}>{label}</span>
                )}
                formatter={(value) => (
                  <span style={{ fontStyle: "bold",fontSize: "14px", color: "black"}}>{`${value} errors`}</span>
                )}
                wrapperStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '5px',
                }}
              />
              <Bar
                dataKey="ooms"
                layout="vertical"
                fill="var(--color-ooms)"
                radius={5}
                width={100}
              >
                <LabelList
                  dataKey="day"
                  position="insideLeft"
                  offset={8}
                  className="fill-[--color-label]"
                  fontSize={14}
                  style={{ fill: "white" }}
                />
                <LabelList
                  dataKey="ooms"
                  position="right"
                  offset={8}
                  style={{ fill: "white" }}
                  className="fill-foreground "
                  fontSize={15}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          
          <div className="flex gap-2 font-medium leading-none">
            Trending up/down by xx% this week <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total OOMs for each day of the week
          </div>
        </CardFooter>
      </Card>
      <Card className="bg-gray-800 text-white-100 w-1/2">
        <CardHeader><CardTitle>Metaspace OOMs By Instances</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Accordion type="single" collapsible className="w-full">
            {chartData.map((day) => (
              <AccordionItem key={day.day} value={day.day}>
                <AccordionTrigger className="flex justify-between">
                  <span>{day.day}:</span>
                  <span>{day.ooms} OOMs</span>
                </AccordionTrigger>
                <AccordionContent>
                  {Object.entries(day.instances).map(([instance, count], index, array) => (
                    <React.Fragment key={instance}>
                      {count} {instance}
                      {index < array.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}