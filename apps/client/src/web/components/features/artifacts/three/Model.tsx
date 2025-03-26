/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { useEffect } from "react"
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

import AdjustCamera from "@client/web/components/features/artifacts/three/AdjustCamera"
import CustomThreeCanvas from "@client/web/components/features/artifacts/three/CustomThreeCanvas"
import type { ThreeDViewerProps } from "@client/web/components/features/artifacts/three/ThreeDViewer"

export type ModelProps = {
  fileUrl: ThreeDViewerProps["fileUrl"]
  isCameraAdjusted: boolean
  isModelLoaded: ThreeDViewerProps["isModelLoaded"]
  handleIsCameraAdjusted: (value: boolean) => void
  handleModelLoaded: ThreeDViewerProps["handleModelLoaded"]
}

export const ObjModel = ({
  fileUrl,
  isCameraAdjusted,
  handleIsCameraAdjusted,
  handleModelLoaded,
}: ModelProps) => {
  const obj = useLoader(OBJLoader, fileUrl)

  useEffect(() => {
    if (obj) {
      handleModelLoaded()
    }
  }, [handleModelLoaded, obj])

  return (
    <>
      <CustomThreeCanvas>
        {isCameraAdjusted && (
          <group>
            {obj.children.map((child, index) => {
              if (child instanceof THREE.Mesh) {
                const material =
                  child.material ||
                  new THREE.MeshStandardMaterial({ color: "gray" })

                return (
                  <mesh
                    key={index}
                    geometry={child.geometry}
                    material={material}
                  ></mesh>
                )
              }

              return null
            })}
          </group>
        )}

        <AdjustCamera
          object={obj}
          handleIsCameraAdjusted={handleIsCameraAdjusted}
        />
      </CustomThreeCanvas>
    </>
  )
}

export const GltfModel = ({
  fileUrl,
  // isCameraAdjusted,
  handleIsCameraAdjusted,
}: ModelProps) => {
  const { scene } = useGLTF(fileUrl)

  return (
    <>
      <primitive object={scene} />
      <AdjustCamera
        object={scene}
        handleIsCameraAdjusted={handleIsCameraAdjusted}
      />
    </>
  )
}

export const FbxModel = ({
  fileUrl,
  // isCameraAdjusted,
  handleIsCameraAdjusted,
}: ModelProps) => {
  const fbx = useLoader(FBXLoader, fileUrl)

  return (
    <>
      <primitive object={fbx} />
      <AdjustCamera
        object={fbx}
        handleIsCameraAdjusted={handleIsCameraAdjusted}
      />
    </>
  )
}

export const StlModel = ({
  fileUrl,
  // isCameraAdjusted,
  // handleIsCameraAdjusted,
}: ModelProps) => {
  const geometry = useLoader(STLLoader, fileUrl)

  return (
    <>
      <mesh>
        <primitive object={geometry} />
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* <AdjustCamera
        object={fbx}
        handleIsCameraAdjusted={handleIsCameraAdjusted}
      /> */}
    </>
  )
}
