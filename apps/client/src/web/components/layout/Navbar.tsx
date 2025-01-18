import { Button } from "@lootopia/ui"
import React from "react"

import Logo from "./Logo"

const Navbar = () => {
  return (
    <header className="container relative z-10 mx-auto px-4 py-8">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo width={50} height={50} />
          <span className="text-primary text-2xl font-bold">Lootopia</span>
        </div>
        <div className="space-x-4">
          <Button variant="ghost" className="text-primary hover:text-secondary">
            Connexion
          </Button>
          <Button className="bg-primary text-accent hover:bg-secondary">
            S'inscrire
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
