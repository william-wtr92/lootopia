import { parsePosition, type PositionSchema } from "@lootopia/common"

export const isMovementSuspicious = (
  lastPosition: PositionSchema,
  currentPosition: PositionSchema,
  lastTimestamp: number,
  currentTimestamp: number,
  maxSpeedMps = 7
) => {
  const lastPositionParsed = parsePosition(lastPosition)
  const currentPositionParsed = parsePosition(currentPosition)

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180

  const R = 6371000

  const dLat = toRadians(currentPositionParsed.lat - lastPositionParsed.lat)
  const dLng = toRadians(currentPositionParsed.lng - lastPositionParsed.lng)

  const lat1 = toRadians(lastPositionParsed.lat)
  const lat2 = toRadians(currentPositionParsed.lat)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = R * c

  const timeDiffSeconds = (currentTimestamp - lastTimestamp) / 1000

  const MIN_MOVEMENT_DISTANCE = 100

  if (distance < MIN_MOVEMENT_DISTANCE) {
    return false
  }

  if (timeDiffSeconds === 0) {
    return true
  }

  const speed = distance / timeDiffSeconds

  return speed > maxSpeedMps
}
