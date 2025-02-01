import { Button } from "@lootopia/ui"
import { MapPin, Compass, Gift, Download } from "lucide-react"
import { useTranslations } from "next-intl"

import FeatureCard from "@client/web/components/landing/FeatureCard"
import Footer from "@client/web/components/layout/Footer"
import { MotionComponent } from "@client/web/components/utils/MotionComponent"
import anim from "@client/web/utils/anim"

const HomePage = () => {
  const t = useTranslations("Pages.Home")

  const headerVariant = {
    initial: {
      opacity: 0,
      y: 40,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: 40,
    },
  }

  const featureCardsVariant = {
    initial: {
      opacity: 0,
      y: 50,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
    },
  }

  const readyTextVariant = {
    initial: {
      opacity: 0,
      y: 50,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
    },
  }

  return (
    <main className="bg-primary-bg relative min-h-screen overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 pb-16">
        <MotionComponent
          type="header"
          {...anim(headerVariant)}
          className="mb-[20vh] mt-[20vh] text-center"
        >
          <h1 className="text-primary mb-4 text-4xl font-bold md:text-6xl">
            {t("title")}
          </h1>

          <p className="text-primary mb-8 text-xl md:text-2xl">
            {t("description")}
          </p>

          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              className="bg-accent text-primary hover:bg-accentHover"
            >
              {t("cta.start")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-primary border-primary hover:bg-primary hover:text-accent"
            >
              {t("cta.about")}
            </Button>
          </div>
        </MotionComponent>

        <MotionComponent
          {...anim(featureCardsVariant)}
          className="z-20 mb-32 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          <FeatureCard
            icon={<MapPin className="text-accent h-12 w-12" />}
            title={t("cards.caches.title")}
            description={t("cards.caches.description")}
          />
          <FeatureCard
            icon={<Compass className="text-accent h-12 w-12" />}
            title={t("cards.challenges.title")}
            description={t("cards.challenges.description")}
          />
          <FeatureCard
            icon={<Gift className="text-accent h-12 w-12" />}
            title={t("cards.rewards.title")}
            description={t("cards.rewards.description")}
          />
        </MotionComponent>

        <MotionComponent
          type="div"
          {...anim(readyTextVariant)}
          className="mb-32 text-center"
        >
          <h2 className="text-primary mb-4 text-3xl font-bold">
            {t("download.title")}
          </h2>

          <p className="text-primary mb-8 text-xl">
            {t("download.description")}
          </p>

          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              className="bg-primary text-accent hover:bg-secondary"
            >
              <Download className="mr-2 h-5 w-5" /> {t("download.cta.ios")}
            </Button>

            <Button
              size="lg"
              className="bg-primary text-accent hover:bg-secondary"
            >
              <Download className="mr-2 h-5 w-5" /> {t("download.cta.android")}
            </Button>
          </div>
        </MotionComponent>
      </div>

      <Footer />
    </main>
  )
}

export default HomePage
