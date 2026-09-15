import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { ToggleActiveButton } from '@/components/admin/toggle-active-button'
import { deleteUserAction, toggleUserActiveAction } from '@/lib/actions/admin-actions'
import { ROLE_LABELS, type Role } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <AdminTable
      title="Utilisateurs"
      description="Gérez les comptes et rôles du personnel autorisé à administrer la plateforme."
      newHref="/admin/users/new"
      columns={[
        { key: 'name', label: 'Nom' },
        { key: 'email', label: 'E-mail' },
        { key: 'role', label: 'Rôle', render: (r) => ROLE_LABELS[r.role as Role] ?? r.role },
        { key: 'active', label: 'Statut', render: (r) => <ToggleActiveButton id={r.id} active={r.active} action={toggleUserActiveAction} /> },
      ]}
      rows={users}
      deleteAction={deleteUserAction}
    />
  )
}
