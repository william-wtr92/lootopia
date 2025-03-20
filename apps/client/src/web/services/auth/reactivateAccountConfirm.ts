import { client } from "@client/web/utils/client"

export const reactivateAccountConfirm = async ({ token }: { token: string }) => {
  const response = await client.auth["reactivate-account"].confirm.$post({
    query: {
      token
    }
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
