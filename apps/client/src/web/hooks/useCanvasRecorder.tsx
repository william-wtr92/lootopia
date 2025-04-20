import { useRef, useState } from "react"

export const useCanvasRecorder = () => {
  const chunks = useRef<BlobPart[]>([])
  const recorder = useRef<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const startRecording = (canvas: HTMLCanvasElement) => {
    const stream = canvas.captureStream(60)
    recorder.current = new MediaRecorder(stream, { mimeType: "video/webm" })

    recorder.current.ondataavailable = (e) => {
      chunks.current.push(e.data)
    }

    recorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "video/webm" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = "artifact.webm"
      link.click()

      chunks.current = []
    }

    recorder.current.start()
    setIsRecording(true)

    setTimeout(() => {
      recorder.current?.stop()
      setIsRecording(false)
    }, 3000)
  }

  return { startRecording, isRecording }
}
