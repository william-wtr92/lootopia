/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber"
import { useRef, type ReactNode } from "react"

type Props = {
  children: ReactNode
  onCanvasReady?: (canvas: HTMLCanvasElement) => void
}

const CustomThreeCanvas = ({ children, onCanvasReady }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  return (
    <Canvas
      camera={{ position: [0, 0, 100], fov: 50, near: 0.1, far: 5000 }}
      gl={{ preserveDrawingBuffer: true }}
      className="h-full w-full"
      onCreated={({ gl }) => {
        canvasRef.current = gl.domElement
        onCanvasReady?.(gl.domElement)
      }}
    >
      <ambientLight intensity={0.5} />

      <hemisphereLight groundColor={"gray"} intensity={1} />

      <directionalLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} />

      {children}
    </Canvas>
  )
}

export default CustomThreeCanvas
