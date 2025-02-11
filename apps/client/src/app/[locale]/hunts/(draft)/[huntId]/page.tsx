"use client"

import { useParams, notFound } from "next/navigation"

import HuntPage from "@client/web/components/pages/HuntPage"
import { useHuntStore } from "@client/web/store/useHuntStore"

const EditHuntPage = () => {
  const { huntId } = useParams<{ huntId: string }>()
  const hunt = useHuntStore((state) => state.hunts[huntId])

  if (!hunt) {
    notFound()
  }

  return <HuntPage huntId={huntId} />
}

export default EditHuntPage
