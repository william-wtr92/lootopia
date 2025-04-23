import { useEffect, useRef } from "react"

import { buildCanvas, launchConfetti } from "@client/web/utils/helpers/confetti"

type UseConfettiProps = {
  enabled: boolean
  delay?: number
  onLaunch?: () => void
}

export const useConfetti = ({
  enabled,
  delay = 300,
  onLaunch,
}: UseConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const canvas = document.createElement("canvas")
    buildCanvas(canvas)
    document.body.appendChild(canvas)
    canvasRef.current = canvas

    const timeout = setTimeout(() => {
      launchConfetti(canvas)
      onLaunch?.()
    }, delay)

    return () => {
      clearTimeout(timeout)

      if (canvasRef.current) {
        document.body.removeChild(canvasRef.current)
      }
    }
  }, [enabled, delay, onLaunch])

  return canvasRef
}
