/* eslint-disable react/no-unknown-property */
import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { type ReactNode } from "react"

type CustomThreeCanvasProps = {
  children: ReactNode
}

const CustomThreeCanvas = ({ children }: CustomThreeCanvasProps) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 100], fov: 50, near: 0.1, far: 1000 }}
      className="h-full w-full"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />

      {children}

      <OrbitControls minDistance={30} maxDistance={400} />
    </Canvas>
  )
}

export default CustomThreeCanvas
