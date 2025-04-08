export const calculateDiscountedPrice = (
  originalPrice: number,
  discount?: number
) => {
  if (!discount) {
    return originalPrice
  }

  return +(originalPrice * (1 - discount / 100)).toFixed(2)
}
