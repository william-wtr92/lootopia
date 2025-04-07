export const getRecentHunts = () => [
  {
    id: 1,
    title: "The Lost Medallion",
    date: "2023-11-28",
    location: "Montmartre, Paris",
    duration: "1h 45m",
    reward: "Gold Medallion",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    title: "Secrets of the Seine",
    date: "2023-11-20",
    location: "Seine River, Paris",
    duration: "2h 30m",
    reward: "Ancient Map Fragment",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    title: "Louvre's Hidden Treasure",
    date: "2023-11-15",
    location: "Louvre Museum, Paris",
    duration: "3h 15m",
    reward: "Crystal Key",
    image: "/placeholder.svg?height=60&width=60",
  },
]

export const getArtifacts = () => [
  {
    id: 1,
    name: "Golden Compass",
    description: "A compass that always points to the nearest treasure.",
    rarity: "legendary",
    image: "/placeholder.svg?height=80&width=80",
    acquiredDate: "2023-10-05",
  },
  {
    id: 2,
    name: "Ancient Map Fragment",
    description: "Part of a map leading to a legendary treasure.",
    rarity: "epic",
    image: "/placeholder.svg?height=80&width=80",
    acquiredDate: "2023-09-18",
  },
  {
    id: 3,
    name: "Silver Medallion",
    description: "A medallion with mysterious engravings.",
    rarity: "rare",
    image: "/placeholder.svg?height=80&width=80",
    acquiredDate: "2023-08-22",
  },
  {
    id: 4,
    name: "Bronze Key",
    description: "A key that might open an ancient lock.",
    rarity: "uncommon",
    image: "/placeholder.svg?height=80&width=80",
    acquiredDate: "2023-07-30",
  },
  {
    id: 5,
    name: "Rusty Coin",
    description: "An old coin with faded markings.",
    rarity: "common",
    image: "/placeholder.svg?height=80&width=80",
    acquiredDate: "2023-07-15",
  },
]

export const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "legendary":
      return "bg-amber-500 text-black"

    case "epic":
      return "bg-purple-600 text-white"

    case "rare":
      return "bg-blue-600 text-white"

    case "uncommon":
      return "bg-green-600 text-white"

    case "common":
      return "bg-gray-500 text-white"

    default:
      return "bg-gray-500 text-white"
  }
}
