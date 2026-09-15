import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { deletePressItemAction } from '@/lib/actions/admin-actions'
import { PRESS_ITEM_TYPE_LABELS, type PressItemType } from '@/lib/constants'
import { formatDateShort } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AdminPressPage() {
  const items = await prisma.pressItem.findMany({ orderBy: { publishedAt: 'desc' } })

  return (
    <AdminTable
      title="Espace presse"
      description="Publiez communiqués, dossiers de presse et ressources pour les médias."
      newHref="/admin/press/new"
      columns={[
        { key: 'title', label: 'Titre' },
        { key: 'type', label: 'Type', render: (r) => PRESS_ITEM_TYPE_LABELS[r.type as PressItemType] ?? r.type },
        { key: 'publishedAt', label: 'Date', render: (r) => formatDateShort(r.publishedAt) },
      ]}
      rows={items}
      deleteAction={deletePressItemAction}
    />
  )
}
