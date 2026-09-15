import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'

export const dynamic = 'force-dynamic'

export default async function AdminPagesPage() {
  const pages = await prisma.cmsPage.findMany({ orderBy: { title: 'asc' } })

  return (
    <AdminTable
      title="Pages du club"
      description="Modifiez le contenu éditorial des pages Notre histoire, Nos valeurs, Palmarès, Stade et Gouvernance."
      columns={[
        { key: 'title', label: 'Page' },
        { key: 'slug', label: 'URL', render: (r) => `/club/${r.slug}` },
      ]}
      rows={pages}
      editHref={(r) => `/admin/pages/${r.slug}`}
    />
  )
}
