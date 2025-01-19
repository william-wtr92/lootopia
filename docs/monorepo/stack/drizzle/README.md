# 🪀 Drizzle ORM

> A simple, lightweight ORM for Node.js, this will enable us to interact with our database and make queries in a more efficient way.


## 📚 Resources

- [📝 Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)

## 📚 Table of Contents

- [🔍 Migrations](./migrations/README.md)
- [🔍 Seeds](./seeds/README.md)
- [🔍 Transactions](./transactions/README.md)

## 🧩 Requirements

- Install the Drizzle ORM package:

```bash
pnpm add drizzle-orm pg
pnpm add -D drizzle-kit
```

## 💡 Integration in Lootopia 

> In Lootopia we have an external package in `packages/drizzle` that contains the configuration of the Drizzle ORM. The benefit of this is that we can share the configuration between the different applications in the monorepo.

### 📦 Configuration

- Setup your config file at `root` of your project:

```ts
const appConfig = {
  env: process.env.NODE_ENV!,
  db: {
    ...
    migrations: {
      schema: "./src/db/schema/index.ts",
      out: "./migrations",
      dialect: "postgresql",
    },
  },
})
```

- Setup your `drizzle.config.ts` at `root` of your project:

```ts
import appConfig from "@drizzle/config"
import { defineConfig } from "drizzle-kit"

const {
  user,
  password,
  port,
  name,
  host,
  migrations: { schema, out, dialect },
} = appConfig.db // Get the database configuration from the app config

export default defineConfig({
  schema,
  out,
  dialect,
  dbCredentials: {
    url: `postgresql://${user}:${password}@${host}:${port}/${name}`,
  },
})
```

- After create your client instance in your application:

```ts
import * as schema from "@lootopia/drizzle" // Import the schema from your package
import appConfig from "@server/config"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres" // Import the postgres client

const {
  env,
  db: { host, user, password, port, name },
} = appConfig

const client = postgres(
  `postgresql://${user}:${password}@${host}:${port}/${name}`
)

export const db = drizzle({
  client,
  schema,
  logger: env === "development" ? true : false,
})
```

