"use client"

import React, { type ReactNode } from "react"

type Props = {
  icon: ReactNode
  title: string
  description: string
}

const FeatureCard = (props: Props) => {
  const { icon, title, description } = props

  return (
    <div className="bg-primaryBg rounded-lg border p-6 text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-primary mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-primary">{description}</p>
    </div>
  )
}

export default FeatureCard
