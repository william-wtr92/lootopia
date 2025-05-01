import { render, screen } from "@testing-library/react"

import Loader from "@client/web/components/utils/Loader"

describe("Loader", () => {
  it("renders without label", () => {
    render(<Loader />)

    const loaderCircle = document.querySelector(".lds-circle")
    expect(loaderCircle).toBeInTheDocument()

    expect(screen.queryByText(/.+/)).not.toBeInTheDocument()
  })

  it("renders with a label", () => {
    render(<Loader label="Loading loot..." />)

    expect(screen.getByText("Loading loot...")).toBeInTheDocument()
  })
})
