/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { useEffect } from "react"
import * as THREE from "three"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"

import {
  AdjustCamera,
  AdjustCameraFbx,
  AdjustCameraGlb,
  AdjustCameraObj,
} from "@client/web/components/features/artifacts/three/AdjustCamera"
import CustomThreeCanvas from "@client/web/components/features/artifacts/three/CustomThreeCanvas"
import type { ThreeDViewerProps } from "@client/web/components/features/artifacts/three/ThreeDViewer"
import { loadObject } from "@client/web/utils/loadObject"

export type ModelProps = {
  fileUrl: ThreeDViewerProps["fileUrl"]
  isCameraAdjusted: boolean
  handleIsCameraAdjusted: (value: boolean) => void
}

export const Model = ({
  fileUrl,
  isCameraAdjusted,
  handleIsCameraAdjusted,
}: ModelProps) => {
  const object = loadObject(fileUrl)
  const format = fileUrl.split(".").pop()

  useEffect(() => {
    if (!object || format === "obj") {
      return
    }

    const boundingBox = new THREE.Box3().setFromObject(object)
    const center = boundingBox.getCenter(new THREE.Vector3())
    const size = boundingBox.getSize(new THREE.Vector3())

    // Échelle uniforme pour normaliser la taille (~20 unités max)
    const maxSize = Math.max(size.x, size.y, size.z)
    const targetSize = 20
    const scaleFactor = maxSize > 0 ? targetSize / maxSize : 1 // Calcul du facteur d'échelle

    if (format === "fbx") {
      object.position.set(
        object.position.x - center.x,
        object.position.y - center.y,
        object.position.z - center.z
      )
    }

    object.scale.setScalar(scaleFactor) // Appliquer l'échelle uniforme
  }, [format, object])

  return (
    <CustomThreeCanvas>
      {isCameraAdjusted &&
        (format === "obj" ? (
          <group>
            {object.children.map((child, index) => {
              if (child instanceof THREE.Mesh) {
                const material =
                  child.material ||
                  new THREE.MeshBasicMaterial({ color: "gray" })

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
        ) : (
          <primitive object={object} />
        ))}

      <AdjustCamera
        format={format!}
        object={object}
        handleIsCameraAdjusted={handleIsCameraAdjusted}
      />
    </CustomThreeCanvas>
  )
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
    const scaleFactor = maxSize > 0 ? targetSize / maxSize : 1

    // Appliquer l’échelle uniforme
    scene.scale.setScalar(scaleFactor)
  }, [scene])

  return (
    <CustomThreeCanvas>
      <primitive object={scene} />

      <AdjustCameraGlb object={scene} />
    </CustomThreeCanvas>
  )
}

export const FbxModel = ({
  fileUrl,
  isCameraAdjusted,
  handleIsCameraAdjusted,
}: ModelProps) => {
  const fbx = useLoader(FBXLoader, fileUrl)

  useEffect(() => {
    if (!fbx) {
      return
    }

    // Bounding Box
    const box = new THREE.Box3().setFromObject(fbx)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    // Échelle uniforme pour normaliser la taille (~20 unités max)
    const maxSize = Math.max(size.x, size.y, size.z)
    const targetSize = 20
    const scaleFactor = maxSize > 0 ? targetSize / maxSize : 1

    // Recentrer l'objet au centre (X, Y, Z)
    fbx.position.set(
      fbx.position.x - center.x,
      fbx.position.y - center.y,
      fbx.position.z - center.z
    )

    fbx.scale.setScalar(scaleFactor)
  }, [fbx])

  return (
    <CustomThreeCanvas>
      {isCameraAdjusted && <primitive object={fbx} />}

      <AdjustCameraFbx
        object={fbx}
        handleIsCameraAdjusted={handleIsCameraAdjusted}
      />
    </CustomThreeCanvas>
  )
}
