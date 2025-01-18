import { Button } from "@lootopia/ui"
import { MapPin, Compass, Gift, Download } from "lucide-react"
import type { Metadata } from "next"

import FeatureCard from "@client/web/components/landing/FeatureCard"
import Footer from "@client/web/components/layout/Footer"
import Navbar from "@client/web/components/layout/Navbar"

export const metadata: Metadata = {
  icons: {
    icon: "/logo.svg",
  },
  title: "Lootopia",
  description:
    "Lootopia is an innovative platform, structured as an immersive ecosystem, dedicated to the participation and organisation of treasure hunts.",
}

const HomePage = () => {
  return (
    <div className="bg-primary-bg relative min-h-screen overflow-hidden">
      <Navbar />

      <main className="container relative z-10 mx-auto px-4 py-16">
        <div className="mb-32 text-center">
          <h1 className="text-primary mb-4 text-4xl font-bold md:text-6xl">
            Bienvenue à Lootopia
          </h1>
          <p className="text-primary mb-8 text-xl md:text-2xl">
            Explorez, découvrez, et récoltez des trésors dans votre ville !
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              className="bg-accent text-primary hover:bg-accentHover"
            >
              Commencer l'aventure
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-primary border-primary hover:bg-primary hover:text-accent"
            >
              En savoir plus
            </Button>
          </div>
        </div>

        <div className="mb-32 grid grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard
            icon={<MapPin className="text-accent h-12 w-12" />}
            title="Trouvez des caches"
            description="Explorez votre ville à la recherche de caches secrètes."
          />
          <FeatureCard
            icon={<Compass className="text-accent h-12 w-12" />}
            title="Relevez des défis"
            description="Résolvez des énigmes et accomplissez des missions."
          />
          <FeatureCard
            icon={<Gift className="text-accent h-12 w-12" />}
            title="Gagnez des récompenses"
            description="Débloquez des prix et des avantages exclusifs."
          />
        </div>

        <div className="mb-32 text-center">
          <h2 className="text-primary mb-4 text-3xl font-bold">
            Prêt à plonger dans Lootopia ?
          </h2>
          <p className="text-primary mb-8 text-xl">
            Téléchargez l'application et commencez votre quête de trésors dès
            maintenant !
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              className="bg-primary text-accent hover:bg-secondary"
            >
              <Download className="mr-2 h-5 w-5" /> App Store
            </Button>
            <Button
              size="lg"
              className="bg-primary text-accent hover:bg-secondary"
            >
              <Download className="mr-2 h-5 w-5" /> Google Play
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
