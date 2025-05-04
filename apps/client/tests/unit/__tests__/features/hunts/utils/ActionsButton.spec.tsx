import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import ActionsButton from "@client/web/components/features/hunts/utils/ActionsButton"

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      saveDraft: "Save Draft",
      submit: "Submit",
      crownsAmount: "x5",
    })[key] ?? key,
}))

describe("ActionsButton", () => {
  it("renders buttons and triggers handlers", async () => {
    const handleDraftSave = jest.fn()
    const handleSubmitAll = jest.fn()

    render(
      <ActionsButton
        handleDraftSave={handleDraftSave}
        handleSubmitAll={handleSubmitAll}
        isValid={true}
      />
    )

    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(2)

    expect(screen.getByText("Save Draft")).toBeInTheDocument()
    expect(screen.getByText("Submit")).toBeInTheDocument()
    expect(screen.getByText("x5")).toBeInTheDocument()

    await userEvent.click(buttons[0])
    await userEvent.click(buttons[1])

    expect(handleDraftSave).toHaveBeenCalled()
    expect(handleSubmitAll).toHaveBeenCalled()
  })

  it("disables buttons when form is invalid", () => {
    render(
      <ActionsButton
        handleDraftSave={jest.fn()}
        handleSubmitAll={jest.fn()}
        isValid={false}
      />
    )

    const buttons = screen.getAllByRole("button")
    expect(buttons[0]).toBeDisabled()
    expect(buttons[1]).toBeDisabled()
  })
})
