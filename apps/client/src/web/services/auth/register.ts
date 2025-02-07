"use client"

import type { RegisterSchema } from "@lootopia/common"
import type { ParsedFormValue } from "hono/types"

import { client } from "@client/web/utils/client"

export const register = async (body: RegisterSchema) => {
  const response = await client.auth.register.$post({
    form: {
      email: body.email,
      nickname: body.nickname,
      phone: body.phone,
      avatar: body.avatar,
      password: body.password,
      confirmPassword: body.confirmPassword,
      birthdate: body.birthdate,
      gdprValidated: body.gdprValidated as unknown as ParsedFormValue,
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return [response.ok, (await response.json()).key]
}
