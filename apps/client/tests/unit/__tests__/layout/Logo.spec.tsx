import { render, screen } from "@testing-library/react"

import Logo from "@client/web/components/layout/Logo"

describe("Logo", () => {
  it("renders correctly with given width and height", () => {
    render(<Logo width={200} height={200} />)

    const svg = screen.getByRole("img", { hidden: true })

    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("width", "200")
    expect(svg).toHaveAttribute("height", "200")
    expect(svg.textContent).toMatch(/LOOTOPIA/i)
  })
})
