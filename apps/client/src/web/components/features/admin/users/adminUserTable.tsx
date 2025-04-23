"use client"

import { Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from "@lootopia/ui"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getUserList } from "@client/web/services/users/getUserList"
import { type UserSchema } from "@lootopia/common"
import { Input } from "@lootopia/ui"
import { Button } from "@lootopia/ui"

const AdminUserTable = () => {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const limit = 10

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-users", search, page],
    queryFn: () => getUserList({ search, page, limit }),
  })

  const users = data?.result || []
  const total = data?.total || 0

  useEffect(() => {
    const delay = setTimeout(() => {
      refetch()
    }, 300)

    return () => clearTimeout(delay)
  }, [search, page, refetch])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4}>Chargement...</TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>Aucun utilisateur trouvé</TableCell>
            </TableRow>
          ) : (
            users.map((user: UserSchema) => (
              <TableRow key={user.id}>
                <TableCell>{user.nickname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.active ? (
                    <span className="text-green-600">Actif</span>
                  ) : (
                    <span className="text-red-500">Inactif</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page * limit >= total}
        >
          Suivant
        </Button>
      </div>
    </div>
  )
}

export default AdminUserTable