/* eslint-disable react/no-unknown-property */
import { OrbitControls, useGLTF } from "@react-three/drei"
import { Canvas, useLoader } from "@react-three/fiber"
import { Suspense, useEffect } from "react"
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

type ThreeDViewerProps = {
  fileUrl: string
  fileType: string
  onLoaded: () => void
}

type ModelViewerProps = {
  fileUrl: string
  fileType: string
  onLoaded: () => void
}

type ModelProps = {
  fileUrl: string
  onLoaded?: () => void
}

const ObjModel = ({ fileUrl, onLoaded }: ModelProps) => {
  const obj = useLoader(OBJLoader, fileUrl)

  useEffect(() => {
    if (onLoaded && obj) {
      onLoaded()
    }
  }, [obj, onLoaded])

  return (
    <group>
      {obj.children.map((child, index) => {
        if (child instanceof THREE.Mesh) {
          return (
            <mesh
              key={index}
              geometry={child.geometry}
              material={child.material}
            >
              <meshStandardMaterial color="gray" />
            </mesh>
          )
        }

        return null
      })}
    </group>
  )
}

const GltfModel = ({ fileUrl }: ModelProps) => {
  const { scene } = useGLTF(fileUrl)

  return <primitive object={scene} />
}

const FbxModel = ({ fileUrl }: ModelProps) => {
  const fbx = useLoader(FBXLoader, fileUrl)

  return <primitive object={fbx} />
}

const StlModel = ({ fileUrl }: ModelProps) => {
  const geometry = useLoader(STLLoader, fileUrl)

  return (
    <mesh>
      <primitive object={geometry} />
      <meshStandardMaterial color="gray" />
    </mesh>
  )
}

const ModelViewer = ({ fileUrl, fileType, onLoaded }: ModelViewerProps) => {
  switch (fileType) {
    case "obj":
      return <ObjModel fileUrl={fileUrl} onLoaded={onLoaded} />

    case "gltf":
      return <GltfModel fileUrl={fileUrl} />

    case "glb":
      return <GltfModel fileUrl={fileUrl} />

    case "fbx":
      return <FbxModel fileUrl={fileUrl} />

    case "stl":
      return <StlModel fileUrl={fileUrl} />

    default:
      return <p>Format non supporté</p>
  }
}

export const ThreeDViewer = ({
  fileUrl,
  fileType,
  onLoaded,
}: ThreeDViewerProps) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 100], fov: 50, near: 0.1, far: 1000 }}
      className="h-full w-full"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />

      <Suspense fallback={null}>
        <ModelViewer
          fileUrl={fileUrl}
          fileType={fileType}
          onLoaded={onLoaded}
        />
      </Suspense>

      <OrbitControls minDistance={40} maxDistance={150} />
    </Canvas>
  )
}
