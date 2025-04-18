import { paymentStatus } from "@lootopia/common"
import { Badge } from "@lootopia/ui"
import { motion } from "framer-motion"
import { Calendar, Copy, Crown, Receipt } from "lucide-react"
import { useTranslations } from "next-intl"

import { useCopyToClipboard } from "@client/web/hooks/useCopyToClipboard"
import type { PaymentResponse } from "@client/web/services/shop/getUserPaymentList"
import { getPaymentStatusColor } from "@client/web/utils/def/colors"
import { formatDate } from "@client/web/utils/helpers/formatDate"

type Props = {
  inputValue: string
  filteredPayments: PaymentResponse[]
  listContainerRef: React.RefObject<HTMLDivElement | null>
  listRef: React.RefObject<HTMLDivElement | null>
}

const PaymentList = ({
  inputValue,
  filteredPayments,
  listContainerRef,
  listRef,
}: Props) => {
  const t = useTranslations("Components.Shop.List.PaymentList")

  const { copiedText, copy } = useCopyToClipboard()

  const mappedPayments = filteredPayments.map((transaction) => ({
    id: transaction.payment.id,
    status: transaction.payment.status,
    amount: Number(transaction.payment.amount),
    date: transaction.payment.createdAt,
    package: transaction.crownPackage?.name,
  }))

  return (
    <div
      ref={listContainerRef}
      className="max-h-[370px] flex-1 overflow-y-auto p-4"
    >
      {filteredPayments.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
          <Receipt className="text-primary mb-4 size-12 opacity-30" />
          <p className="text-secondary font-medium">
            {t("empty.title", {
              term: inputValue,
            })}
          </p>
          <p className="text-primary mt-2 text-sm">{t("empty.description")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {mappedPayments.map((transaction) => (
            <motion.div
              key={transaction.id}
              className="border-primary/20 rounded-lg border bg-white/30 p-4 transition-colors hover:bg-white/50"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="text-accent size-6" />

                  <div>
                    <h3 className="text-primary font-medium">
                      {t(`package.${transaction.package!}`)}
                    </h3>
                    <div className="text-secondary flex items-center gap-2 text-xs">
                      <div className="text-secondary flex items-center gap-2 text-xs">
                        <span
                          className="group relative flex cursor-pointer items-center gap-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            copy(transaction.id)
                          }}
                        >
                          {transaction.id}

                          <span className="relative flex items-center gap-1">
                            <Copy className="text-secondary size-3" />
                          </span>

                          <span
                            className={`${
                              copiedText === transaction.id
                                ? "bg-success text-white"
                                : "bg-primary text-accent"
                            } absolute bottom-5 left-40 w-32 whitespace-nowrap rounded px-2 py-1 text-center text-xs opacity-0 transition-opacity group-hover:opacity-100`}
                          >
                            {copiedText === transaction.id
                              ? t("tooltip.copied")
                              : t("tooltip.cta.copy")}
                          </span>

                          <span>•</span>
                          <span className="flex items-center">
                            <Calendar className="mr-1 size-3" />
                            {formatDate(transaction.date)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div
                    className={`flex font-semibold ${transaction.status === paymentStatus.paid ? "text-error" : "text-success"}`}
                  >
                    {t(
                      `status.amount.${transaction.status === paymentStatus.paid ? "min" : "plus"}`,
                      {
                        amount: transaction.amount,
                      }
                    )}
                  </div>
                  <Badge
                    className={`${getPaymentStatusColor(transaction.status)} text-xs text-white`}
                  >
                    {t(`status.options.${transaction.status}`)}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <div id="sentinel" ref={listRef} className="h-1" />
    </div>
  )
}

export default PaymentList
