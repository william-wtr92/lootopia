import { create } from "zustand"

import { authTokenName } from "@client/utils/def/constants"
import { delCookie, getCookie, setCookie } from "@client/web/utils/cookie"

type AuthState = {
  token?: string
  setAuthToken: (token?: string) => void
  clearAuthToken: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: getCookie(authTokenName),
  setAuthToken: (token) => {
    if (token === undefined) {
      const newToken = getCookie(authTokenName)
      set({ token: newToken })
    } else {
      setCookie(authTokenName, token)
      set({ token })
    }
  },
  clearAuthToken: () => {
    delCookie(authTokenName)
    set({ token: undefined })
  },
}))
