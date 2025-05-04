import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import CookieConsent from "@client/web/components/utils/cookies/CookieConsent"

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: "We use cookies",
      description:
        "This website uses cookies to ensure you get the best experience.",
      "cta.accept": "Accept all",
      "cta.reject": "Reject all",
      "cta.personalize": "Personalize",
      "cta.save": "Save preferences",
    }

    return translations[key] || key
  },
}))

jest.mock("@client/web/hooks/useInitCookieConsent", () => ({
  // eslint-disable-next-line no-empty-function, @typescript-eslint/no-empty-function
  useInitCookieConsent: () => {},
}))

const mockAcceptAll = jest.fn()
const mockRejectAll = jest.fn()
const mockToggleDetails = jest.fn()

jest.mock("@client/web/store/useCookieConsentStore", () => {
  return {
    useCookieConsentStore: () => ({
      isVisible: true,
      setIsVisible: jest.fn(),
      showDetails: false,
      toggleDetails: mockToggleDetails,
      preferences: {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false,
      },
      setPreference: jest.fn(),
      acceptAll: mockAcceptAll,
      rejectAll: mockRejectAll,
      savePreferences: jest.fn(),
    }),
  }
})

describe("CookieConsent", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders cookie banner with expected texts", () => {
    render(<CookieConsent />)

    expect(screen.getByText("We use cookies")).toBeInTheDocument()
    expect(screen.getByText("Accept all")).toBeInTheDocument()
    expect(screen.getByText("Reject all")).toBeInTheDocument()
    expect(screen.getByText("Personalize")).toBeInTheDocument()
  })

  it("calls acceptAll when Accept button is clicked", async () => {
    render(<CookieConsent />)
    await userEvent.click(screen.getByText("Accept all"))
    expect(mockAcceptAll).toHaveBeenCalled()
  })

  it("calls rejectAll when Reject button is clicked", async () => {
    render(<CookieConsent />)
    await userEvent.click(screen.getByText("Reject all"))
    expect(mockRejectAll).toHaveBeenCalled()
  })
})
