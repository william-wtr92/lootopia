import { useState } from "react"

import { Model } from "@client/web/components/features/artifacts/three/Model"

export type ThreeDViewerProps = {
  fileUrl: string
  fileType: string
}

export const ThreeDViewer = ({ fileUrl }: ThreeDViewerProps) => {
  const [isCameraAdjusted, setIsCameraAdjusted] = useState(false)

  const handleIsCameraAdjusted = (value: boolean) => {
    setIsCameraAdjusted(value)
  }

  // const getModel = () => {
  //   switch (fileType) {
  //     case "obj":
  //       return (
  //         <ObjModel
  //           fileUrl={fileUrl}
  //           isCameraAdjusted={isCameraAdjusted}
  //           handleIsCameraAdjusted={handleIsCameraAdjusted}
  //         />
  //       )

  //     case "glb":
  //       return (
  //         <GlbModel
  //           fileUrl={fileUrl}
  //           isCameraAdjusted={isCameraAdjusted}
  //           handleIsCameraAdjusted={handleIsCameraAdjusted}
  //         />
  //       )

  //     case "fbx":
  //       return (
  //         <FbxModel
  //           fileUrl={fileUrl}
  //           isCameraAdjusted={isCameraAdjusted}
  //           handleIsCameraAdjusted={handleIsCameraAdjusted}
  //         />
  //       )

  //     default:
  //       return <p>Format non supporté</p>
  //   }
  // }

  return (
    <Model
      fileUrl={fileUrl}
      isCameraAdjusted={isCameraAdjusted}
      handleIsCameraAdjusted={handleIsCameraAdjusted}
    />
  )
}
