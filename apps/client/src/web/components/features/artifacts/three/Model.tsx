/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { useEffect } from "react"
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

import {
  AdjustCameraGlb,
  AdjustCameraObj,
} from "@client/web/components/features/artifacts/three/AdjustCamera"
import CustomThreeCanvas from "@client/web/components/features/artifacts/three/CustomThreeCanvas"
import type { ThreeDViewerProps } from "@client/web/components/features/artifacts/three/ThreeDViewer"

export type ModelProps = {
  fileUrl: ThreeDViewerProps["fileUrl"]
  isCameraAdjusted: boolean
  handleIsCameraAdjusted: (value: boolean) => void
}

export const ObjModel = ({
  fileUrl,
  isCameraAdjusted,
  handleIsCameraAdjusted,
}: ModelProps) => {
  const obj = useLoader(OBJLoader, fileUrl)

  return (
    <CustomThreeCanvas>
      {isCameraAdjusted && (
        <group>
          {obj.children.map((child, index) => {
            if (child instanceof THREE.Mesh) {
              const material =
                child.material || new THREE.MeshBasicMaterial({ color: "gray" })

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

      <AdjustCameraObj
        object={obj}
        handleIsCameraAdjusted={handleIsCameraAdjusted}
      />
    </CustomThreeCanvas>
  )
}

export const GlbModel = ({ fileUrl }: ModelProps) => {
  const { scene } = useGLTF(fileUrl)

  // This useEffect goal is :
  // - to normalize object height
  // - recenter it to avoid being out of frame
  useEffect(() => {
    if (!scene) {
      return
    }

    // Calculer la Bounding Box
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())

    const maxSize = Math.max(size.x, size.y, size.z)
    const targetSize = 20

    // Calcul du facteur d'échelle
    const scaleFactor = maxSize > 0 ? targetSize / maxSize : 1

    // Appliquer l’échelle uniforme
    scene.scale.set(scaleFactor, scaleFactor, scaleFactor)
  }, [scene])

  return (
    <CustomThreeCanvas>
      <primitive object={scene} />

      <AdjustCameraGlb object={scene} />
    </CustomThreeCanvas>
  )
}

export const FbxModel = ({ fileUrl, handleIsCameraAdjusted }: ModelProps) => {
  const fbx = useLoader(FBXLoader, fileUrl)

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(fbx)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const maxSize = Math.max(size.x, size.y, size.z)
    const targetSize = 20
    const scaleFactor = maxSize > 0 ? targetSize / maxSize : 1

    fbx.scale.setScalar(scaleFactor)
    fbx.position.set(
      -center.x * scaleFactor,
      -center.y * scaleFactor,
      -center.z * scaleFactor
    )
  }, [fbx])

  return (
    <CustomThreeCanvas>
      <primitive object={fbx} />

      <AdjustCameraObj
        object={fbx}
        handleIsCameraAdjusted={handleIsCameraAdjusted}
      />
    </CustomThreeCanvas>
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

      {/* <AdjustCameraObj
        object={fbx}
        handleIsCameraAdjusted={handleIsCameraAdjusted}
      /> */}
    </>
  )
}
