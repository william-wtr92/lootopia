import { client } from "@client/web/utils/client"

export const getPaymentsExport = async () => {
  const response = await client.shop.payments.export.$get()

  if (response.ok) {
    const data = await response.json()

    return [response.ok, data.result]
  }

  return [response.ok, (await response.json()).key]
}
