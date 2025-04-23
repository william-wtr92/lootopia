export const chartType = {
  line: "line",
  bar: "bar",
  pie: "pie",
} as const

export type ChartType = (typeof chartType)[keyof typeof chartType]
