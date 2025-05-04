/* eslint-disable @typescript-eslint/no-explicit-any */
import { debounce } from "lodash"
import { useMemo } from "react"

/**
 * Custom hook to use debounce with stable dependencies
 * @param callback - Callback to execute after debounce delay
 * @param delay - Debounce delay in milliseconds
 * @returns A stable function to call with debounce
 */
const useDebounce = (callback: any, delay: number) => {
  const debouncedFn = useMemo(
    () =>
      debounce((...args: unknown[]) => {
        callback(...args)
      }, delay),
    [callback, delay]
  )

  return debouncedFn
}

export default useDebounce
