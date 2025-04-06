/* eslint-disable react/no-unknown-property */
import { Canvas } from "@react-three/fiber"
import { type ReactNode } from "react"

type CustomThreeCanvasProps = {
  children: ReactNode
}

const CustomThreeCanvas = ({ children }: CustomThreeCanvasProps) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 100], fov: 50 }}
      className="h-full w-full"
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
