import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { DeleteButton } from '@/components/admin/delete-button'
import { deleteMatchAction, deleteCompetitionAction, createCompetitionAction } from '@/lib/actions/admin-actions'
import { MATCH_STATUS_LABELS, type MatchStatus } from '@/lib/constants'
import { formatDateShort } from '@/lib/format'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminMatchesPage() {
  const [matches, competitions] = await Promise.all([
    prisma.match.findMany({ orderBy: { date: 'desc' }, include: { team: true, competition: true } }),
    prisma.competition.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { matches: true } } } }),
  ])

  return (
    <div className="space-y-12">
      <AdminTable
        title="Matchs"
        description="Créez les rencontres, mettez à jour les scores et gérez les événements en direct."
        newHref="/admin/matches/new"
        columns={[
          { key: 'team', label: 'Équipe', render: (r) => r.team.name },
          { key: 'opponent', label: 'Adversaire', render: (r) => `${r.isHome ? 'vs' : '@'} ${r.opponent}` },
          { key: 'competition', label: 'Compétition', render: (r) => r.competition.name },
          { key: 'date', label: 'Date', render: (r) => formatDateShort(r.date) },
          { key: 'status', label: 'Statut', render: (r) => MATCH_STATUS_LABELS[r.status as MatchStatus] ?? r.status },
          { key: 'score', label: 'Score', render: (r) => (r.homeScore !== null ? `${r.homeScore} - ${r.awayScore}` : '—') },
        ]}
        rows={matches}
        editHref={(r) => `/admin/matches/${r.id}`}
        deleteAction={deleteMatchAction}
      />

      <div>
        <h2 className="mb-4 font-display text-xl font-bold uppercase text-foreground">Compétitions</h2>
        <div className="overflow-x-auto card-elevated">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Saison</th>
                <th className="px-4 py-3">Matchs</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {competitions.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3">{c.season}</td>
                  <td className="px-4 py-3">{c._count.matches}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton id={c.id} action={deleteCompetitionAction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form action={createCompetitionAction} className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nom</label>
            <input name="name" required className="min-h-11 border border-border bg-background px-3 text-sm" placeholder="Ex. Coupe de la Ligue" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Saison</label>
            <input name="season" required className="min-h-11 border border-border bg-background px-3 text-sm" placeholder="2026/2027" />
          </div>
          <button type="submit" className="rounded-full flex items-center gap-2 bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </form>
      </div>
    </div>
  )
}
