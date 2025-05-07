import { artifactRarity } from "@lootopia/common"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import SelectArtifactRarity from "@client/web/components/features/artifacts/utils/SelectArtifactRarity"

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      trigger: "Filter by rarity",
      "options.all": "All",
      "options.common": "Common",
      "options.uncommon": "Uncommon",
      "options.rare": "Rare",
      "options.epic": "Epic",
      "options.legendary": "Legendary",
    })[key] ?? key,
}))

describe("SelectArtifactRarity", () => {
  it("renders with default value and allows selection", async () => {
    const user = userEvent.setup()
    const setSelectedRarity = jest.fn()

    render(
      <SelectArtifactRarity
        selectedRarity="all"
        setSelectedRarity={setSelectedRarity}
      />
    )

    expect(screen.getByText("All")).toBeInTheDocument()

    await user.click(screen.getByRole("combobox"))

    const legendaryOption = await screen.findByText("Legendary")
    await user.click(legendaryOption)

    expect(setSelectedRarity).toHaveBeenCalledWith(artifactRarity.legendary)
  })
})
