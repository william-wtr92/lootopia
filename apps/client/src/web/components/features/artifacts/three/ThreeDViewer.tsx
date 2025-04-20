/* eslint-disable react/no-unknown-property */
import { ACCEPTED_FILE_TYPES } from "@lootopia/common"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

import CanvasExporter from "./CanvasExporter"
import RecordLoader from "./RecordLoader"
import { AdjustCamera } from "@client/web/components/features/artifacts/three/AdjustCamera"
import CustomThreeCanvas from "@client/web/components/features/artifacts/three/CustomThreeCanvas"
import { useCanvasRecorder } from "@client/web/hooks/useCanvasRecorder"
import { loadObject } from "@client/web/utils/helpers/loadObject"

export type Props = {
  fileUrl: string
}

export const ThreeDViewer = ({ fileUrl }: Props) => {
  const { startRecording, isRecording } = useCanvasRecorder()

  const objectRef = useRef<THREE.Object3D | null>(null)

  const [isCameraAdjusted, setIsCameraAdjusted] = useState(false)
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null)

  const object = loadObject(fileUrl)
  const format = ("." +
    fileUrl
      .split(".")
      .pop()) as (typeof ACCEPTED_FILE_TYPES)[keyof typeof ACCEPTED_FILE_TYPES]

  const handleIsCameraAdjusted = (value: boolean) => {
    setIsCameraAdjusted(value)
  }

  const handleExportPng = () => {
    if (!canvasEl) {
      return
    }

    const dataURL = canvasEl.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = "artifact.png"
    link.href = dataURL
    link.click()
  }

  const handleStartRecording = () => {
    if (!canvasEl) {
      return
    }

    startRecording(canvasEl)
  }

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

  useEffect(() => {
    if (!isRecording || !objectRef.current) {
      return
    }

    const start = performance.now()

    const animate = (time: number) => {
      const elapsed = time - start
      const angle = (elapsed / 3000) * Math.PI * 2

      if (objectRef.current) {
        objectRef.current.rotation.y = angle
      }

      if (elapsed < 3000) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isRecording])

  return (
    <div className="relative h-full w-full">
      <CustomThreeCanvas onCanvasReady={(canvas) => setCanvasEl(canvas)}>
        {format === ACCEPTED_FILE_TYPES.obj && isCameraAdjusted && (
          <group ref={objectRef}>
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
                  />
                )
              }

              return null
            })}
          </group>
        )}

        {format === ACCEPTED_FILE_TYPES.glb && (
          <primitive ref={objectRef} object={object} />
        )}

        {format === ACCEPTED_FILE_TYPES.fbx && isCameraAdjusted && (
          <primitive ref={objectRef} object={object} />
        )}

        <AdjustCamera
          format={format!}
          object={object}
          handleIsCameraAdjusted={handleIsCameraAdjusted}
        />
      </CustomThreeCanvas>

      <RecordLoader isRecording={isRecording} />

      <div className="absolute -right-4 -top-4 z-[70]">
        <CanvasExporter
          onExportPNG={handleExportPng}
          onExportWebM={handleStartRecording}
          isRecording={isRecording}
        />
      </div>
    </div>
  )
}
