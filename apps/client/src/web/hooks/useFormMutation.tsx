import { useToast } from "@lootopia/ui"
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"

type ToastMessage = string | ((errorOrData: unknown) => string)

type ToastKeys = {
  success?: ToastMessage
  error?: ToastMessage
}

export const useFormMutation = <TData = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  toastKeys?: ToastKeys,
  options?: UseMutationOptions<TData, unknown, TVariables>
) => {
  const { toast } = useToast()

  return useMutation<TData, unknown, TVariables>({
    mutationFn,
    ...options,
    onSuccess: (data, variables, context) => {
      const message =
        typeof toastKeys?.success === "function"
          ? toastKeys.success(data)
          : toastKeys?.success

      if (message) {
        toast({ description: message })
      }

      options?.onSuccess?.(data, variables, context)
    },
    onError: (error, variables, context) => {
      const message =
        typeof toastKeys?.error === "function"
          ? toastKeys.error(error)
          : toastKeys?.error

      if (message) {
        toast({ variant: "destructive", description: message })
      }

      options?.onError?.(error, variables, context)
    },
  })
}
