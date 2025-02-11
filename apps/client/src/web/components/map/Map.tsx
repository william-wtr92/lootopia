import type { ChestSchema, PositionCords } from "@lootopia/common"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

import MapEvents from "./MapEvents"
import AlertDeleteChest from "./utils/AlertDeleteChest"
import RecenterControl from "./utils/RecenterControl"
import { leafletDef } from "@client/utils/def/leaflet"
import { calculateHuntRange } from "@client/utils/helpers/calculateHuntRange"
import { useHuntStore } from "@client/web/store/useHuntStore"

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
})

const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  {
    ssr: false,
  }
)

type Props = {
  map: L.Map | null
  setMap: (map: L.Map) => void
  chests: ChestSchema[]
}

const Map = ({ map, setMap, chests }: Props) => {
  const {
    activeHuntId,
    position,
    isSheetOpen,
    setIsSheetOpen,
    setCurrentChest,
    setPosition,
    removeChest,
  } = useHuntStore()

  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const [L, setL] = useState<typeof import("leaflet") | null>(null)
  const [customMarker, setCustomMarker] = useState<L.Icon>()
  const [chestMarker, setChestMarker] = useState<L.Icon>()

  const [huntCenter, setHuntCenter] = useState<PositionCords | null>(null)
  const [huntRadius, setHuntRadius] = useState<number>(0)

  const handleDeleteChest = (chestId: string | undefined) => {
    if (activeHuntId && chestId) {
      removeChest(activeHuntId, chestId)
      setCurrentChest(null)
      setIsSheetOpen(false)
    }
  }

  useEffect(() => {
    import("leaflet").then((L) => {
      setL(L)
      setCustomMarker(
        L.icon({
          iconUrl: leafletDef.userIconUrl,
          iconSize: [25, 41],
          iconAnchor: [13, 41],
        })
      )
      setChestMarker(
        L.icon({
          iconUrl: leafletDef.chestIconUrl,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        })
      )
    })

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      })
    }
  }, [setPosition, position])

  useEffect(() => {
    if (chests.length >= 1) {
      const chestPoints = chests.map((chest) => ({
        lat: chest.position.lat,
        lng: chest.position.lng,
      }))
      const { center, radius } = calculateHuntRange(chestPoints)

      setHuntCenter(center)
      setHuntRadius(radius)
    } else {
      setHuntCenter(null)
      setHuntRadius(0)
    }
  }, [chests])

  if (!L || !customMarker || !chestMarker) {
    return <p className="mt-4 text-center">Chargement de la carte...</p>
  }

  return (
    <MapContainer
      className={`mx-auto h-[75vh] w-full rounded-md ${isSheetOpen ? "z-0" : "z-10"}`}
      center={position}
      zoom={11}
      scrollWheelZoom={false}
      attributionControl={false}
      ref={setMap}
    >
      <TileLayer
        attribution={leafletDef.attribution}
        url={leafletDef.layerUrl}
      />

      {map && (
        <RecenterControl
          L={L}
          map={map}
          position="bottomleft"
          onRecenter={() => map.flyTo(position, 16, { duration: 2 })}
        />
      )}

      <Marker position={position} icon={customMarker}>
        <Popup>Point névralgique de la chasse</Popup>
      </Marker>

      {chests.map((chest) => (
        <Marker key={chest.id} position={chest.position} icon={chestMarker}>
          <Popup>
            <AlertDeleteChest
              chest={chest}
              onDelete={() => handleDeleteChest(chest.id)}
            />
          </Popup>
        </Marker>
      ))}

      {huntCenter && huntRadius > 0 && (
        <Circle
          center={huntCenter}
          radius={huntRadius}
          color="#ffd700"
          fillOpacity={0.2}
        />
      )}

      <MapEvents
        setIsSheetOpen={setIsSheetOpen}
        setCurrentChest={setCurrentChest}
      />
    </MapContainer>
  )
}

export default Map
