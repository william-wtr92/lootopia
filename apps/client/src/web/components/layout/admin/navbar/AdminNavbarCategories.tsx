import React from "react"

import AdminNavbarLink, { type AdminNavbarLinkProps } from "./AdminNavbarLink"

type Props = {
  label: string
  links: AdminNavbarLinkProps[]
}

const AdminNavbarCategories = ({ label, links }: Props) => {
  return (
    <div className="bg-secondaryBg flex w-full flex-1 flex-col gap-2 px-4 pt-8">
      <span className="text-secondary text-sm uppercase">{label}</span>

      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <AdminNavbarLink
            key={link.label}
            icon={link.icon}
            label={link.label}
            href={link.href}
          />
        ))}
      </div>
    </div>
  )
}

export default AdminNavbarCategories
