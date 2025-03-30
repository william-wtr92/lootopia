import { OrbitControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect, type FC } from "react"
import * as THREE from "three"

import type { ModelProps } from "@client/web/components/features/artifacts/three/Model"

type AdjustCameraProps = {
  object: THREE.Object3D
  handleIsCameraAdjusted: ModelProps["handleIsCameraAdjusted"]
}

type AdjustCameraGlbProps = {
  object: THREE.Object3D
}

export const AdjustCameraObj: FC<AdjustCameraProps> = ({
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

  return <OrbitControls minDistance={30} maxDistance={400} />
}

export const AdjustCameraGlb = ({ object }: AdjustCameraGlbProps) => {
  const { camera, scene } = useThree()

  // This useEffect goal is :
  // - to calculate the right distance for the camera so the object is visible in the scene
  // - to center in on the object
  useEffect(() => {
    if (!object) {
      return
    }

    if (!scene.children.includes(object)) {
      scene.add(object)
    }

    // Calculer la Bounding Box
    const box = new THREE.Box3().setFromObject(object)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    // Trouver la plus grande dimension
    const maxSize = Math.max(size.x, size.y, size.z)

    // Calculer la distance idéale pour bien voir l'objet
    let distance = maxSize * 2 // Default distance for OrthographicCamera

    if (camera instanceof THREE.PerspectiveCamera) {
      const fov = camera.fov * (Math.PI / 180) // Convertir en radians
      distance = Math.abs(maxSize / Math.sin(fov / 2)) * 0.8
    }

    // Positionner la caméra
    camera.position.set(center.x, center.y, center.z + distance)
    camera.lookAt(center)
    camera.updateProjectionMatrix()
  }, [object, camera, scene])

  return <OrbitControls makeDefault enableZoom={false} />
}
