# 🔍 Migrations

> Migrations are a way to keep your database schema in sync with your application. It's a way to version control your database schema.

## 🔨 Usage

- With `drizzle` installed, you can create a new migration in your project:

```bash
cd packages/drizzle/src/db/schema
```

- Create a new migration:

```bash
export const users = pgTable(
  "users",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    nickname: varchar({ length: 255 }).unique().notNull(),
    email: varchar({ length: 255 }).unique().notNull(),
    phone: varchar({ length: 255 }).unique().notNull(),
  }
)
```

- Run the migration:

```bash
pnpm exec drizzle-kit generate
pnpm exec drizzle-kit migrate
```