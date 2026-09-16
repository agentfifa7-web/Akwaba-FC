import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { DeleteButton } from '@/components/admin/delete-button'
import { updateMatchAction, addMatchEventAction, deleteMatchEventAction, saveMatchSheetAction } from '@/lib/actions/admin-actions'
import { TEAM_SLUGS, TEAM_LABELS, MATCH_STATUSES, MATCH_STATUS_LABELS, MATCH_EVENT_TYPES, MATCH_EVENT_ICONS, POSITION_LABELS, type TeamSlug, type MatchStatus, type MatchEventType, type Position } from '@/lib/constants'
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

  const [squad, appearances] = await Promise.all([
    prisma.player.findMany({ where: { teamId: match.teamId }, orderBy: { number: 'asc' } }),
    prisma.matchAppearance.findMany({ where: { matchId: id } }),
  ])
  const appearanceByPlayer = new Map(appearances.map((a) => [a.playerId, a]))

  const fields: FormFieldDef[] = [
    { name: 'teamSlug', label: 'Équipe', type: 'select', required: true, options: TEAM_SLUGS.map((t) => ({ value: t, label: TEAM_LABELS[t as TeamSlug] })) },
    { name: 'competitionId', label: 'Compétition', type: 'select', required: true, options: competitions.map((c) => ({ value: c.id, label: `${c.name} (${c.season})` })) },
    { name: 'opponent', label: 'Adversaire', type: 'text', required: true },
    { name: 'opponentLogo', label: 'Logo adversaire (URL, optionnel — généré automatiquement sinon)', type: 'text' },
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
        <h2 className="mb-2 font-display text-xl font-bold uppercase text-foreground">Feuille de match</h2>
        <p className="mb-5 text-xs text-muted-foreground">
          Cochez les joueurs ayant participé, renseignez minutes / buts / passes / cartons. Les statistiques globales et
          par compétition de chaque joueur (fiche joueur publique) sont recalculées automatiquement à l&apos;enregistrement.
        </p>
        <form action={saveMatchSheetAction.bind(null, id)}>
          <div className="overflow-x-auto card-elevated">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary text-[10px] uppercase tracking-widest text-muted-foreground">
                  <th className="px-3 py-3">Sélection</th>
                  <th className="px-3 py-3">Joueur</th>
                  <th className="px-3 py-3">Titulaire</th>
                  <th className="px-3 py-3 text-right">Minutes</th>
                  <th className="px-3 py-3 text-right">Buts</th>
                  <th className="px-3 py-3 text-right">Passes D.</th>
                  <th className="px-3 py-3 text-right">🟨</th>
                  <th className="px-3 py-3 text-right">🟥</th>
                </tr>
              </thead>
              <tbody>
                {squad.map((player) => {
                  const a = appearanceByPlayer.get(player.id)
                  return (
                    <tr key={player.id} className="border-b border-border last:border-b-0">
                      <td className="px-3 py-2.5">
                        <input type="checkbox" name={`selected_${player.id}`} defaultChecked={Boolean(a)} className="h-4 w-4" />
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="font-bold">#{player.number}</span> {player.firstName} {player.lastName}
                        <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                          {POSITION_LABELS[player.position as Position]}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <input type="checkbox" name={`started_${player.id}`} defaultChecked={a ? a.started : true} className="h-4 w-4" />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input type="number" min={0} max={120} name={`minutes_${player.id}`} defaultValue={a?.minutesPlayed ?? 0} className="min-h-9 w-16 border border-border bg-background px-2 text-right text-sm" />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input type="number" min={0} name={`goals_${player.id}`} defaultValue={a?.goals ?? 0} className="min-h-9 w-14 border border-border bg-background px-2 text-right text-sm" />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input type="number" min={0} name={`assists_${player.id}`} defaultValue={a?.assists ?? 0} className="min-h-9 w-14 border border-border bg-background px-2 text-right text-sm" />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input type="number" min={0} max={2} name={`yellow_${player.id}`} defaultValue={a?.yellowCards ?? 0} className="min-h-9 w-14 border border-border bg-background px-2 text-right text-sm" />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <input type="number" min={0} max={1} name={`red_${player.id}`} defaultValue={a?.redCards ?? 0} className="min-h-9 w-14 border border-border bg-background px-2 text-right text-sm" />
                      </td>
                    </tr>
                  )
                })}
                {squad.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-sm text-muted-foreground">
                      Aucun joueur dans cet effectif.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button type="submit" className="rounded-full mt-5 flex items-center gap-2 bg-primary px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
            Enregistrer la feuille de match
          </button>
        </form>
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
