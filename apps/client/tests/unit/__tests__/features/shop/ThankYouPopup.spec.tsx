import { crownPackageName } from "@lootopia/common"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import ThankYouPopup from "@client/web/components/features/shop/ThankYouPopup"
import type { CrownPackage } from "@client/web/services/shop/getCrownPackages"

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      title: "Thank you!",
      subtitle: "Enjoy your crowns",
      description: "You've purchased the Starter Pack package.",
      "cta.continue": "Continue",
      bonus: "10 bonus crowns",
      "names.starterPack": "Starter Pack",
    }

    return translations[key] ?? key
  },
}))

jest.mock("@client/web/hooks/useConfetti", () => ({
  useConfetti: jest.fn(),
}))

const mockPackage = {
  name: crownPackageName.starterPack,
  id: "mock-id",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
  crowns: 100,
  price: "4.99",
  discount: null,
  bonus: null,
  popular: false,
} as CrownPackage

describe("ThankYouPopup", () => {
  it("renders title, crown count, and close button", async () => {
    const onClose = jest.fn()

    render(
      <ThankYouPopup
        isOpen={true}
        onClose={onClose}
        crownPackage={mockPackage}
      />
    )

    expect(screen.getByText("Thank you!")).toBeInTheDocument()
    expect(screen.getByText("Enjoy your crowns")).toBeInTheDocument()
    expect(
      screen.getByText("You've purchased the Starter Pack package.")
    ).toBeInTheDocument()
    expect(screen.getByText("100")).toBeInTheDocument()
    expect(screen.getByText("Continue")).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "Continue" }))
    expect(onClose).toHaveBeenCalled()
  })
})
