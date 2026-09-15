import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { deleteStaffAction } from '@/lib/actions/admin-actions'
import { STAFF_DEPARTMENT_LABELS, type StaffDepartment } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function AdminStaffPage() {
  const staff = await prisma.staffMember.findMany({ orderBy: [{ department: 'asc' }, { order: 'asc' }] })

  return (
    <AdminTable
      title="Staff"
      description="Gérez la direction et le staff technique, sportif et académique du club."
      newHref="/admin/staff/new"
      columns={[
        { key: 'name', label: 'Nom' },
        { key: 'role', label: 'Fonction' },
        { key: 'department', label: 'Département', render: (r) => STAFF_DEPARTMENT_LABELS[r.department as StaffDepartment] ?? r.department },
      ]}
      rows={staff}
      editHref={(r) => `/admin/staff/${r.id}`}
      deleteAction={deleteStaffAction}
    />
  )
}
