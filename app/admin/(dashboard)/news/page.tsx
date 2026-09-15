import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { deleteNewsAction } from '@/lib/actions/admin-actions'
import { NEWS_CATEGORY_LABELS, type NewsCategory } from '@/lib/constants'
import { formatDateShort } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AdminNewsPage() {
  const articles = await prisma.newsArticle.findMany({ orderBy: { publishedAt: 'desc' } })

  return (
    <AdminTable
      title="Actualités"
      description="Créez, modifiez et publiez les actualités du club."
      newHref="/admin/news/new"
      columns={[
        { key: 'title', label: 'Titre' },
        { key: 'category', label: 'Catégorie', render: (r) => NEWS_CATEGORY_LABELS[r.category as NewsCategory] ?? r.category },
        { key: 'featured', label: 'Une', render: (r) => (r.featured ? 'Oui' : '—') },
        { key: 'publishedAt', label: 'Date', render: (r) => formatDateShort(r.publishedAt) },
      ]}
      rows={articles}
      editHref={(r) => `/admin/news/${r.id}`}
      deleteAction={deleteNewsAction}
    />
  )
}
