export const generateCsvFromObjects = <T extends object>(
  items: T[],
  columns: (keyof T)[]
): string => {
  const headers = columns.map((col) => col.toString())

  const rows = items.map((item) =>
    columns.map((col) => {
      const value = item[col]

      if (typeof value === "string") {
        return `"${value.replace(/"/g, '""')}"`
      }

      if (value instanceof Date) {
        return value.toISOString()
      }

      return value != null ? value.toString() : ""
    })
  )

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")

  return csv
}
