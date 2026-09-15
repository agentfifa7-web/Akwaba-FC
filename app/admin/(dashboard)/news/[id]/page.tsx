import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { updateNewsAction } from '@/lib/actions/admin-actions'
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS, TEAM_SLUGS, TEAM_LABELS, type NewsCategory, type TeamSlug } from '@/lib/constants'

export const dynamic = 'force-dynamic'

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

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const article = await prisma.newsArticle.findUnique({ where: { id }, include: { team: true } })
  if (!article) notFound()

  const blocks = Array.isArray(article.blocks) ? (article.blocks as { type: string; text?: string }[]) : []
  const body = blocks.find((b) => b.type === 'text')?.text ?? ''
  const quote = blocks.find((b) => b.type === 'quote')?.text ?? ''
  const tags = Array.isArray(article.tags) ? (article.tags as string[]).join(', ') : ''

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Modifier l&apos;actualité</h1>
      <AdminForm
        fields={fields}
        action={updateNewsAction.bind(null, id)}
        cancelHref="/admin/news"
        defaultValues={{ ...article, teamSlug: article.team?.slug, body, quote, tags }}
      />
    </div>
  )
}
