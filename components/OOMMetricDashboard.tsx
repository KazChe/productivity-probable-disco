"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

// Simplified Card components
const Card = ({ children, className = "" }) => (
  <div className={`bg-gray-800 text-gray-100 rounded-lg shadow-lg ${className}`}>{children}</div>
)
const CardHeader = ({ children }) => <div className="p-4 border-b border-gray-700">{children}</div>
const CardTitle = ({ children }) => <h2 className="text-xl font-semibold">{children}</h2>
const CardContent = ({ children }) => <div className="p-4">{children}</div>
const CardFooter = ({ children, className = "" }) => (
  <div className={`p-4 border-t border-gray-700 ${className}`}>{children}</div>
)

// Simplified Chart components
const ChartContainer = ({ children, config }) => (
  <div className="w-full h-64">{children}</div>
)
const ChartTooltip = ({ cursor, content }) => content
const ChartTooltipContent = ({ indicator, content }) => (
  <div className="bg-gray-900 p-2 rounded shadow">
    {content.map((item, index) => (
      <div key={index}>
        {item.label}: {item.value}
      </div>
    ))}
  </div>
)

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
    color: "hsl(215, 70%, 60%)",
  },
  label: {
    color: "hsl(0, 0%, 100%)",
  },
}

export default function OOMMetricDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metaspace OOMs - Daily Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            width={600}
            height={300}
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="day"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="ooms" type="number" />
            <ChartTooltip
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
            />
            <Bar
              dataKey="ooms"
              fill={chartConfig.ooms.color}
              radius={4}
            >
              <LabelList
                dataKey="day"
                position="insideLeft"
                fill={chartConfig.label.color}
                fontSize={12}
              />
              <LabelList
                dataKey="ooms"
                position="right"
                fill={chartConfig.label.color}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium">
          Trending up by 15% this week <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-gray-400">
          Showing total OOMs for each day of the week
        </div>
      </CardFooter>
    </Card>
  )
}