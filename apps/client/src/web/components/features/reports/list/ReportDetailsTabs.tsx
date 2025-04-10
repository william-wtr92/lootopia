import type { ReportReason } from "@lootopia/common"
import {
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from "@lootopia/ui"
import {
  AlertTriangle,
  Calendar,
  ExternalLink,
  FileText,
  User,
} from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { config } from "@client/env"
import { Link } from "@client/i18n/routing"
import { routes } from "@client/web/routes"
import type { ReportResponse } from "@client/web/services/reports/getUserReportList"
import { formatDate } from "@client/web/utils/formatDate"

type Props = {
  selectedReport: ReportResponse
}

const ReportDetailsTabs = ({ selectedReport }: Props) => {
  const t = useTranslations("Components.Users.Reports.List.ReportDetailsTabs")

  const handleOpenAttachement = (attachment: string) => {
    window.open(config.blobUrl + attachment, "_blank")
  }

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <h3 className="text-primary text-xl font-bold">{t("title")}</h3>
        <Badge
          className={`${getReasonColor(selectedReport.report.reason)} text-white`}
        >
          {t(`content.report.reasons.options.${selectedReport.report.reason}`)}
        </Badge>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-primary text-accent w-full">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-accent data-[state=active]:text-primary flex-1"
            >
              {t("tabs.details")}
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-accent data-[state=active]:text-primary flex-1"
            >
              {t("tabs.users")}
            </TabsTrigger>
            {selectedReport.report.attachment && (
              <TabsTrigger
                value="attachment"
                className="data-[state=active]:bg-accent data-[state=active]:text-primary flex-1"
              >
                {t("tabs.attachment")}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="space-y-2">
              <div className="text-secondary flex items-center text-sm">
                <AlertTriangle className="text-accent mr-2 size-4" />
                <span className="font-medium">
                  {t("content.report.reasons.label")}
                </span>
              </div>
              <p className="text-primary pl-6">
                {t(
                  `content.report.reasons.options.${selectedReport.report.reason}`
                )}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-secondary flex items-center text-sm">
                <FileText className="text-accent mr-2 size-4" />
                <span className="font-medium">
                  {t("content.report.description")}
                </span>
              </div>
              <p className="text-primary pl-6">
                {selectedReport.report.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-secondary flex items-center text-sm">
                <Calendar className="text-accent mr-2 size-4" />
                <span className="font-medium">
                  {t("content.report.createdAt")}
                </span>
              </div>
              <p className="text-primary pl-6">
                {formatDate(selectedReport.report.createdAt)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-secondary flex items-center text-sm">
                <Calendar className="text-accent mr-2 size-4" />
                <span className="font-medium">
                  {t("content.report.updatedAt")}
                </span>
              </div>
              <p className="text-primary pl-6">
                {formatDate(selectedReport.report.updatedAt)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-secondary flex items-center text-sm">
                <AlertTriangle className="text-accent mr-2 size-4" />
                <span className="font-medium">
                  {t("content.report.status.title")}
                </span>
              </div>
              <p className="text-primary pl-6">
                {t(`content.report.status.${selectedReport.report.status}`)}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-4 space-y-6">
            <div className="space-y-4">
              <div className="text-secondary mb-2 flex items-center text-sm">
                <User className="text-accent mr-2 size-4" />
                <span className="font-medium">
                  {t("content.reporter.title")}
                </span>
              </div>
              {selectedReport.reporterUser ? (
                <div className="bg-primary/5 flex items-center space-x-4 rounded-lg p-4">
                  <Avatar className="border-primary border-2">
                    <AvatarImage
                      src={config.blobUrl + selectedReport.reporterUser.avatar}
                      alt="Avatar"
                    />
                    <AvatarFallback className="bg-primary text-accent">
                      {selectedReport.reporterUser.nickname
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-primary font-medium">
                      {selectedReport.reporterUser.nickname}
                    </p>
                    <Link
                      href={routes.users.profileNickname(
                        selectedReport.reporterUser.nickname
                      )}
                      className="text-secondary flex items-center gap-2 p-0 text-xs font-medium hover:underline hover:underline-offset-4"
                    >
                      {t("content.reporter.cta.profile")}
                      <ExternalLink className="ml-1 size-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-primary">
                  {t("content.errors.userNotAvailable")}
                </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-secondary mb-2 flex items-center text-sm">
                <User className="text-accent mr-2 size-4" />
                <span className="font-medium">
                  {t("content.reported.title")}
                </span>
              </div>
              {selectedReport.reportedUser ? (
                <div className="bg-primary/5 flex items-center space-x-4 rounded-lg p-4">
                  <Avatar className="border-primary border-2">
                    <AvatarImage
                      src={config.blobUrl + selectedReport.reportedUser.avatar}
                      alt="Avatar"
                    />
                    <AvatarFallback className="bg-primary text-accent">
                      {selectedReport.reportedUser.nickname
                        .substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-primary font-medium">
                      {selectedReport.reportedUser.nickname}
                    </p>
                    <Link
                      href={routes.users.profileNickname(
                        selectedReport.reportedUser.nickname
                      )}
                      className="text-secondary flex items-center gap-2 p-0 text-xs font-medium hover:underline hover:underline-offset-4"
                    >
                      {t("content.reported.cta.profile")}
                      <ExternalLink className="ml-1 size-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-primary">
                  {t("content.errors.userNotAvailable")}
                </p>
              )}
            </div>
          </TabsContent>

          {selectedReport.report.attachment && (
            <TabsContent value="attachment" className="mt-4">
              <div className="space-y-4">
                <div className="text-secondary mb-2 flex items-center text-sm">
                  <FileText className="text-accent mr-2 size-4" />
                  <span className="font-medium">
                    {t("content.attachment.title")}
                  </span>
                </div>
                <div className="border-primary/20 overflow-hidden rounded-lg border">
                  <Image
                    src={
                      config.blobUrl + selectedReport.report.attachment ||
                      "/placeholder.svg"
                    }
                    alt="Attachment"
                    width={500}
                    height={300}
                    className="h-auto max-h-[300px] w-full object-contain"
                  />
                </div>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-accent w-full"
                  onClick={() =>
                    handleOpenAttachement(
                      selectedReport.report.attachment ?? ""
                    )
                  }
                >
                  <ExternalLink className="mr-2 size-4" />
                  {t("content.attachment.cta")}
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  )
}

export default ReportDetailsTabs

const getReasonColor = (reason: ReportReason) => {
  switch (reason) {
    case "cheating":
      return "bg-yellow-500 hover:bg-yellow-600"

    case "harassment":
      return "bg-orange-500 hover:bg-orange-600"

    case "inappropriate_behavior":
      return "bg-red-500 hover:bg-red-600"

    case "impersonation":
      return "bg-red-700 hover:bg-red-800"

    case "other":
      return "bg-blue-500 hover:bg-blue-600"

    default:
      return "bg-gray-500 hover:bg-primary/20"
  }
}
