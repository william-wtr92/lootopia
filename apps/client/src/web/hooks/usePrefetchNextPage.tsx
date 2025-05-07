import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

type UsePrefetchNextPageParams<T> = {
  enabled: boolean
  currentPage: number
  lastPage: number
  queryKeyBase: (nextPage: number) => unknown[]
  queryFn: (nextPage: number) => Promise<T>
  isFetching: boolean
}

export const usePrefetchNextPage = <T,>({
  enabled,
  currentPage,
  lastPage,
  queryKeyBase,
  queryFn,
  isFetching,
}: UsePrefetchNextPageParams<T>) => {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled || isFetching || currentPage >= lastPage) {
      return
    }

    const nextPage = currentPage + 1
    queryClient.prefetchQuery({
      queryKey: queryKeyBase(nextPage),
      queryFn: () => queryFn(nextPage),
    })
  }, [
    enabled,
    currentPage,
    lastPage,
    queryKeyBase,
    queryFn,
    isFetching,
    queryClient,
  ])
}
