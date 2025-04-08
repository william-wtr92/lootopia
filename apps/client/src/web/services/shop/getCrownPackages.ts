import { client } from "@client/web/utils/client"

export const getCrownPackages = async () => {
  const response = await client.shop.packages.$get()

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
