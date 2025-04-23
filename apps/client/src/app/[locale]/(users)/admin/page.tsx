import { Card, CardContent, CardHeader, CardTitle } from "@lootopia/ui"
import AdminUserTable from "@client/web/components/features/admin/users/adminUserTable"

const AdminUsersPage = () => {
  return (
    <main className="relative flex flex-1 flex-col items-center gap-8 px-6 py-10">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary font-bold">
            Gestion des utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminUserTable />
        </CardContent>
      </Card>
    </main>
  )
}

export default AdminUsersPage
