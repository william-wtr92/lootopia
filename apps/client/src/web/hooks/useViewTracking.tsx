import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"

import { viewOffer } from "@client/web/services/town-hall/views/viewOffer"

type UseViewTrackingProps = {
  offerId: string
}

const seenOffers = new Set<string>()

export const useViewTracking = ({ offerId }: UseViewTrackingProps) => {
  const { mutate: createView } = useMutation({
    mutationFn: () => viewOffer({ offerId }),
  })

  useEffect(() => {
    if (!offerId || seenOffers.has(offerId)) {
      return
    }

    seenOffers.add(offerId)
    createView()
  }, [offerId, createView])
}
