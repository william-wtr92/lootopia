/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { motion } from "framer-motion"
import React, { type ReactNode } from "react"

export const MotionComponent = ({
  children,
  type,
  className,
  variants,
  custom,
  onClick,
  initial,
  animate,
  exit,
  ...props
}: {
  children?: ReactNode
  type?: keyof HTMLElementTagNameMap | undefined
  className?: string
  variants?: any
  custom?: any
  onClick?: (e?: any) => void
  initial?: string
  animate?: string
  exit?: string
}) => {
  const Component = type ? motion[type] : motion.div

  return (
    <Component
      className={className}
      variants={variants}
      custom={custom}
      onClick={onClick}
      initial={initial}
      animate={animate}
      exit={exit}
      {...props}
    >
      {children}
    </Component>
  )
}
