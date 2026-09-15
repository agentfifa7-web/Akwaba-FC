import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { createMatchAction } from '@/lib/actions/admin-actions'
import { TEAM_SLUGS, TEAM_LABELS, MATCH_STATUSES, MATCH_STATUS_LABELS, type TeamSlug, type MatchStatus } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function NewMatchPage() {
  const competitions = await prisma.competition.findMany({ orderBy: { name: 'asc' } })

  const fields: FormFieldDef[] = [
    { name: 'teamSlug', label: 'Équipe', type: 'select', required: true, options: TEAM_SLUGS.map((t) => ({ value: t, label: TEAM_LABELS[t as TeamSlug] })) },
    { name: 'competitionId', label: 'Compétition', type: 'select', required: true, options: competitions.map((c) => ({ value: c.id, label: `${c.name} (${c.season})` })) },
    { name: 'opponent', label: 'Adversaire', type: 'text', required: true },
    { name: 'isHome', label: 'Match à domicile', type: 'checkbox' },
    { name: 'date', label: 'Date et heure', type: 'datetime-local', required: true },
    { name: 'stadium', label: 'Stade', type: 'text', required: true },
    { name: 'matchday', label: 'Journée / phase', type: 'text' },
    { name: 'status', label: 'Statut', type: 'select', required: true, options: MATCH_STATUSES.map((s) => ({ value: s, label: MATCH_STATUS_LABELS[s as MatchStatus] })) },
    { name: 'homeScore', label: 'Score domicile', type: 'number' },
    { name: 'awayScore', label: 'Score extérieur', type: 'number' },
  ]

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Nouveau match</h1>
      <AdminForm fields={fields} action={createMatchAction} cancelHref="/admin/matches" defaultValues={{ isHome: true, status: 'SCHEDULED' }} />
    </div>
  )
}
