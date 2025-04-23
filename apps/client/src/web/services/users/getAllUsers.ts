import { client } from "@client/web/utils/client"

export const getAllUsers = async () => {
  const response = await client.admins.users.$get({
    param: query,
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`Erreur lors de la récupération des utilisateurs : ${errorData}`)
  }

  const data = await response.json()
  return data.result
}
