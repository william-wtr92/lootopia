import { crownPackageName } from "@lootopia/common"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import CrownPackageCard from "@client/web/components/features/shop/CrownPackageCard"

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      popular: "Most Popular",
      discount: "20% off",
      "names.starter_pack": "Starter Pack",
      discountedPrice: "$9.99",
      price: "$12.49",
      bonus: "10 bonus crowns",
      instantDelivery: "Instant delivery",
      singlePurchase: "One-time purchase",
      "cta.buy": "Buy now",
    }

    return translations[key] || key
  },
}))

const mockPackage = {
  name: crownPackageName.starterPack,
  id: "pkg-id",
  createdAt: "",
  updatedAt: "",
  crowns: 100,
  price: "9.99",
  discount: 20,
  bonus: 10,
  popular: true,
} as const

describe("CrownPackageCard", () => {
  it("renders package info and handles selection and purchase", async () => {
    const onSelect = jest.fn()
    const onPurchase = jest.fn()

    render(
      <CrownPackageCard
        package={mockPackage}
        isSelected={false}
        onSelect={onSelect}
        onPurchase={onPurchase}
      />
    )

    expect(screen.getByText("Most Popular")).toBeInTheDocument()
    expect(screen.getByText("Starter Pack")).toBeInTheDocument()
    expect(screen.getByText("$9.99")).toBeInTheDocument()
    expect(screen.getByText("100")).toBeInTheDocument()
    expect(screen.getByText("10 bonus crowns")).toBeInTheDocument()
    expect(screen.getByText("Instant delivery")).toBeInTheDocument()
    expect(screen.getByText("One-time purchase")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Buy now" })).toBeInTheDocument()

    await userEvent.click(screen.getByRole("button", { name: "Buy now" }))
    expect(onPurchase).toHaveBeenCalled()

    await userEvent.click(screen.getByText("Starter Pack"))
    expect(onSelect).toHaveBeenCalled()
  })
})
