import { render, screen, fireEvent, waitFor } from "@testing-library/react"

import { useRouter } from "@client/i18n/routing"
import SelectLocale from "@client/web/components/utils/SelectLocale"

jest.mock("next-intl", () => ({
  useTranslations:
    () =>
    (_key: string, { locale }: { locale: string }) =>
      locale === "fr" ? "Français" : "English",
  useLocale: () => "en",
}))

jest.mock("@client/i18n/routing", () => ({
  useRouter: jest.fn(),
  usePathname: () => "/",
  useParams: () => ({}),
  locales: ["en", "fr"],
}))

describe("SelectLocale", () => {
  it("renders both locales", async () => {
    render(<SelectLocale />)

    fireEvent.click(screen.getByRole("combobox"))

    await waitFor(() => {
      expect(screen.getByText("English")).toBeInTheDocument()
      expect(screen.getByText("Français")).toBeInTheDocument()
    })
  })

  it("calls router.replace when selecting another locale", async () => {
    const mockReplace = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValueOnce({ replace: mockReplace })

    render(<SelectLocale />)

    fireEvent.click(screen.getByRole("combobox"))
    fireEvent.click(screen.getByText("Français"))

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled()
    })
  })
})
