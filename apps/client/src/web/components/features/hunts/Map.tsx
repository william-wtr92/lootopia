/* eslint-disable complexity */
import {
  type ChestSchema,
  type PositionCords,
  calculateHuntRange,
} from "@lootopia/common"
import type { LatLngExpression } from "leaflet"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import MapEvents from "./MapEvents"
import AlertDeleteChest from "./utils/AlertDeleteChest"
import RecenterControl from "./utils/RecenterControl"
import { fredoka } from "@client/app/[locale]/layout"
import { leafletDef } from "@client/utils/def/leaflet"
import { getZoomByRadius } from "@client/utils/helpers/getZoomByRadius"
import { useHuntStore } from "@client/web/store/useHuntStore"
import { convertPositionToLatLng } from "@client/web/utils/convertPosition"

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
  heightClass?: string
  widthClass?: string
  centerOnHuntRadius?: boolean
  displayChests?: boolean
  canDeleteChest?: boolean
}

const Map = ({
  map,
  setMap,
  chests,
  heightClass = "h-full",
  widthClass = "w-full",
  centerOnHuntRadius = false,
  displayChests = false,
  canDeleteChest = false,
}: Props) => {
  const t = useTranslations("Components.Hunts.Map")

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
  const [center, setCenter] = useState<LatLngExpression | undefined>(undefined)
  const [zoom, setZoom] = useState<number>(0)

  const [huntCenter, setHuntCenter] = useState<PositionCords | null>(null)
  const [huntRadius, setHuntRadius] = useState<number>(0)

  const handleDeleteChest = (chestId: string | undefined) => {
    if (activeHuntId && chestId) {
      removeChest(activeHuntId, chestId)
      setCurrentChest(null)
      setIsSheetOpen(false)
    }
  }

  const handleRecenter = () => {
    if (map) {
      map.flyTo(position, 16, { duration: 2 })
    }
  }

  useEffect(() => {
    if (!map) {
      return
    }

    const container = map.getContainer()

    const stopPropagation = (e: Event) => {
      e.stopPropagation()
    }

    container.addEventListener("click", stopPropagation)

    return () => {
      container.removeEventListener("click", stopPropagation)
    }
  }, [map])

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
          popupAnchor: [0, -18],
        })
      )
    })
  }, [setPosition, position])

  useEffect(() => {
    if (chests.length >= 1) {
      const chestPoints = chests.map((chest) =>
        convertPositionToLatLng(chest.position)
      )
      const { center, radius } = calculateHuntRange(chestPoints)

      setZoom(getZoomByRadius(radius))
      setHuntCenter(center)
      setHuntRadius(radius)
    } else {
      setHuntCenter(null)
      setHuntRadius(0)
    }
  }, [chests])

  useEffect(() => {
    if (huntCenter !== null) {
      const centerPosition = {
        lat: huntCenter.lat,
        lng: huntCenter.lng,
      }

      setCenter(centerPosition)
    }
  }, [huntCenter, position])

  if (!L || !customMarker || !chestMarker || (centerOnHuntRadius && !center)) {
    return <p className="mt-4 text-center">{t("loading")}</p>
  }

  return (
    <MapContainer
      className={`rounded-md ${isSheetOpen ? "z-0" : "z-10"} ${heightClass} ${widthClass}`}
      center={centerOnHuntRadius ? center : position}
      zoom={zoom}
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
          onRecenter={handleRecenter}
        />
      )}

      <Marker position={position} icon={customMarker}>
        <Popup>{t("marker")}</Popup>
      </Marker>

      {chests.map((chest) => {
        const position = convertPositionToLatLng(chest.position)

        if ((!displayChests && chest.visibility) || displayChests) {
          return (
            <Marker key={chest.id} position={position} icon={chestMarker}>
              <Popup className={`bg-primaryBg ${fredoka.className}`}>
                <div className="flex flex-col justify-center gap-2">
                  <span className="text-primary text-center text-base font-semibold">
                    {chest.description}
                  </span>
                  <span className="text-secondary text-center text-sm">
                    <span className="text-primary">{t("reward")} :</span>{" "}
                    {chest.reward}
                  </span>

                  {canDeleteChest && (
                    <AlertDeleteChest
                      chest={chest}
                      onDelete={() => handleDeleteChest(chest.id)}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          )
        }
      })}

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
