"use client"

import type { RegisterSchema } from "@lootopia/common"
import type { ParsedFormValue } from "hono/types"

import { client } from "@client/web/utils/client"

export const register = async (data: RegisterSchema) => {
  const response = await client.auth.register.$post({
    form: {
      email: data.email,
      nickname: data.nickname,
      phone: data.phone,
      avatar: data.avatar,
      password: data.password,
      confirmPassword: data.confirmPassword,
      birthdate: data.birthdate,
      gdprValidated: data.gdprValidated as unknown as ParsedFormValue,
    },
  })

  if (response.ok) {
    const data = await response.json()

    return data.result
  }

  return null
}
