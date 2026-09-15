import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { DeleteButton } from '@/components/admin/delete-button'
import { updateMatchAction, addMatchEventAction, deleteMatchEventAction } from '@/lib/actions/admin-actions'
import { TEAM_SLUGS, TEAM_LABELS, MATCH_STATUSES, MATCH_STATUS_LABELS, MATCH_EVENT_TYPES, MATCH_EVENT_ICONS, type TeamSlug, type MatchStatus, type MatchEventType } from '@/lib/constants'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

function toLocalInput(date: Date) {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16)
}

export default async function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [match, competitions] = await Promise.all([
    prisma.match.findUnique({ where: { id }, include: { team: true, events: { orderBy: { order: 'asc' } } } }),
    prisma.competition.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!match) notFound()

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

  const addEvent = addMatchEventAction.bind(null, id)

  return (
    <div className="space-y-12">
      <div>
        <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
          {match.team.name} vs {match.opponent}
        </h1>
        <AdminForm
          fields={fields}
          action={updateMatchAction.bind(null, id)}
          cancelHref="/admin/matches"
          defaultValues={{ ...match, teamSlug: match.team.slug, date: toLocalInput(match.date) }}
        />
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl font-bold uppercase text-foreground">Chronologie / Live Match Center</h2>
        <div className="mb-5 space-y-2">
          {match.events.map((event) => (
            <div key={event.id} className="flex items-center gap-4 card-elevated p-3">
              <span className="w-10 shrink-0 text-sm font-bold text-accent-foreground">{event.minute}&apos;</span>
              <span>{MATCH_EVENT_ICONS[event.type as MatchEventType]}</span>
              <span className="flex-1 text-sm">{event.player} {event.detail && <span className="text-muted-foreground">— {event.detail}</span>}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{event.side}</span>
              <DeleteButton id={event.id} action={deleteMatchEventAction} />
            </div>
          ))}
          {match.events.length === 0 && <p className="text-sm text-muted-foreground">Aucun événement pour ce match.</p>}
        </div>
        <form action={addEvent} className="flex flex-wrap items-end gap-3 border-t border-border pt-5">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Minute</label>
            <input name="minute" type="number" min={0} max={130} required className="min-h-11 w-20 border border-border bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</label>
            <select name="type" required className="min-h-11 border border-border bg-background px-3 text-sm">
              {MATCH_EVENT_TYPES.map((t) => (
                <option key={t} value={t}>{MATCH_EVENT_ICONS[t as MatchEventType]} {t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Équipe</label>
            <select name="side" required className="min-h-11 border border-border bg-background px-3 text-sm">
              <option value="HOME">Domicile</option>
              <option value="AWAY">Extérieur</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Joueur</label>
            <input name="player" required className="min-h-11 w-full border border-border bg-background px-3 text-sm" placeholder="Nom du joueur" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Détail (optionnel)</label>
            <input name="detail" className="min-h-11 w-full border border-border bg-background px-3 text-sm" />
          </div>
          <button type="submit" className="rounded-full flex items-center gap-2 bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </form>
      </div>
    </div>
  )
}
