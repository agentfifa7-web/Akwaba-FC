import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { deleteGalleryImageAction } from '@/lib/actions/admin-actions'
import { GALLERY_CATEGORY_LABELS, type GalleryCategory } from '@/lib/constants'
import { formatDateShort } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AdminGalleryPage() {
  const images = await prisma.galleryImage.findMany({ orderBy: { publishedAt: 'desc' } })

  return (
    <AdminTable
      title="Galerie"
      description="Ajoutez des photos du club, classées par catégorie."
      newHref="/admin/gallery/new"
      columns={[
        { key: 'preview', label: 'Aperçu', render: (r) => <img src={r.url} alt="" className="h-12 w-16 object-cover" /> },
        { key: 'caption', label: 'Légende' },
        { key: 'category', label: 'Catégorie', render: (r) => GALLERY_CATEGORY_LABELS[r.category as GalleryCategory] ?? r.category },
        { key: 'publishedAt', label: 'Date', render: (r) => formatDateShort(r.publishedAt) },
      ]}
      rows={images}
      deleteAction={deleteGalleryImageAction}
    />
  )
}
