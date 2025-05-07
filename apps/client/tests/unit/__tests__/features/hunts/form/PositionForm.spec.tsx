import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import PositionForm from "@client/web/components/features/hunts/form/PositionForm"

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      "lat.placeholder": "Latitude",
      "lng.placeholder": "Longitude",
      submit: "Submit",
    })[key] ?? key,
}))

describe("PositionForm", () => {
  it("submits valid coordinates", async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn()

    render(<PositionForm onSubmit={handleSubmit} />)

    const latInput = screen.getByPlaceholderText("Latitude")
    const lngInput = screen.getByPlaceholderText("Longitude")
    const submitButton = screen.getByRole("button", { name: "Submit" })

    expect(submitButton).toBeDisabled()

    await user.type(latInput, "48.8566")
    await user.type(lngInput, "2.3522")

    expect(submitButton).toBeEnabled()

    await user.click(submitButton)

    expect(handleSubmit).toHaveBeenCalledWith({ lat: "48.8566", lng: "2.3522" })
  })

  it("does not submit with invalid values", async () => {
    const user = userEvent.setup()
    const handleSubmit = jest.fn()

    render(<PositionForm onSubmit={handleSubmit} />)

    const latInput = screen.getByPlaceholderText("Latitude")
    const lngInput = screen.getByPlaceholderText("Longitude")
    const submitButton = screen.getByRole("button", { name: "Submit" })

    await user.type(latInput, "invalid")
    await user.type(lngInput, "value")

    expect(submitButton).toBeDisabled()
    expect(handleSubmit).not.toHaveBeenCalled()
  })
})
