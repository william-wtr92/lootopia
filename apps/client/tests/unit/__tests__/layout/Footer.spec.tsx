import { render, screen } from "@testing-library/react"

import Footer from "@client/web/components/layout/Footer"

jest.mock("next-intl", () => ({
  useTranslations: () => () => `© Mocked year`,
}))

describe("Footer", () => {
  it("renders the footer with the current year", () => {
    render(<Footer />)

    expect(screen.getByText(/© Mocked year/i)).toBeInTheDocument()
  })
})
