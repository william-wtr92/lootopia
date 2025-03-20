export const fiftyMo = 50 * 1024 * 1024
export const defaultMimeType = "application/octet-stream"
export const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]

export const fileToBuffer = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()

  return Buffer.from(arrayBuffer)
}
