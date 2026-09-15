import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { deleteVideoAction } from '@/lib/actions/admin-actions'
import { VIDEO_CATEGORY_LABELS, type VideoCategory } from '@/lib/constants'
import { formatDateShort, formatDuration } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AdminVideosPage() {
  const videos = await prisma.video.findMany({ orderBy: { publishedAt: 'desc' } })

  return (
    <AdminTable
      title="Vidéos / Club TV"
      description="Publiez les contenus vidéo du club : matchs, interviews, coulisses, directs."
      newHref="/admin/videos/new"
      columns={[
        { key: 'title', label: 'Titre' },
        { key: 'category', label: 'Catégorie', render: (r) => VIDEO_CATEGORY_LABELS[r.category as VideoCategory] ?? r.category },
        { key: 'isLive', label: 'Live', render: (r) => (r.isLive ? '🔴 En direct' : '—') },
        { key: 'durationSeconds', label: 'Durée', render: (r) => formatDuration(r.durationSeconds) },
        { key: 'publishedAt', label: 'Date', render: (r) => formatDateShort(r.publishedAt) },
      ]}
      rows={videos}
      editHref={(r) => `/admin/videos/${r.id}`}
      deleteAction={deleteVideoAction}
    />
  )
}
