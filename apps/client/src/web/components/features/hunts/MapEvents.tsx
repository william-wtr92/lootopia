import type { ChestSchema } from "@lootopia/common"
import { useMapEvents } from "react-leaflet"
import { v4 as uuid } from "uuid"

type Props = {
  setIsSheetOpen: (isOpen: boolean) => void
  setCurrentChest: (chest: ChestSchema) => void
}

const MapEvents = ({ setIsSheetOpen, setCurrentChest }: Props) => {
  useMapEvents({
    click(e) {
      const newChest: ChestSchema = {
        id: uuid(),
        position: { lat: e.latlng.lat, lng: e.latlng.lng },
        size: 80,
        maxUsers: 1,
        visibility: false,
        description: "",
        rewardType: "crown",
        reward: "",
      }

      setCurrentChest(newChest)
      setIsSheetOpen(true)
    },
  })

  return null
}

export default MapEvents
