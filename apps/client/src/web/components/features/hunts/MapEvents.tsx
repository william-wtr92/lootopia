import type { ChestSchema } from "@lootopia/common"
import { useMapEvents } from "react-leaflet"
import { v4 as uuid } from "uuid"

import { convertPositionToXy } from "@client/web/utils/convertPosition"

type Props = {
  setIsSheetOpen: (isOpen: boolean) => void
  setCurrentChest: (chest: ChestSchema) => void
}

const MapEvents = ({ setIsSheetOpen, setCurrentChest }: Props) => {
  useMapEvents({
    click(e) {
      const newChest: ChestSchema = {
        id: uuid(),
        position: convertPositionToXy(e.latlng),
        size: 80,
        maxUsers: 1,
        visibility: false,
        description: "",
        reward: "",
      }

      setCurrentChest(newChest)
      setIsSheetOpen(true)
      e.originalEvent.stopPropagation()
    },
  })

  return null
}

export default MapEvents
