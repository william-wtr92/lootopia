import { useState } from "react"

import {
  ObjModel,
  GltfModel,
  FbxModel,
  StlModel,
} from "@client/web/components/features/artifacts/three/Model"

export type ThreeDViewerProps = {
  fileUrl: string
  fileType: string
  isModelLoaded: boolean
  handleModelLoaded: () => void
}

export const ThreeDViewer = ({
  fileUrl,
  fileType,
  isModelLoaded,
  handleModelLoaded,
}: ThreeDViewerProps) => {
  const [isCameraAdjusted, setIsCameraAdjusted] = useState(false)

  const handleIsCameraAdjusted = (value: boolean) => {
    setIsCameraAdjusted(value)
  }

  switch (fileType) {
    case "obj":
      return (
        <ObjModel
          fileUrl={fileUrl}
          isCameraAdjusted={isCameraAdjusted}
          isModelLoaded={isModelLoaded}
          handleIsCameraAdjusted={handleIsCameraAdjusted}
          handleModelLoaded={handleModelLoaded}
        />
      )

    case "gltf":

    case "glb":
      return (
        <GltfModel
          fileUrl={fileUrl}
          isCameraAdjusted={isCameraAdjusted}
          isModelLoaded={isModelLoaded}
          handleIsCameraAdjusted={handleIsCameraAdjusted}
          handleModelLoaded={handleModelLoaded}
        />
      )

    case "fbx":
      return (
        <FbxModel
          fileUrl={fileUrl}
          isCameraAdjusted={isCameraAdjusted}
          isModelLoaded={isModelLoaded}
          handleIsCameraAdjusted={handleIsCameraAdjusted}
          handleModelLoaded={handleModelLoaded}
        />
      )

    case "stl":
      return (
        <StlModel
          fileUrl={fileUrl}
          isCameraAdjusted={isCameraAdjusted}
          isModelLoaded={isModelLoaded}
          handleIsCameraAdjusted={handleIsCameraAdjusted}
          handleModelLoaded={handleModelLoaded}
        />
      )

    default:
      return <p>Format non supporté</p>
  }
}
