import { calculateDiscountedPrice } from "@lootopia/common"
import {
  Separator,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  cn,
  CardFooter,
  Button,
} from "@lootopia/ui"
import { motion } from "framer-motion"
import { Crown } from "lucide-react"
import { useTranslations } from "next-intl"

import type { CrownPackage } from "@client/web/services/shop/getCrownPackages"
import { getCrownPackageColor } from "@client/web/utils/def/colors"

type Props = {
  package: CrownPackage
  isSelected: boolean
  onSelect: () => void
  onPurchase: () => void
}

const CrownPackageCard = ({
  package: pkg,
  isSelected,
  onSelect,
  onPurchase,
}: Props) => {
  const t = useTranslations("Components.Shop.Card")

  const discountedPrice = calculateDiscountedPrice(
    parseFloat(pkg.price),
    pkg.discount ?? undefined
  )
  const color = getCrownPackageColor(pkg.name)

  return (
    <motion.div
      whileHover="whileHover"
      transition={crownPackageCardVariant.transition}
      variants={crownPackageCardVariant}
      onClick={onSelect}
    >
      <Card
        className={cn(
          "relative h-full cursor-pointer overflow-hidden border-2 transition-all",
          isSelected
            ? "border-accent"
            : "hover:border-primary border-violet-600/30"
        )}
      >
        {pkg.popular && (
          <div className="absolute right-0 top-0">
            <div className="bg-accent text-primary rounded-bl-lg px-3 py-1 text-xs font-bold">
              {t("popular")}
            </div>
          </div>
        )}

        {pkg.discount && (
          <div className="absolute left-0 top-0">
            <div className="bg-error rounded-br-lg px-3 py-1 text-xs font-bold text-white">
              {t("discount", {
                discount: pkg.discount,
              })}
            </div>
          </div>
        )}

        <CardHeader className={color}>
          <CardTitle className="text-center">
            {t(`names.${pkg.name}`)}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="mb-4 flex items-center justify-center">
            <span className="text-primary text-3xl font-extrabold">
              {t("discountedPrice", {
                price: discountedPrice,
              })}
            </span>
            {pkg.discount && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                {t("price", {
                  price: pkg.price,
                })}
              </span>
            )}
          </div>

          <div className="mb-6 flex flex-col items-center">
            <div className="flex items-center">
              <Crown className="text-accent mr-2 h-6 w-6" />
              <span className="text-primary text-2xl font-bold">
                {pkg.crowns.toLocaleString()}
              </span>
            </div>

            <div className="text-success mt-2 h-5 text-sm font-medium">
              {pkg.bonus && (
                <span>
                  {t("bonus", {
                    bonus: pkg.bonus,
                  })}
                </span>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="text-primary text-center text-sm">
            <p>{t("instantDelivery")}</p>
            <p>{t("singlePurchase")}</p>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            className="text-accent bg-primary hover:bg-secondary w-full"
            onClick={(e) => {
              e.stopPropagation()
              onPurchase()
            }}
          >
            {t("cta.buy")}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default CrownPackageCard

const crownPackageCardVariant = {
  whileHover: { scale: 1.03 },
  transition: { type: "spring", stiffness: 400, damping: 10 },
}
