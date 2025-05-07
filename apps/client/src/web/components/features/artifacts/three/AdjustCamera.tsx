import { ACCEPTED_FILE_TYPES } from "@lootopia/common"
import { OrbitControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useEffect } from "react"
import * as THREE from "three"

type Props = {
  format: string
  object: THREE.Object3D
  handleIsCameraAdjusted: (value: boolean) => void
}

export const AdjustCamera = ({
  format,
  object,
  handleIsCameraAdjusted,
}: Props) => {
  const { camera, scene } = useThree()

  const boundingBox = new THREE.Box3().setFromObject(object)
  const center = boundingBox.getCenter(new THREE.Vector3())

  const getOrbitControls = () => {
    switch (format) {
      case ACCEPTED_FILE_TYPES.obj:
        return (
          <OrbitControls
            minDistance={30}
            maxDistance={400}
            enableZoom={false}
          />
        )

      case ACCEPTED_FILE_TYPES.fbx:
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

    if (format === ACCEPTED_FILE_TYPES.obj) {
      cameraZ = Math.abs(maxSize / 2 / Math.tan(fov / 2)) * 1.5
    }

    if (format === ACCEPTED_FILE_TYPES.glb) {
      distance = Math.abs(maxSize / Math.sin(fov / 2)) * 0.8
      cameraZ = center.z + distance
    }

    if (format === ACCEPTED_FILE_TYPES.fbx) {
      distance = Math.abs(maxSize / Math.sin(fov / 2)) * 0.7
      cameraZ += distance
    }

    camera.position.set(cameraX, cameraY, cameraZ)
    camera.lookAt(center)
    camera.updateProjectionMatrix()

    if (format !== ACCEPTED_FILE_TYPES.glb) {
      handleIsCameraAdjusted(true)
    }
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
