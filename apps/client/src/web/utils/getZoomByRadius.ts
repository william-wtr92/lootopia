export const getZoomByRadius = (radius: number) => {
  if (radius > 12000) {
    return 9
  }

  if (radius > 7000) {
    return 10
  }

  if (radius > 3000) {
    return 11
  }

  return 12
}
