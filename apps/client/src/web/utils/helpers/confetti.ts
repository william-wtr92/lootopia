import { create } from "canvas-confetti"

export const launchConfetti = (canvas: HTMLCanvasElement) => {
  const myConfetti = create(canvas, {
    resize: true,
    useWorker: true,
  })

  myConfetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#FFD700", "#4A0E4E", "#8A4FFF"],
  })

  setTimeout(() => {
    myConfetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#FFD700", "#4A0E4E", "#8A4FFF"],
    })
  }, 750)

  setTimeout(() => {
    myConfetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#FFD700", "#4A0E4E", "#8A4FFF"],
    })
  }, 1500)
}

export const buildCanvas = (canvas: HTMLCanvasElement) => {
  canvas.style.position = "fixed"
  canvas.style.inset = "0"
  canvas.style.width = "100vw"
  canvas.style.height = "100vh"
  canvas.style.pointerEvents = "none"
  canvas.style.zIndex = "100"
}
