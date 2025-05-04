"use client"

import { cn, Button } from "@lootopia/ui"
import { motion, AnimatePresence } from "framer-motion"
import {
  GemIcon as Treasure,
  Cookie,
  Shield,
  X,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react"
import { useTranslations } from "next-intl"

import CookieOption from "./CookieOption"
import { useInitCookieConsent } from "@client/web/hooks/useInitCookieConsent"
import { useCookieConsentStore } from "@client/web/store/useCookieConsentStore"
import anim from "@client/web/utils/anim"

type Props = {
  className?: string
}

const CookieConsent = ({ className }: Props) => {
  const t = useTranslations("Components.Utils.Helpers.CookieConsent")

  const {
    isVisible,
    setIsVisible,
    showDetails,
    toggleDetails,
    preferences,
    setPreference,
    acceptAll,
    rejectAll,
    savePreferences,
  } = useCookieConsentStore()

  useInitCookieConsent()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...anim(containerVariants)}
          className={cn(
            "fixed bottom-4 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:max-w-md",
            className
          )}
        >
          <motion.div
            {...anim(cardVariants)}
            className="border-primary bg-primaryBg overflow-hidden rounded-xl border-2 shadow-xl"
          >
            <div className="relative p-5">
              <div className="from-primary via-secondary to-accent absolute left-0 top-0 h-1 w-full bg-gradient-to-r"></div>

              <div className="flex items-start">
                <div className="bg-primary mr-4 rounded-full p-3">
                  <Treasure className="text-accent size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-primary mb-2 text-xl font-bold">
                    {t("title")}
                  </h3>
                  <p className="text-primary mb-4 text-sm">
                    {t("description")}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      onClick={acceptAll}
                      className="text-primary bg-accent hover:bg-accentHover flex-1"
                    >
                      {t("cta.accept")}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={toggleDetails}
                      className="border-primary text-primary hover:bg-primary hover:text-accent flex-1"
                    >
                      {t("cta.personalize")}
                      {showDetails ? (
                        <ChevronUp className="ml-2 size-4" />
                      ) : (
                        <ChevronDown className="ml-2 size-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={rejectAll}
                      className="text-primary hover:bg-primary/10 flex-1"
                    >
                      {t("cta.reject")}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsVisible(false)}
                  className="text-primary hover:bg-primary/10 -mr-1 -mt-1"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  {...anim(detailsVariants)}
                  className="border-primary/20 bg-primary/5 border-t"
                >
                  <div className="space-y-4 p-5">
                    <CookieOption
                      id="necessary"
                      title={t("options.necessary.title")}
                      description={t("options.necessary.description")}
                      checked={preferences.necessary}
                      disabled={true}
                      icon={<Shield className="text-primary size-5" />}
                    />

                    <CookieOption
                      id="functional"
                      title={t("options.functional.title")}
                      description={t("options.functional.description")}
                      checked={preferences.functional}
                      onChange={(checked) =>
                        setPreference("functional", checked)
                      }
                      icon={<Cookie className="text-primary size-5" />}
                    />

                    <CookieOption
                      id="analytics"
                      title={t("options.analytics.title")}
                      description={t("options.analytics.description")}
                      checked={preferences.analytics}
                      onChange={(checked) =>
                        setPreference("analytics", checked)
                      }
                      icon={<Info className="text-primary size-5" />}
                    />

                    <CookieOption
                      id="marketing"
                      title={t("options.marketing.title")}
                      description={t("options.marketing.description")}
                      checked={preferences.marketing}
                      onChange={(checked) =>
                        setPreference("marketing", checked)
                      }
                      icon={<Treasure className="text-primary size-5" />}
                    />

                    <div className="pt-2">
                      <Button
                        onClick={() => savePreferences()}
                        className="bg-primary text-accent hover:bg-secondary w-full"
                      >
                        {t("cta.save")}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieConsent

const containerVariants = {
  initial: { y: 100, opacity: 0 },
  enter: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
  exit: {
    y: 100,
    opacity: 0,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
}

const cardVariants = {
  initial: { scale: 0.95, opacity: 0 },
  enter: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", damping: 20, stiffness: 200 },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: { type: "spring", damping: 20, stiffness: 200 },
  },
}

const detailsVariants = {
  initial: { height: 0, opacity: 0 },
  enter: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
  exit: { height: 0, opacity: 0, transition: { duration: 0.3 } },
}
