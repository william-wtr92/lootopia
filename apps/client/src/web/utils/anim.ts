import type { Variants } from "framer-motion"

const anim = (variants: Variants) => {
  return {
    initial: "initial",
    animate: "enter",
    exit: "exit",
    variants,
  }
}

export default anim
