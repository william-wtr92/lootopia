import { Button, useToast } from "@lootopia/ui"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, Gift, Info, Sparkles, Star, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import CrownPackageCard from "./CrownPackageCard"
import SpecialOfferCard from "./SpecialOfferCard"
import StripeElements from "./StripeElements"
import { Link } from "@client/i18n/routing"
import { getCrownPackages } from "@client/web/services/shop/getCrownPackages"
import { paymentCheckout } from "@client/web/services/shop/paymentCheckout"
import { translateDynamicKey } from "@client/web/utils/translateDynamicKey"

type Props = {
  isOpen: boolean
  onClose: () => void
  currentCrowns?: number
}

const ShopPopup = ({ isOpen, onClose, currentCrowns }: Props) => {
  const t = useTranslations("Components.Shop.Popup")
  const { toast } = useToast()

  const { data: crownPackages } = useQuery({
    queryKey: ["crownPackages"],
    queryFn: () => getCrownPackages(),
    enabled: isOpen,
  })

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const [openCheckout, setOpenCheckout] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const handlePurchase = async (packageId: string) => {
    const [status, clientSecretOrErrorKey] = await paymentCheckout({
      packageId,
    })

    if (!status) {
      const errorKey = clientSecretOrErrorKey

      toast({
        variant: "destructive",
        description: translateDynamicKey(t, `errors.${errorKey}`),
      })

      return
    }

    if (typeof clientSecretOrErrorKey === "string") {
      setClientSecret(clientSecretOrErrorKey)
      handleTriggerCheckout()
    }
  }

  const firstRowPackages = crownPackages?.slice(0, 3)
  const secondRowPackages = crownPackages?.slice(3)

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage((prev) => (prev === packageId ? null : packageId))
  }

  const handleTriggerCheckout = () => {
    setOpenCheckout((prev) => !prev)
  }

  return (
    <>
      {clientSecret && openCheckout ? (
        <StripeElements
          clientSecret={clientSecret}
          onClose={handleTriggerCheckout}
        />
      ) : (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              variants={backdropVariant}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={onClose}
            >
              <motion.div
                className="bg-primaryBg relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl shadow-xl"
                variants={popupVariant}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={popupVariant.transition}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="to-secondary from-primary relative overflow-hidden rounded-t-xl bg-gradient-to-r p-6 text-white">
                  <div className="absolute -left-4 -top-4 opacity-10">
                    <Crown size={100} />
                  </div>
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 transform opacity-10">
                    <Crown size={150} />
                  </div>

                  <div className="relative flex items-center justify-between">
                    <div>
                      <h2 className="flex items-center text-3xl font-bold">
                        {t("title")}
                        <Sparkles className="text-accent ml-2 size-6" />
                      </h2>
                      <p className="mt-1 text-lg opacity-90">
                        {t("description")}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center rounded-full bg-white/20 px-4 py-2">
                        <Crown className="text-accent mr-2 size-5" />
                        <span className="font-bold">
                          {currentCrowns?.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-white hover:bg-white/20"
                        onClick={onClose}
                      >
                        <X className="size-6" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {firstRowPackages?.map((pkg) => (
                      <CrownPackageCard
                        key={pkg.id}
                        package={pkg}
                        isSelected={selectedPackage === pkg.id}
                        onSelect={() => handleSelectPackage(pkg.id)}
                        onPurchase={() => handlePurchase(pkg.id)}
                      />
                    ))}
                  </div>

                  <div className="mb-6 flex justify-center gap-6">
                    {secondRowPackages?.map((pkg) => (
                      <div key={pkg.id} className="w-full max-w-xs md:w-1/3">
                        <CrownPackageCard
                          package={pkg}
                          isSelected={selectedPackage === pkg.id}
                          onSelect={() => handleSelectPackage(pkg.id)}
                          onPurchase={() => handlePurchase(pkg.id)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-primary mb-4 flex items-center text-xl font-bold">
                      <Gift className="text-accent mr-2 size-5" />
                      {t("specialOffers.title")}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <SpecialOfferCard
                        title={t("specialOffers.first.title")}
                        description={t("specialOffers.first.description")}
                        icon={<Star className="text-accent size-10" />}
                        color="bg-gradient-to-r from-amber-500 to-orange-600"
                      />
                      <SpecialOfferCard
                        title={t("specialOffers.flash.title")}
                        description={t("specialOffers.flash.description")}
                        icon={<Crown className="text-accent size-10" />}
                        color="bg-gradient-to-r from-purple-500 to-pink-600"
                      />
                    </div>
                  </div>

                  <div className="bg-primary/10 mt-8 flex items-start gap-3 rounded-lg p-4">
                    <Info className="text-primary mt-0.5 size-5 flex-shrink-0" />
                    <div className="text-primary text-sm">
                      <p className="mb-1 font-semibold">{t("about.title")}</p>
                      <p>{t("about.description")}</p>
                    </div>
                  </div>
                </div>

                <div className="text-primary border-t border-gray-600/20 p-4 text-center text-sm">
                  <p>
                    {t("tos.disclaimer")}{" "}
                    <Link href="#" className="text-secondary hover:underline">
                      {t("tos.link")}
                    </Link>{" "}
                    {t("tos.more")}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  )
}

export default ShopPopup

const backdropVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const popupVariant = {
  initial: { scale: 0.9, y: 20, opacity: 0 },
  animate: { scale: 1, y: 0, opacity: 1 },
  exit: { scale: 0.9, y: 20, opacity: 0 },
  transition: { type: "spring", damping: 25, stiffness: 300 },
}
