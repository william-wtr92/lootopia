import { render, screen } from "@testing-library/react"
import { MapPin } from "lucide-react"

import FeatureCard from "@client/web/components/landing/FeatureCard"

describe("FeatureCard", () => {
  it("renders title, description, and icon", () => {
    render(
      <FeatureCard
        icon={<MapPin data-testid="icon" />}
        title="Test Title"
        description="This is a description"
      />
    )

    expect(screen.getByText("Test Title")).toBeInTheDocument()
    expect(screen.getByText("This is a description")).toBeInTheDocument()
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })
})
