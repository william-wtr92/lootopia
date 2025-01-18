"use client"

import React, { type FC } from "react"

type Props = React.SVGProps<SVGSVGElement> & {
  width: number
  height: number
}

const Logo: FC<Props> = (props: Props) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="40" y="80" width="120" height="80" fill="#4A0E4E" />

      <path d="M30 80 L100 40 L170 80 Z" fill="#8A4FFF" />

      <rect x="90" y="100" width="20" height="30" fill="#FFD700" />
      <circle cx="100" cy="115" r="5" fill="#4A0E4E" />

      <circle cx="70" cy="70" r="15" fill="#FFD700" />
      <circle cx="130" cy="60" r="12" fill="#FFD700" />

      <text
        x="100"
        y="185"
        fontFamily="Fredoka, sans-serif"
        fontSize="24"
        fontWeight="bold"
        fill="#4A0E4E"
        textAnchor="middle"
      >
        LOOTOPIA
      </text>
    </svg>
  )
}

export default Logo
