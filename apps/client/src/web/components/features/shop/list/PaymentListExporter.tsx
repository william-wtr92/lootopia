import { Button, useToast } from "@lootopia/ui"
import { Download } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRef } from "react"

import { config } from "@client/env"
import { getPaymentsExport } from "@client/web/services/shop/getPaymentsExport"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  count: number
}

const PaymentListExporter = ({ count }: Props) => {
  const t = useTranslations("Components.Shop.List.PaymentListExporter")

  const { toast } = useToast()

  const downloadLinkRef = useRef<HTMLAnchorElement>(null)

  const handleExportPayments = async () => {
    const [status, urlOrErrorKey] = await getPaymentsExport()

    if (!status) {
      const errorKey = urlOrErrorKey as string

      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${errorKey}`),
      })

      return
    }

    const url = urlOrErrorKey as string

    if (downloadLinkRef.current && typeof url === "string") {
      downloadLinkRef.current.href = url.startsWith("/")
        ? `${config.blobUrl}${url}`
        : url
      downloadLinkRef.current.click()
    }
  }

  return (
    <div className="border-primary/20 bg-primaryBg flex items-center justify-between border-t p-4">
      <div className="text-primary text-md flex items-center gap-1">
        <span className="font-medium">{count}</span>
        {t("transactions")}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="border-primary text-primary hover:bg-primary hover:text-accent"
        onClick={handleExportPayments}
      >
        <Download className="mr-2 size-4" />
        {t("cta.export")}
      </Button>

      <a ref={downloadLinkRef} className="hidden" />
    </div>
  )
}

export default PaymentListExporter
