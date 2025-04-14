"use client"

import { Button } from "@lootopia/ui"
import { motion, AnimatePresence } from "framer-motion"
import { Crown, CheckCircle, X, Gift, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState, useRef } from "react"

import type { CrownPackage } from "@client/web/services/shop/getCrownPackages"
import { buildCanvas, launchConfetti } from "@client/web/utils/helpers/confetti"

type Props = {
  isOpen: boolean
  onClose: () => void
  crownPackage: CrownPackage
}

const ThankYouPopup = ({ isOpen, onClose, crownPackage }: Props) => {
  const t = useTranslations("Components.Shop.ThankYou")

  const [showCoins, setShowCoins] = useState(false)
  const confettiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && confettiRef.current) {
      const canvas = document.createElement("canvas")
      buildCanvas(canvas)
      document.body.appendChild(canvas)

      launchConfetti(canvas)

      const CONFETTI_DELAY = 300
      setTimeout(() => {
        setShowCoins(true)
      }, CONFETTI_DELAY)

      return () => {
        document.body.removeChild(canvas)
      }
    }
  }, [isOpen])

  return (
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
          <div
            ref={confettiRef}
            className="pointer-events-none absolute inset-0"
          ></div>

          <motion.div
            className="bg-primaryBg relative w-full max-w-md overflow-hidden rounded-xl shadow-xl"
            variants={modalVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {showCoins && (
              <>
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="pointer-events-none absolute z-10"
                    variants={flyingCrownVariant(i)}
                    initial="initial"
                    animate="animate"
                  >
                    <div className="bg-accent text-primary flex size-8 items-center justify-center rounded-full text-xs font-bold shadow-lg">
                      <Crown className="size-4" />
                    </div>
                  </motion.div>
                ))}
              </>
            )}

            <div className="from-primary to-secondary bg-gradient-to-r p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="text-accent mr-2 size-6" />
                  <h2 className="text-xl font-bold">{t("title")}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="hover:text-accent text-white transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 flex justify-center">
                <motion.div
                  className="bg-primary flex size-24 items-center justify-center rounded-full"
                  variants={giftIconVariant}
                  initial="initial"
                  animate="animate"
                >
                  <Gift className="text-accent size-12" />
                </motion.div>
              </div>

              <motion.div
                className="mb-6 text-center"
                variants={titleSectionVariant}
                initial="initial"
                animate="animate"
              >
                <h3 className="text-primary mb-2 text-2xl font-bold">
                  {t("subtitle")}
                </h3>
                <p className="text-secondary mb-4">
                  {t("description", {
                    packageName: t(`names.${crownPackage.name}`),
                  })}
                </p>

                <div className="mb-4 rounded-lg bg-gray-600/10 p-4">
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <Crown className="text-accent size-8" />
                    <span className="text-primary text-xl font-bold">
                      {crownPackage.crowns}
                    </span>
                  </div>

                  {(crownPackage?.bonus ?? 0) > 0 && (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="text-secondary size-4" />
                      <span className="text-secondary text-sm font-medium">
                        {t("bonus", {
                          bonus: crownPackage.bonus,
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.div
                className="flex justify-center"
                variants={buttonVariant}
                initial="initial"
                animate="animate"
              >
                <Button
                  className="bg-primary text-accent hover:bg-secondary"
                  onClick={onClose}
                >
                  {t("cta.continue")}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ThankYouPopup

const backdropVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariant = {
  initial: { scale: 0.9, y: 20, opacity: 0 },
  animate: { scale: 1, y: 0, opacity: 1 },
  exit: { scale: 0.9, y: 20, opacity: 0 },
  transition: { type: "spring", damping: 25, stiffness: 300 },
}

const giftIconVariant = {
  initial: { scale: 0 },
  animate: { scale: 1, rotate: [0, 10, -10, 0] },
  transition: { type: "spring", stiffness: 260, damping: 20, duration: 1 },
}

const titleSectionVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.3 },
}

const buttonVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { delay: 0.6 },
}

const flyingCrownVariant = (i: number) => ({
  initial: {
    x: "50%",
    y: "100%",
    opacity: 0,
  },
  animate: {
    x: `${Math.random() * 80 + 10}%`,
    y: `${Math.random() * 40 + 30}%`,
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 2,
      delay: i * 0.1,
      ease: "easeOut",
    },
  },
})
