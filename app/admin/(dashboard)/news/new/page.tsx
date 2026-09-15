import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { createNewsAction } from '@/lib/actions/admin-actions'
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS, TEAM_SLUGS, TEAM_LABELS, type NewsCategory, type TeamSlug } from '@/lib/constants'

const fields: FormFieldDef[] = [
  { name: 'title', label: 'Titre', type: 'text', required: true, span: 2 },
  { name: 'excerpt', label: 'Chapeau / résumé', type: 'textarea', required: true, rows: 2, span: 2 },
  { name: 'category', label: 'Catégorie', type: 'select', required: true, options: NEWS_CATEGORIES.map((c) => ({ value: c, label: NEWS_CATEGORY_LABELS[c as NewsCategory] })) },
  { name: 'teamSlug', label: 'Équipe associée (optionnel)', type: 'select', options: TEAM_SLUGS.map((t) => ({ value: t, label: TEAM_LABELS[t as TeamSlug] })) },
  { name: 'coverImage', label: 'Image de couverture (URL)', type: 'url', required: true, span: 2 },
  { name: 'author', label: 'Auteur', type: 'text', required: true },
  { name: 'featured', label: 'Mettre à la une', type: 'checkbox' },
  { name: 'body', label: 'Corps de l’article', type: 'textarea', required: true, rows: 8, span: 2 },
  { name: 'quote', label: 'Citation (optionnel)', type: 'text', span: 2 },
  { name: 'tags', label: 'Tags (séparés par des virgules)', type: 'text', span: 2 },
]

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Nouvelle actualité</h1>
      <AdminForm fields={fields} action={createNewsAction} cancelHref="/admin/news" />
    </div>
  )
}
