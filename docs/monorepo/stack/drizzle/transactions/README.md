# 🔍 Transactions

#### 💡 Transactions in the context of a database, and by extension in use with `Drizzle`, are a way of `grouping several database operations` into a `single unit of work`.

> This means that if all the operations within the transaction are successful, then
> the transaction is committed and all the data changes are permanently applied to the database.
> On the other hand, if one of the operations fails, the transaction is rolled back, and all the changes made by the
> operations within that
> transaction are reversed, returning the database to its pre-transaction state.

## 🔨 Usage

- **For example:**

```ts
import { sql } from "drizzle-orm"
import { users } from "@lootopia/drizzle" // Import the users table

const insertUsers = await db.transaction(async (tx) => {
  await tx.insertInto(users).values({ name: "Alice" })
  await tx.insertInto(users).values({ name: "Bob" })
})
```

> The `tx` object is a transaction object that is used to group all the database operations that you want to be part of the transaction.
