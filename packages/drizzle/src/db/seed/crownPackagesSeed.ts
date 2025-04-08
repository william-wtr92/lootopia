import { client, db } from "@drizzle/utils/client"
import { crownPackages } from "../schema"

export const crownPackagesSeed = async () => {
  await db
    .insert(crownPackages)
    .values([
      {
        name: "starter_pack",
        crowns: 100,
        price: "4.99",
        discount: undefined,
        bonus: undefined,
        popular: false,
      },
      {
        name: "explorer_pack",
        crowns: 500,
        price: "24.99",
        discount: 20,
        bonus: 50,
        popular: false,
      },
      {
        name: "adventurer_pack",
        crowns: 1200,
        price: "49.99",
        discount: 20,
        bonus: 200,
        popular: true,
      },
      {
        name: "treasure_hunter_pack",
        crowns: 2500,
        price: "99.99",
        discount: 20,
        bonus: 500,
        popular: false,
      },
      {
        name: "legendary_pack",
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
