"use client"

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js"
import { motion } from "framer-motion"
import { Crown, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { stripePromise } from "@client/web/utils/stripe"

type Props = {
  clientSecret: string
  onClose?: () => void
}

const StripeElements = ({ clientSecret, onClose }: Props) => {
  const t = useTranslations("Components.Shop.StripeElements")

  if (!clientSecret) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <motion.div
        className="bg-primaryBg relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl shadow-xl"
        initial="initial"
        animate="animate"
        transition={wrapperVariant.transition}
        variants={wrapperVariant}
      >
        <div className="from-primary to-secondary relative overflow-hidden bg-gradient-to-r p-4 text-white">
          <div className="absolute -left-4 -top-4 opacity-10">
            <Crown size={80} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crown className="text-accent mr-2 size-6" />
              <h2 className="text-xl font-bold">{t("title")}</h2>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="rounded-full p-1 text-white transition-colors hover:bg-white/20"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        </div>

        <div
          className="max-h-[calc(90vh-160px)] overflow-y-auto bg-white pb-6"
          id="checkout"
        >
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{
              clientSecret,
            }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>

        <div className="border-primary/20 text-primary border-t p-3 text-center text-xs">
          <p>{t("info")}</p>
        </div>
      </motion.div>
    </div>
  )
}

export default StripeElements

const wrapperVariant = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring", damping: 25, stiffness: 300 },
}
