import type { PositionCords } from "@lootopia/common"

/**
 * Function to calculate the distance in meters between two geographical points (Haversine formula).
 * @param p1 PositionCords 1 { lat, lng }
 * @param p2 PositionCords 2 { lat, lng }
 * @returns Distance in meters
 */
const haversineDistance = (p1: PositionCords, p2: PositionCords): number => {
  const R = 6371e3
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(p2.lat - p1.lat)
  const dLng = toRad(p2.lng - p1.lng)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(p1.lat)) *
      Math.cos(toRad(p2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Function to calculate the center and radius of the hunting area.
 * @param chests List of chests [{ lat, lng }]
 * @returns { center: PositionCords, radius: number } (center and radius of the hunting area)
 */
export const calculateHuntRange = (chests: PositionCords[]) => {
  if (chests.length === 0) {
    return { center: null, radius: 0 }
  }

  const avgLat = chests.reduce((sum, c) => sum + c.lat, 0) / chests.length
  const avgLng = chests.reduce((sum, c) => sum + c.lng, 0) / chests.length
  const center = { lat: avgLat, lng: avgLng }

  const distances = chests.map((c) => ({
    chest: c,
    distance: haversineDistance(center, c),
  }))

  const maxChest = distances.reduce((max, current) =>
    current.distance > max.distance ? current : max
  )

  const radius = maxChest.distance * 1.2

  return { center, radius }
}
