import Link, { type LinkProps } from "next/link"

import type { Routes } from "@client/utils/routes"

type CustomLinkProps = Omit<LinkProps, "href"> & {
  href: Routes
  children: React.ReactNode
}

const CustomLink = ({ href, children, ...props }: CustomLinkProps) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

export default CustomLink
