import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { updateVideoAction } from '@/lib/actions/admin-actions'
import { VIDEO_CATEGORIES, VIDEO_CATEGORY_LABELS, type VideoCategory } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const fields: FormFieldDef[] = [
  { name: 'title', label: 'Titre', type: 'text', required: true, span: 2 },
  { name: 'category', label: 'Catégorie', type: 'select', required: true, options: VIDEO_CATEGORIES.map((c) => ({ value: c, label: VIDEO_CATEGORY_LABELS[c as VideoCategory] })) },
  { name: 'durationSeconds', label: 'Durée (secondes)', type: 'number' },
  { name: 'thumbnailUrl', label: 'Miniature (URL)', type: 'url', required: true, span: 2 },
  { name: 'videoUrl', label: 'Fichier / lien vidéo (URL)', type: 'url', required: true, span: 2 },
  { name: 'description', label: 'Description', type: 'textarea', span: 2 },
  { name: 'isLive', label: '🔴 Marquer comme direct en cours', type: 'checkbox' },
]

export default async function EditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const video = await prisma.video.findUnique({ where: { id } })
  if (!video) notFound()

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Modifier la vidéo</h1>
      <AdminForm fields={fields} action={updateVideoAction.bind(null, id)} cancelHref="/admin/videos" defaultValues={video} />
    </div>
  )
}
