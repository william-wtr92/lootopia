import { Button } from "@lootopia/ui"
import { Download } from "lucide-react"
import { useTranslations } from "next-intl"

type Props = {
  count: number
}

const PaymentListExporter = ({ count }: Props) => {
  const t = useTranslations("Components.Shop.List.PaymentListExporter")

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
      >
        <Download className="mr-2 size-4" />
        {t("cta.export")}
      </Button>
    </div>
  )
}

export default PaymentListExporter
