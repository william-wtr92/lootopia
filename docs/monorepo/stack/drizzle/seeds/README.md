# 🔍 Seeds

> Seeds are used to populate the database with initial data. This is useful for development and testing purposes.


## 📦 Installation

```bash
pnpm add drizzle-seed
```

## 🔨 Usage

- With `drizzle-seed` installed, you can create a new seed in your project:

```bash
cd apps/{server}/**/{seeds}
```

- Make sure you have the client instance in your application:

```ts
import { db } from "@server/db/client"
import { seed } from "drizzle-seed";
import { users } from "@lootopia/drizzle"

async function main() {
  await seed(db, { users: schema.users }).refine((f) => ({
    users: {
        columns: {
            nickname: f.random.alphaNumeric({ length: 10 }),
        },
        count: 20
    }
  }))
}
main()
```