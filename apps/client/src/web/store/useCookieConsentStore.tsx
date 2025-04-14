import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type Preferences = {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

type CookieConsentStore = {
  isVisible: boolean
  showDetails: boolean
  preferences: Preferences
  setIsVisible: (visible: boolean) => void
  toggleDetails: () => void
  acceptAll: () => void
  rejectAll: () => void
  savePreferences: (prefs?: Preferences) => void
  setPreference: (key: keyof Preferences, value: boolean) => void
}

export const useCookieConsentStore = create<CookieConsentStore>()(
  persist(
    (set) => ({
      isVisible: false,
      showDetails: false,
      preferences: {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      },
      setIsVisible: (visible) => set({ isVisible: visible }),
      toggleDetails: () =>
        set((state) => ({ showDetails: !state.showDetails })),
      acceptAll: () =>
        set(() => ({
          preferences: {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true,
          },
          isVisible: false,
        })),
      rejectAll: () =>
        set(() => ({
          preferences: {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
          },
          isVisible: false,
        })),
      savePreferences: (prefs) =>
        set((state) => ({
          preferences: prefs ?? state.preferences,
          isVisible: false,
        })),
      setPreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        })),
    }),
    {
      name: "cookie-consent",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
)
