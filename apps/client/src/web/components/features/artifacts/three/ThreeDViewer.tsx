/* eslint-disable react/no-unknown-property */
import { ACCEPTED_FILE_TYPES } from "@lootopia/common"
import { useEffect, useState } from "react"
import * as THREE from "three"

import { AdjustCamera } from "@client/web/components/features/artifacts/three/AdjustCamera"
import CustomThreeCanvas from "@client/web/components/features/artifacts/three/CustomThreeCanvas"
import { loadObject } from "@client/web/utils/loadObject"

export type Props = {
  fileUrl: string
}

export const ThreeDViewer = ({ fileUrl }: Props) => {
  const [isCameraAdjusted, setIsCameraAdjusted] = useState(false)

  const handleIsCameraAdjusted = (value: boolean) => {
    setIsCameraAdjusted(value)
  }

  const object = loadObject(fileUrl)
  const format = ("." +
    fileUrl
      .split(".")
      .pop()) as (typeof ACCEPTED_FILE_TYPES)[keyof typeof ACCEPTED_FILE_TYPES]

  useEffect(() => {
    if (!object || format === ACCEPTED_FILE_TYPES.obj) {
      return
    }

    const boundingBox = new THREE.Box3().setFromObject(object)
    const center = boundingBox.getCenter(new THREE.Vector3())
    const size = boundingBox.getSize(new THREE.Vector3())

    // Uniform scale to standardize size (~20 units max)
    const maxSize = Math.max(size.x, size.y, size.z)
    const targetSize = 20
    const scaleFactor = maxSize > 0 ? targetSize / maxSize : 1 // Compute of scaling factor

    if (format === ACCEPTED_FILE_TYPES.fbx) {
      object.position.set(
        object.position.x - center.x,
        object.position.y - center.y,
        object.position.z - center.z
      )
    }

    object.scale.setScalar(scaleFactor) // Apply scaling evenly
  }, [format, object])

  return (
    <CustomThreeCanvas>
      {format === ACCEPTED_FILE_TYPES.obj && isCameraAdjusted && (
        <group>
          {object.children.map((child, index) => {
            if (child instanceof THREE.Mesh) {
              const material =
                child.material || new THREE.MeshBasicMaterial({ color: "gray" })

              return (
                <mesh
                  key={index}
                  geometry={child.geometry}
                  material={material}
                />
              )
            }

            return null
          })}
        </group>
      )}

      {format === ACCEPTED_FILE_TYPES.glb && <primitive object={object} />}

      {format === ACCEPTED_FILE_TYPES.fbx && isCameraAdjusted && (
        <primitive object={object} />
      )}

      <AdjustCamera
        format={format!}
        object={object}
        handleIsCameraAdjusted={handleIsCameraAdjusted}
      />
    </CustomThreeCanvas>
  )
}
