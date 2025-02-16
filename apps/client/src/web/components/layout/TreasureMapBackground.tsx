"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import anim from "@client/web/utils/anim"

const TreasureMapBackground = () => {
  const pathRef = useRef<SVGPathElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const circleVariant = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
    },
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-0 h-full">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="paper" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              result="noise"
            />
            <feDiffuseLighting
              in="noise"
              lightingColor="#e6d9c0"
              surfaceScale="2"
            >
              <feDistantLight azimuth="45" elevation="60" />
            </feDiffuseLighting>
          </filter>
          <rect width="100%" height="100%" filter="url(#paper)" />

          <path
            d="M0 25 H3000 M0 75 H3000 M0 125 H3000 M0 175 H3000"
            stroke="#8a4fff20"
            strokeWidth="1"
          />
          <path
            d="M25 0 V3000 M75 0 V3000 M125 0 V3000 M175 0 V3000"
            stroke="#8a4fff20"
            strokeWidth="1"
          />

          <motion.g
            fill="#4A0E4E"
            opacity="0.1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            <motion.circle {...anim(circleVariant)} cx="10%" cy="20%" r="30" />
            <motion.circle {...anim(circleVariant)} cx="30%" cy="70%" r="40" />
            <motion.circle {...anim(circleVariant)} cx="70%" cy="40%" r="35" />
            <motion.circle {...anim(circleVariant)} cx="90%" cy="80%" r="25" />
          </motion.g>

          <motion.circle
            cx={mousePosition.x}
            cy={mousePosition.y}
            r="100"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
            opacity="0.2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
          >
            <animate
              attributeName="r"
              from="60"
              to="100"
              dur="1.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0"
              to="0.8"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </motion.circle>
        </svg>

        <svg
          className="pointer-events-none absolute left-0 top-0 h-full w-full"
          preserveAspectRatio="xMidYMax meet"
        >
          <motion.path
            ref={pathRef}
            d="M0,0 C300,700 700,300 1000,1000 C1300,1700 1700,1300 2000,2000 C2300,2700 2700,2300 3000,3000"
            stroke="#8A4FFF"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="20 15"
            initial={{ strokeDashoffset: 1000 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />

          <motion.path
            d="M2990,2990 l20,20 m0,-20 l-20,20"
            stroke="#FFD700"
            strokeWidth="6"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          />
        </svg>
      </div>
    </>
  )
}

export default TreasureMapBackground
