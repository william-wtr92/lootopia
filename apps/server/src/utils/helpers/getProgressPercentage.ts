// This function performs a cross product to calculate the percentage of progression
// from a previous value to the new one
export const computeProgressPercentage = (
  multiplyValue: number,
  divideValue: number
) => {
  return Number.parseFloat(
    ((100 * multiplyValue) / divideValue - 100).toFixed(2)
  )
}
