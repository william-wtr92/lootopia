"use client"

import { motion } from "framer-motion"
import React, { type ReactNode } from "react"

export const MotionComponent = ({
  type,
  children,
  className,
  ...props
}: {
  type?: keyof HTMLElementTagNameMap | undefined
  className?: string
  children: ReactNode
}) => {
  const Component = type ? motion[type] : motion.div

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}
