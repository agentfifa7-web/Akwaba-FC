import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { createGalleryImageAction } from '@/lib/actions/admin-actions'
import { GALLERY_CATEGORIES, GALLERY_CATEGORY_LABELS, type GalleryCategory } from '@/lib/constants'

const fields: FormFieldDef[] = [
  { name: 'url', label: 'Image (URL)', type: 'url', required: true, span: 2 },
  { name: 'caption', label: 'Légende', type: 'text', span: 2 },
  { name: 'category', label: 'Catégorie', type: 'select', required: true, options: GALLERY_CATEGORIES.map((c) => ({ value: c, label: GALLERY_CATEGORY_LABELS[c as GalleryCategory] })) },
]

export default function NewGalleryImagePage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Ajouter une photo</h1>
      <AdminForm fields={fields} action={createGalleryImageAction} cancelHref="/admin/gallery" />
    </div>
  )
}
