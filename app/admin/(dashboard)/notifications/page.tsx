import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { deleteNotificationAction } from '@/lib/actions/admin-actions'
import { formatDateShort } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AdminNotificationsPage() {
  const notifications = await prisma.notification.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <AdminTable
      title="Notifications"
      description="Composez les notifications envoyées aux supporters (architecture prête pour les notifications push mobiles/web)."
      newHref="/admin/notifications/new"
      columns={[
        { key: 'icon', label: '' },
        { key: 'title', label: 'Titre' },
        { key: 'body', label: 'Message' },
        { key: 'createdAt', label: 'Date', render: (r) => formatDateShort(r.createdAt) },
      ]}
      rows={notifications}
      deleteAction={deleteNotificationAction}
    />
  )
}
