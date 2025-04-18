import { Button, Input } from "@lootopia/ui"
import { Search, X, Flag } from "lucide-react"
import { useTranslations } from "next-intl"

import ReportListItem from "@client/web/components/features/reports/list/ReportListItem"
import type { ReportResponse } from "@client/web/services/reports/getUserReportList"

type Props = {
  reports: ReportResponse[] | null
  selectedReport: ReportResponse | null
  onSelectReport: (report: ReportResponse) => void
  inputValue: string
  onInputChange: (value: string) => void
  inputRef: React.RefObject<HTMLInputElement | null>
  listContainerRef: React.RefObject<HTMLDivElement | null>
  listRef: React.RefObject<HTMLDivElement | null>
}

const ReportListSidebar = ({
  inputValue,
  onInputChange,
  inputRef,
  reports,
  selectedReport,
  onSelectReport,
  listContainerRef,
  listRef,
}: Props) => {
  const t = useTranslations("Components.Users.Reports.List.ReportListSidebar")

  return (
    <div className="border-primary/20 flex h-full w-1/2 flex-col border-r">
      <div className="border-primary/20 border-b p-2">
        <div className="flex items-center rounded-md bg-white/10 px-2 py-1">
          <Search className="text-primary mr-2 size-4" />
          <Input
            ref={inputRef}
            placeholder={t("placeholder")}
            className="text-primary placeholder:text-primary/50 w-full border-none bg-transparent outline-none ring-0 focus-visible:ring-0"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
          />
          {inputValue && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary size-5 rounded-full p-0"
              onClick={() => onInputChange("")}
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      </div>

      <div
        ref={listContainerRef}
        className="max-h-[450px] overflow-y-auto py-2"
      >
        {reports && reports?.length === 0 ? (
          <div
            key="empty"
            className="flex min-h-[370px] flex-col items-center justify-center p-6 text-center"
          >
            <Flag className="text-primary mb-4 size-12 opacity-30" />
            <p className="text-primary">
              {t("empty", {
                term: inputValue,
              })}
            </p>
          </div>
        ) : (
          reports?.map((reportDetails, i) => (
            <div key={i}>
              {reportDetails && (
                <ReportListItem
                  reportDetails={reportDetails}
                  selectedReport={selectedReport}
                  handleSelectReport={onSelectReport}
                />
              )}
            </div>
          ))
        )}
        <div id="sentinel" ref={listRef} className="h-1" />
      </div>
    </div>
  )
}

export default ReportListSidebar
