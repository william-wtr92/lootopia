import { OrbitControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect, type FC } from "react"
import * as THREE from "three"

import type { ModelProps } from "@client/web/components/features/artifacts/three/Model"
import type { ThreeDViewerProps } from "@client/web/components/features/artifacts/three/ThreeDViewer"

type AdjustCameraProps = {
  format: ThreeDViewerProps["fileType"]
  object: THREE.Object3D
  handleIsCameraAdjusted: ModelProps["handleIsCameraAdjusted"]
}

type AdjustCameraObjProps = {
  object: THREE.Object3D
  handleIsCameraAdjusted: ModelProps["handleIsCameraAdjusted"]
}

type AdjustCameraGlbProps = {
  object: THREE.Object3D
}

type AdjustCameraFbxProps = {
  object: THREE.Object3D
  handleIsCameraAdjusted: ModelProps["handleIsCameraAdjusted"]
}

export const AdjustCamera = ({
  format,
  object,
  handleIsCameraAdjusted,
}: AdjustCameraProps) => {
  const { camera, scene } = useThree()

  const boundingBox = new THREE.Box3().setFromObject(object)
  const center = boundingBox.getCenter(new THREE.Vector3())

  const getOrbitControls = () => {
    switch (format) {
      case "obj":
        return (
          <OrbitControls
            minDistance={30}
            maxDistance={400}
            enableZoom={false}
          />
        )

      case "fbx":
        return <OrbitControls makeDefault enableZoom={false} target={center} />

      default:
        return <OrbitControls makeDefault enableZoom={false} />
    }
  }

  useEffect(() => {
    if (!object || !(camera instanceof THREE.PerspectiveCamera)) {
      return
    }

    if (!scene.children.includes(object)) {
      scene.add(object)
    }

    const size = boundingBox.getSize(new THREE.Vector3())
    const maxSize = Math.max(size.x, size.y, size.z)

    const fov = camera.fov * (Math.PI / 180)

    let distance = maxSize * 2
    const cameraX = center.x
    const cameraY = center.y
    let cameraZ = center.z

    if (format === "obj") {
      cameraZ = Math.abs(maxSize / 2 / Math.tan(fov / 2)) * 1.5
    }

    if (format === "glb") {
      distance = Math.abs(maxSize / Math.sin(fov / 2)) * 0.8
      cameraZ = center.z + distance
    }

    if (format === "fbx") {
      distance = Math.abs(maxSize / Math.sin(fov / 2)) * 0.7
      cameraZ = center.z + distance
    }

    camera.position.set(cameraX, cameraY, cameraZ)
    camera.lookAt(center)
    camera.updateProjectionMatrix()

    handleIsCameraAdjusted(true)
  }, [
    object,
    camera,
    handleIsCameraAdjusted,
    scene,
    boundingBox,
    center,
    format,
  ])

  return getOrbitControls()
}

export const AdjustCameraObj: FC<AdjustCameraObjProps> = ({
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
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5

    camera.position.set(center.x, center.y, cameraZ)
    camera.lookAt(center)
    camera.updateProjectionMatrix()

    handleIsCameraAdjusted(true)
  }, [object, camera, handleIsCameraAdjusted])

  return <OrbitControls minDistance={30} maxDistance={400} enableZoom={false} />
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

export const AdjustCameraFbx = ({
  object,
  handleIsCameraAdjusted,
}: AdjustCameraFbxProps) => {
  const { camera, scene } = useThree()

  const boundingBox = new THREE.Box3().setFromObject(object)
  const center = boundingBox.getCenter(new THREE.Vector3())

  useEffect(() => {
    if (!object) {
      return
    }

    if (!scene.children.includes(object)) {
      scene.add(object)
    }

    const size = boundingBox.getSize(new THREE.Vector3())
    const maxSize = Math.max(size.x, size.y, size.z)

    let distance = maxSize * 2

    if (camera instanceof THREE.PerspectiveCamera) {
      const fov = camera.fov * (Math.PI / 180)
      distance = Math.abs(maxSize / Math.sin(fov / 2)) * 0.7
    }

    const cameraZ = center.z + distance

    // ✅ Regarder le centre exact de l'objet
    camera.position.set(center.x, center.y, cameraZ)
    camera.lookAt(center)
    camera.updateProjectionMatrix()

    handleIsCameraAdjusted(true)
  }, [object, camera, scene, boundingBox, center, handleIsCameraAdjusted])

  return <OrbitControls makeDefault enableZoom={false} target={center} />
}
