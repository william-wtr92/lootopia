"use client"

import React, { type ReactNode } from "react"

import { Link } from "@client/i18n/routing"

export type AdminNavbarLinkProps = {
  icon: ReactNode
  label: string
  href: string
}

const AdminNavbarLink = ({ icon, label, href }: AdminNavbarLinkProps) => {
  return (
    <Link
      href={href}
      className="hover:text-accent hover:bg-primary text-primary flex items-start justify-start gap-2 rounded-md p-2 px-4 duration-300 hover:bg-opacity-20"
    >
      {icon}
      <span> {label}</span>
    </Link>
  )
}

export default AdminNavbarLink
