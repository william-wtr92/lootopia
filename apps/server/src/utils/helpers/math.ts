// This function performs a cross product to calculate the percentage of progression
// from a previous value to the new one
export const computeProgressPercentage = (curr: number, prev: number) => {
  if (prev === 0) {
    return 0
  }

  const pct = ((curr - prev) / prev) * 100

  return parseFloat(pct.toFixed(2))
}

export const delta = (curr: number, prev: number) => curr - prev
