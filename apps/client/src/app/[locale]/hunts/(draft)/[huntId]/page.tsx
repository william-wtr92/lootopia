"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

import HuntPage from "@client/web/components/features/hunts/HuntPage"
import { routes } from "@client/web/routes"
import { useHuntStore } from "@client/web/store/useHuntStore"

const EditHuntPage = () => {
  const { huntId } = useParams<{ huntId: string }>()
  const router = useRouter()
  const hunt = useHuntStore((state) => state.hunts[huntId])

  useEffect(() => {
    if (!hunt) {
      router.replace(routes.hunts.list)
    }
  }, [hunt, router])

  if (!hunt) {
    return null
  }

  return <HuntPage huntId={huntId} />
}

export default EditHuntPage
