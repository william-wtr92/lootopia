import { render } from "@testing-library/react"

import OtpDisplay from "@client/web/components/features/users/profile/mfa/OtpDisplay"

describe("OtpDisplay", () => {
  it("displays 6 empty cells when otp is empty", () => {
    const { container } = render(<OtpDisplay otp="" />)
    const cells = container.querySelectorAll("div.flex.h-12")
    expect(cells.length).toBe(6)
  })

  it("renders digits of the OTP in the correct order", () => {
    const otp = "135790"
    const { getByText } = render(<OtpDisplay otp={otp} />)

    for (const digit of otp) {
      expect(getByText(digit)).toBeInTheDocument()
    }
  })
})
