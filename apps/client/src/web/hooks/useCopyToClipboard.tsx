import { useState } from "react"

type UseCopyToClipboardProps = {
  copyTimeout?: number
}

export const useCopyToClipboard = (props?: UseCopyToClipboardProps) => {
  const { copyTimeout = 2000 } = props || {}
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedText(text)

    setTimeout(() => {
      setCopiedText(null)
    }, copyTimeout)
  }

  return { copiedText, copy }
}
