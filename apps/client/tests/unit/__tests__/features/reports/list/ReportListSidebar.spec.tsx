import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import ReportListSidebar from "@client/web/components/features/reports/list/ReportListSidebar"
import type { ReportResponse } from "@client/web/services/reports/getUserReportList"

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) =>
    ({
      placeholder: "Search reports...",
      empty: "No reports found",
    })[key] ?? key,
  useLocale: () => "en",
}))

describe("ReportListSidebar", () => {
  const reports: ReportResponse[] = [
    {
      report: {
        id: "report-1",
        status: "pending",
        description: "Description 1",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
        reason: "inappropriate_behavior",
        attachment: null,
        reporterId: "user-1",
        reportedId: "user-2",
      },
      reporterUser: null,
      reportedUser: null,
    },
  ]

  const setup = (overrideProps = {}) => {
    const onSelectReport = jest.fn()
    const onInputChange = jest.fn()
    const inputRef = { current: null }
    const listRef = { current: null }
    const listContainerRef = { current: null }

    render(
      <ReportListSidebar
        reports={reports}
        selectedReport={null}
        onSelectReport={onSelectReport}
        inputValue=""
        onInputChange={onInputChange}
        inputRef={inputRef}
        listRef={listRef}
        listContainerRef={listContainerRef}
        {...overrideProps}
      />
    )

    return { onSelectReport, onInputChange }
  }

  it("renders input and list", () => {
    setup()

    expect(screen.getByPlaceholderText("Search reports...")).toBeInTheDocument()
    expect(screen.getByText("Description 1")).toBeInTheDocument()
  })

  it("filters input value and triggers clear button", async () => {
    const user = userEvent.setup()
    const onInputChange = jest.fn()

    setup({ inputValue: "query", onInputChange })

    expect(screen.getByDisplayValue("query")).toBeInTheDocument()
    await user.click(screen.getByRole("button"))
    expect(onInputChange).toHaveBeenCalledWith("")
  })

  it("shows empty message when no reports", () => {
    setup({ reports: [] })
    expect(screen.getByText("No reports found")).toBeInTheDocument()
  })
})
