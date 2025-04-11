import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.shop.packages.$get
type CrownPackageResponse = InferResponseType<typeof $get>
export type CrownPackage = Exclude<
  CrownPackageResponse["result"][number],
  string
>

export const getCrownPackages = async () => {
  const response = await $get()

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
