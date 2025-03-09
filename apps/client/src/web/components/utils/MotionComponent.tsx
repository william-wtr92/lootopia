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
  ...props
}: {
  children?: ReactNode
  type?: keyof HTMLElementTagNameMap | undefined
  className?: string
  variants?: any
  custom?: any
}) => {
  const Component = type ? motion[type] : motion.div

  return (
    <Component
      className={className}
      variants={variants}
      custom={custom}
      {...props}
    >
      {children}
    </Component>
  )
}
