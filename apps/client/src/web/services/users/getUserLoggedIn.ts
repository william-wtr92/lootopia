import type { InferResponseType } from "hono"

import { client } from "@client/web/utils/client"

const $get = client.users.me.$get
export type UserLoggedInResponse = Exclude<
  InferResponseType<typeof $get>["result"],
  string
>

export const getUserLoggedIn =
  async (): Promise<UserLoggedInResponse | null> => {
    const response = await $get()

    if (response.ok) {
      const data = await response.json()

      return data.result
    }

    return null
  }
