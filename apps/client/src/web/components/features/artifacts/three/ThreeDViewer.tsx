import { useState } from "react"

import {
  ObjModel,
  FbxModel,
  StlModel,
  GlbModel,
} from "@client/web/components/features/artifacts/three/Model"

export type ThreeDViewerProps = {
  fileUrl: string
  fileType: string
}

export const ThreeDViewer = ({ fileUrl, fileType }: ThreeDViewerProps) => {
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
          handleIsCameraAdjusted={handleIsCameraAdjusted}
        />
      )

    case "glb":
      return (
        <GlbModel
          fileUrl={fileUrl}
          isCameraAdjusted={isCameraAdjusted}
          handleIsCameraAdjusted={handleIsCameraAdjusted}
        />
      )

    case "fbx":
      return (
        <FbxModel
          fileUrl={fileUrl}
          isCameraAdjusted={isCameraAdjusted}
          handleIsCameraAdjusted={handleIsCameraAdjusted}
        />
      )

    case "stl":
      return (
        <StlModel
          fileUrl={fileUrl}
          isCameraAdjusted={isCameraAdjusted}
          handleIsCameraAdjusted={handleIsCameraAdjusted}
        />
      )

    default:
      return <p>Format non supporté</p>
  }
}
