export const variation = (curr: number, prev: number) => {
  if (prev === 0) {
    return null
  }

  return ((curr - prev) / prev) * 100
}

export const delta = (curr: number, prev: number) => curr - prev
