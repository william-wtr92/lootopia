import { client, db } from "@drizzle/utils/client"
import { crownPackageName } from "@lootopia/common"

import { crownPackages } from "../schema"

export const crownPackagesSeed = async () => {
  await db
    .insert(crownPackages)
    .values([
      {
        name: crownPackageName.starterPack,
        crowns: 100,
        price: "4.99",
        discount: undefined,
        bonus: undefined,
        popular: false,
      },
      {
        name: crownPackageName.explorerPack,
        crowns: 500,
        price: "24.99",
        discount: 20,
        bonus: 50,
        popular: false,
      },
      {
        name: crownPackageName.adventurerPack,
        crowns: 1200,
        price: "49.99",
        discount: 20,
        bonus: 200,
        popular: true,
      },
      {
        name: crownPackageName.treasureHunterPack,
        crowns: 2500,
        price: "99.99",
        discount: 20,
        bonus: 500,
        popular: false,
      },
      {
        name: crownPackageName.legendaryPack,
        crowns: 5000,
        price: "199.99",
        discount: 25,
        bonus: 1500,
        popular: false,
      },
    ])
    .onConflictDoNothing()
    .execute()
}

crownPackagesSeed()
  .then(() => {
    console.info("Crown packages seeded successfully ✅")
  })
  .finally(() => {
    client.end()
  })
