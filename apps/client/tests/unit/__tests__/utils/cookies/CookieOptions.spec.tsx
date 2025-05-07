import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Shield } from "lucide-react"

import CookieOption from "@client/web/components/utils/cookies/CookieOption"

describe("CookieOption", () => {
  const defaultProps = {
    id: "analytics",
    title: "Analytics Cookies",
    description: "Helps us understand how you use our site.",
    checked: false,
    onChange: jest.fn(),
    icon: <Shield data-testid="icon" />,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the title, description and icon", () => {
    render(<CookieOption {...defaultProps} />)

    expect(screen.getByText("Analytics Cookies")).toBeInTheDocument()
    expect(
      screen.getByText("Helps us understand how you use our site.")
    ).toBeInTheDocument()
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })

  it("calls onChange when checkbox is clicked", async () => {
    const user = userEvent.setup()
    render(<CookieOption {...defaultProps} />)

    const checkbox = screen.getByRole("checkbox")
    await user.click(checkbox)

    expect(defaultProps.onChange).toHaveBeenCalledWith(true)
  })

  it("disables the checkbox when disabled is true", () => {
    render(<CookieOption {...defaultProps} disabled={true} />)

    const checkbox = screen.getByRole("checkbox")
    expect(checkbox).toBeDisabled()
  })
})
