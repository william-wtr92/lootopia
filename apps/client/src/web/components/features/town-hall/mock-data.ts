import { v4 as uuidv4 } from "uuid"

export type ArtifactMocked = {
  id: string
  name: string
  type: string
  rarity: string
  price: number
  seller: string
  listedDate: Date
  foundLocation: string
  views: number
  offers: number
  description: string
}

export type ArtifactHistoryEventMocked = {
  type: "discovery" | "transfer" | "listing"
  date: Date
  user?: string
  fromUser?: string
  toUser?: string
  price?: number
  location?: string
  description: string
  details: string
}

// Remplacer la fonction formatPrice par celle-ci pour utiliser des couronnes au lieu d'euros
const formatPrice = (price: number) => {
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(price) + " 👑"
  )
}

// Mock data for artifacts on sale
const generateMockArtifacts = (count: number) => {
  const types = [
    "artwork",
    "collectible",
    "relic",
    "artifact",
    "gem",
    "treasure",
    "token",
    "badge",
    "card",
    "fragment",
  ]
  const rarities = ["common", "uncommon", "rare", "epic", "legendary"]
  const names = [
    "Amulette ancienne",
    "Cristal de pouvoir",
    "Épée légendaire",
    "Couronne royale",
    "Orbe mystique",
    "Parchemin oublié",
    "Gemme élémentaire",
    "Médaillon enchanté",
    "Relique sacrée",
    "Talisman protecteur",
  ]
  const sellers = [
    "TreasureHunter42",
    "MysticFinder",
    "ArtifactCollector",
    "LegendaryExplorer",
    "RaritySeeker",
    "GemMaster",
    "AncientHunter",
    "RelicFinder",
    "TreasureKeeper",
    "MythicTrader",
  ]
  const locations = [
    "Forêt Mystérieuse",
    "Crypte Ancienne",
    "Plage des Épaves",
    "Montagne du Dragon",
    "Ruines Oubliées",
    "Grotte de Cristal",
    "Temple Englouti",
    "Cité Perdue",
    "Désert des Mirages",
    "Île aux Trésors",
  ]

  const items = []

  for (let i = 1; i <= count; i++) {
    const nameIndex = i % names.length
    const typeIndex = i % types.length
    const rarityIndex = Math.floor(i / 10) % rarities.length
    const sellerIndex = i % sellers.length
    const locationIndex = i % locations.length

    // Generate random price based on rarity
    const basePrice = 100
    const rarityMultiplier = Math.pow(5, rarityIndex)
    const randomFactor = 0.8 + Math.random() * 0.4 // 0.8 to 1.2
    const price = Math.round(basePrice * rarityMultiplier * randomFactor)

    // Generate random date in the last 30 days
    const now = new Date()
    const daysAgo = Math.floor(Math.random() * 30)
    const listedDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)

    // Generate random number of views and offers
    const views = Math.floor(Math.random() * 100) + 10
    const offers = Math.floor(Math.random() * 5)

    items.push({
      id: `ART-${i.toString().padStart(4, "0")}`,
      name: names[nameIndex],
      type: types[typeIndex],
      rarity: rarities[rarityIndex],
      price: price,
      seller: sellers[sellerIndex],
      listedDate: listedDate,
      foundLocation: locations[locationIndex],
      views: views,
      offers: offers,
      description: `Un ${types[typeIndex]} ${rarities[rarityIndex]} découvert dans ${locations[locationIndex]}. Cet artefact possède des propriétés mystiques et une grande valeur historique.`,
    })
  }

  return items
}

export const mockArtifacts = generateMockArtifacts(50)

// Mock user inventory data
export const mockInventory = [
  {
    id: uuidv4(),
    name: "Amulette ancienne",
    rarity: "rare",
    description: "Une amulette ancienne aux pouvoirs mystérieux.",
    obtainedAt: new Date(2023, 5, 15),
  },
  {
    id: uuidv4(),
    name: "Cristal de pouvoir",
    rarity: "epic",
    description: "Un cristal qui renferme une énergie magique puissante.",
    obtainedAt: new Date(2023, 7, 22),
  },
  {
    id: uuidv4(),
    name: "Parchemin oublié",
    rarity: "uncommon",
    description: "Un parchemin contenant des connaissances anciennes.",
    obtainedAt: new Date(2023, 9, 5),
  },
  {
    id: uuidv4(),
    name: "Gemme élémentaire",
    rarity: "rare",
    description: "Une gemme qui contient l'essence d'un élément primordial.",
    obtainedAt: new Date(2023, 10, 12),
  },
  {
    id: uuidv4(),
    name: "Médaillon enchanté",
    rarity: "uncommon",
    description: "Un médaillon qui protège son porteur des maléfices.",
    obtainedAt: new Date(2023, 11, 3),
  },
]

export const generateMockHistory = (
  artifact: ArtifactMocked
): ArtifactHistoryEventMocked[] => {
  const now = new Date()
  const events = []

  // Discovery event
  const discoveryDate = new Date(
    now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000
  )
  events.push({
    type: "discovery" as ArtifactHistoryEventMocked["type"],
    date: discoveryDate,
    user: "OriginalFinder",
    location: artifact.foundLocation,
    description: `Découvert lors d'une chasse au trésor à ${artifact.foundLocation}`,
    details: `Cet artefact a été découvert dans une cache secrète, dissimulée sous un ancien monument. L'explorateur a dû résoudre plusieurs énigmes pour y accéder.`,
  })

  // Generate 2-5 random ownership transfers
  const numTransfers = Math.floor(Math.random() * 4) + 2
  let lastDate = new Date(discoveryDate)
  let lastOwner = "OriginalFinder"

  for (let i = 0; i < numTransfers; i++) {
    // Each transfer happens 5-60 days after the previous event
    const daysAfter = Math.floor(Math.random() * 55) + 5
    const transferDate = new Date(
      lastDate.getTime() + daysAfter * 24 * 60 * 60 * 1000
    )

    if (transferDate > now) {
      break
    } // Don't create future events

    const newOwner = `Collector${i + 1}`
    const price = Math.round(artifact.price * (0.7 + Math.random() * 0.6)) // 70-130% of current price

    events.push({
      type: "transfer" as ArtifactHistoryEventMocked["type"],
      date: transferDate,
      fromUser: lastOwner,
      toUser: newOwner,
      price: price,
      description: `Vendu par ${lastOwner} à ${newOwner} pour ${formatPrice(price)}`,
      details: `Cette transaction a été effectuée après une enchère compétitive. L'artefact a gagné en valeur grâce à sa rareté croissante.`,
    })

    lastDate = transferDate
    lastOwner = newOwner
  }

  // Add authentication event
  const authDate = new Date(
    lastDate.getTime() + Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000
  )

  if (authDate < now) {
    events.push({
      type: "discovery" as ArtifactHistoryEventMocked["type"],
      date: authDate,
      user: lastOwner,
      description: `Authentification par l'expert GuildMaster`,
      details: `L'artefact a été examiné par un expert reconnu qui a confirmé son authenticité et sa provenance. Cette certification a augmenté sa valeur sur le marché.`,
    })
  }

  // Current listing
  events.push({
    type: "listing" as ArtifactHistoryEventMocked["type"],
    date: artifact.listedDate,
    user: artifact.seller,
    price: artifact.price,
    description: `Mis en vente par ${artifact.seller} pour ${formatPrice(artifact.price)}`,
    details: `Le vendeur a décidé de mettre cet artefact aux enchères après l'avoir conservé pendant plusieurs mois. Il est maintenant disponible pour les collectionneurs.`,
  })

  // Sort by date (oldest first)
  return events.sort((a, b) => a.date.getTime() - b.date.getTime())
}
