import { useEffect } from "react"
import { createRoot } from "react-dom/client"

type Props = {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  L: typeof import("leaflet")
  map: L.Map
  position: L.ControlPosition
  onRecenter: () => void
}

const RecenterControl = ({ L, map, position, onRecenter }: Props) => {
  useEffect(() => {
    if (!map) {
      return
    }

    const RecenterButton = L.Control.extend({
      onAdd: () => {
        const container = L.DomUtil.create(
          "div",
          "leaflet-control recenter-control"
        )
        const root = createRoot(container)

        root.render(
          <button
            className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white shadow-md transition hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation()
              onRecenter()
            }}
          >
            📍
          </button>
        )

        return container
      },
    })

    const recenterControl = new RecenterButton({ position })
    recenterControl.addTo(map)

    return () => {
      recenterControl.remove()
    }
  }, [map, position, onRecenter, L])

  return null
}

export default RecenterControl
