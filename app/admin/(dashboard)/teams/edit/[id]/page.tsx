import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { updateTeamAction } from '@/lib/actions/admin-actions'

export const dynamic = 'force-dynamic'

const fields: FormFieldDef[] = [
  { name: 'name', label: 'Nom complet', type: 'text', required: true },
  { name: 'shortName', label: 'Nom court', type: 'text', required: true },
  { name: 'tagline', label: 'Accroche', type: 'text', span: 2 },
  { name: 'description', label: 'Description', type: 'textarea', span: 2 },
  { name: 'coverImage', label: 'Image de couverture (URL)', type: 'url', span: 2 },
]

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const team = await prisma.team.findUnique({ where: { id } })
  if (!team) notFound()

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Modifier {team.name}</h1>
      <AdminForm fields={fields} action={updateTeamAction.bind(null, id)} cancelHref="/admin/teams" defaultValues={team} />
    </div>
  )
}
