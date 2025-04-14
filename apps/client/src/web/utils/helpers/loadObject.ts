/* eslint-disable react-hooks/rules-of-hooks */
import { useGLTF } from "@react-three/drei"
import { useLoader } from "@react-three/fiber"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"

export const loadObject = (fileUrl: string) => {
  const fileType = fileUrl.split(".").pop()

  switch (fileType) {
    case "obj": {
      const obj = useLoader(OBJLoader, fileUrl)

      return obj
    }

    case "fbx": {
      const obj = useLoader(FBXLoader, fileUrl)

      return obj
    }

    default: {
      const { scene } = useGLTF(fileUrl)

      return scene
    }
  }
}
