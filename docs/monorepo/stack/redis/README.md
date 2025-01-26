# 🎒 Redis

> Redis is an extensible, high-performance, key-value database management system written in ANSI C. It is part of the
> NoSQL movement and aims to provide the highest possible performance.

- On **Instamint** we use `Redis` as a `caching layer` for our **services**.
- We use it to store frequently **accessed data in memory** to
  **reduce the time it takes to fetch data from the database**.

## 📚 Resources

- [📝 Redis Documentation](https://redis.io/documentation)
- [💻 Redis Commands](https://redis.io/commands)
- [📦 Package: ioredis](https://www.npmjs.com/package/ioredis)

## 💡 How to use Redis in HonoJS

### ⚠️ Requirements

- [Install Redis](https://redis.io/docs/install/install-redis/) server on your local machine or use a cloud-based Redis
  service.

> MacOS

```bash
# Install Redis using Homebrew
brew install redis

# Start Redis at boot
brew services start redis

# Health check
redis-cli ping # PONG
```

### ⚙️ Steps

- **Step 1**: Install the `ioredis` package using `pnpm` or `npm`.

```bash
pnpm install ioredis
```

- **Step 2**: Create a new instance of `ioredis` and connect to the Redis server.

```ts
import Redis from "ioredis"

const redis = new Redis({
  host: "127.0.0.1", // Redis server IP address
  port: 6379, // Redis server port
})
```

- **Step 3**: Use the `set` and `get` methods to store and retrieve data from Redis.

```ts
// Store data in Redis
await redis.set("key", "value")

// Retrieve data from Redis
const value = await redis.get("key")
```

### 👀 Example in Lootopia

```ts
app.post("/resendEmailValidation", async (c: Context): Promise<Response> => {
  const { email } = await c.req.json() // Get email from request body

  const cacheEmailValidationKey = `email_validation:${email}` // Cache key for email validation
  const lastEmailValidation = await redis.get(cacheEmailValidationKey) // Get last email validation from Redis

  if (lastEmailValidation) {
    return c.json(userMustWaitBeforeSendingAnotherMail, 429) // Return error if user must wait before sending another email
  }

  /* ... */

  await redis.set(cacheEmailValidationKey, Date.now(), "EX", 10 * 60) // Store email validation in Redis

  /* ... */
  return [your_response_here]
})
```