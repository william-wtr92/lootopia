import { Button } from "@lootopia/ui"

import Logo from "./Logo"
import { routes } from "@client/utils/routes"
import CustomLink from "@client/web/components/utils/CustomLink"

const Navbar = () => {
  return (
    <header className="container relative z-10 mx-auto px-4 py-8">
      <nav className="flex items-center justify-between">
        <CustomLink href={routes.home}>
          <div className="flex items-center space-x-2">
            <Logo width={50} height={50} />
            <span className="text-primary text-2xl font-bold">Lootopia</span>
          </div>
        </CustomLink>
        <div className="space-x-4">
          <Button variant="ghost" className="text-primary hover:text-secondary">
            Connexion
          </Button>
          <CustomLink href={routes.register}>
            <Button className="bg-primary text-accent hover:bg-secondary">
              S'inscrire
            </Button>
          </CustomLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
