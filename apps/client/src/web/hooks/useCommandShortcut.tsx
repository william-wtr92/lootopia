import { useEffect } from "react"

type UseCommandShortcutProps = {
  onTrigger: () => void
}

export const useCommandShortcut = ({ onTrigger }: UseCommandShortcutProps) => {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault()
        onTrigger()
      }
    }

    document.addEventListener("keydown", down)

    return () => document.removeEventListener("keydown", down)
  }, [onTrigger])
}
