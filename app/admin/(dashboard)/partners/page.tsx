import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { deletePartnerAction } from '@/lib/actions/admin-actions'
import { PARTNER_CATEGORY_LABELS, type PartnerCategory } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] })

  return (
    <AdminTable
      title="Partenaires"
      description="Gérez les partenaires principaux, officiels, sponsors et institutionnels."
      newHref="/admin/partners/new"
      columns={[
        { key: 'logo', label: 'Logo', render: (r) => <img src={r.logoUrl} alt="" className="h-10 w-10 rounded-full object-cover" /> },
        { key: 'name', label: 'Nom' },
        { key: 'category', label: 'Catégorie', render: (r) => PARTNER_CATEGORY_LABELS[r.category as PartnerCategory] ?? r.category },
      ]}
      rows={partners}
      editHref={(r) => `/admin/partners/${r.id}`}
      deleteAction={deletePartnerAction}
    />
  )
}
