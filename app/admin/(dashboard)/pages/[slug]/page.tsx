import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { updateCmsPageAction } from '@/lib/actions/admin-actions'

export const dynamic = 'force-dynamic'

const fields: FormFieldDef[] = [
  { name: 'title', label: 'Titre', type: 'text', required: true, span: 2 },
  { name: 'subtitle', label: 'Sous-titre', type: 'text', span: 2 },
  { name: 'body', label: 'Contenu (un paragraphe par ligne vide)', type: 'textarea', required: true, rows: 12, span: 2 },
]

export default async function EditCmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await prisma.cmsPage.findUnique({ where: { slug } })
  if (!page) notFound()

  const blocks = Array.isArray(page.blocks) ? (page.blocks as { type: string; text?: string }[]) : []
  const body = blocks.filter((b) => b.type === 'paragraph').map((b) => b.text).join('\n\n')

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Modifier — {page.title}</h1>
      <AdminForm fields={fields} action={updateCmsPageAction.bind(null, slug)} cancelHref="/admin/pages" defaultValues={{ ...page, body }} />
    </div>
  )
}
