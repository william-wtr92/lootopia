import { useThree } from "@react-three/fiber"
import { useEffect, type FC } from "react"
import * as THREE from "three"

import type { ModelProps } from "@client/web/components/features/artifacts/three/Model"

type AdjustCameraProps = {
  object: THREE.Object3D | null
  handleIsCameraAdjusted: ModelProps["handleIsCameraAdjusted"]
}

const AdjustCamera: FC<AdjustCameraProps> = ({
  object,
  handleIsCameraAdjusted,
}) => {
  const { camera } = useThree()

  useEffect(() => {
    if (!object || !(camera instanceof THREE.PerspectiveCamera)) {
      return
    }

    const box = new THREE.Box3().setFromObject(object)

    if (box.isEmpty()) {
      return
    }

    const center = new THREE.Vector3()
    box.getCenter(center)
    const size = box.getSize(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.fov * (Math.PI / 180)
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))

    camera.position.set(center.x, center.y, cameraZ * 1.5)
    camera.lookAt(center)
    camera.updateProjectionMatrix()

    handleIsCameraAdjusted(true)
  }, [object, camera, handleIsCameraAdjusted])

  return null
}

export default AdjustCamera
