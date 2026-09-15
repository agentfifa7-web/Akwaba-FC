import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { updateStandingAction } from '@/lib/actions/admin-actions'
import { TEAM_SLUGS, TEAM_LABELS, type TeamSlug } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function EditStandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [entry, competitions] = await Promise.all([
    prisma.standingEntry.findUnique({ where: { id } }),
    prisma.competition.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!entry) notFound()

  const fields: FormFieldDef[] = [
    { name: 'competitionId', label: 'Compétition', type: 'select', required: true, options: competitions.map((c) => ({ value: c.id, label: `${c.name} (${c.season})` })) },
    { name: 'category', label: 'Catégorie', type: 'select', required: true, options: TEAM_SLUGS.map((t) => ({ value: t, label: TEAM_LABELS[t as TeamSlug] })) },
    { name: 'club', label: 'Nom du club', type: 'text', required: true },
    { name: 'isClub', label: 'Il s’agit d’AKWABA FC', type: 'checkbox' },
    { name: 'position', label: 'Position', type: 'number', required: true },
    { name: 'played', label: 'Joués', type: 'number' },
    { name: 'won', label: 'Victoires', type: 'number' },
    { name: 'drawn', label: 'Nuls', type: 'number' },
    { name: 'lost', label: 'Défaites', type: 'number' },
    { name: 'goalsFor', label: 'Buts pour', type: 'number' },
    { name: 'goalsAgainst', label: 'Buts contre', type: 'number' },
    { name: 'points', label: 'Points', type: 'number' },
  ]

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Modifier {entry.club}</h1>
      <AdminForm fields={fields} action={updateStandingAction.bind(null, id)} cancelHref="/admin/standings" defaultValues={entry} />
    </div>
  )
}
