type PositionXY = {
  x: number
  y: number
}

type PositionLatLng = {
  lat: number
  lng: number
}

export const convertPositionToXy = (position: PositionLatLng): PositionXY => ({
  x: position.lng,
  y: position.lat,
})

export const convertPositionToLatLng = (
  position: PositionXY
): PositionLatLng => ({
  lng: position.x,
  lat: position.y,
})
