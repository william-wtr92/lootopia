import type { PackageIdSchema } from "@lootopia/common"

import { client } from "@client/web/utils/client"

export const paymentCheckout = async (query: PackageIdSchema) => {
  const response = await client.shop.checkout[":packageId"].$post({
    param: query,
  })

  if (response.ok) {
    const data = await response.json()

    return [response.ok, data.result]
  }

  return [response.ok, (await response.json()).key]
}
