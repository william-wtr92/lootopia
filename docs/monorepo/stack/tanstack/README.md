# 🔍 TanStack Query (Integration in Next.js)

> TanStack Query is a data fetching library for React that provides a set of hooks and utilities for fetching, caching, and updating asynchronous data in your application.

## 📚 Resources

- [📝 TanStack Query Documentation](https://tanstack.com/docs/react-query/overview)

## 🔨 Installation

Install the necessary packages:

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

## 🛠️ Setup TanStack Query Provider

To enable TanStack Query across your application, wrap your Next.js app in a `QueryClientProvider`.

### Create a Query Client

Add the following code in `src/providers/QueryProvider.tsx`:

```tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Wrap the Application

Wrap your application with the `QueryProvider` in `src/app/layout.tsx` (for Next.js 13+):

```tsx
import { QueryProvider } from "@/providers/QueryProvider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
```

## 🗂️ Define API Client

Use an API client like `fetch` or libraries like `axios` for fetching data. Here's an example using the `fetch` API.

### Create a Fetch Function

In `src/utils/fetcher.ts`:

```ts
export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("An error occurred while fetching data")
  }

  return response.json()
}
```

## 🔄 Example: Fetch and Cache Data

### Define a Query Function

In `src/hooks/useData.ts`:

```ts
import { useQuery } from "@tanstack/react-query"
import { fetcher } from "@/utils/fetcher"

export const useData = () => {
  return useQuery({
    queryKey: ["data"], // Unique key for the query
    queryFn: () => fetcher("https://api.example.com/data"), // API endpoint
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })
}
```

## ⚙️ Server-Side Rendering (SSR)

TanStack Query supports SSR with Hydration. Use the following setup:

### Fetch Data on the Server

In a Next.js page file, e.g., `src/app/page.tsx`:

```tsx
import { Hydrate, dehydrate } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"
import { fetcher } from "@/utils/fetcher"
import { useData } from "@/hooks/useData"

export default async function Page() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery(["data"], () =>
    fetcher("https://api.example.com/data")
  )

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <DataComponent />
    </Hydrate>
  )
}

const DataComponent = () => {
  const { data, isLoading } = useData()

  if (isLoading) return <p>Loading...</p>

  return (
    <div>
      <h1>Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

## 🧪 Mutations: Modify Data

### Define a Mutation Hook

In `src/hooks/useMutateData.ts`:

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useMutateData = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newData: Record<string, any>) => {
      const response = await fetch("https://api.example.com/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      })

      if (!response.ok) {
        throw new Error("Failed to mutate data")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["data"]) // Refetch the data
    },
  })
}
```

### Use Mutation in a Component

```tsx
import { useMutateData } from "@/hooks/useMutateData"

const AddDataComponent = () => {
  const { mutate, isLoading } = useMutateData()

  const handleAddData = () => {
    mutate({ key: "value" })
  }

  return (
    <button onClick={handleAddData} disabled={isLoading}>
      Add Data
    </button>
  )
}
```
