import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { deleteStandingAction } from '@/lib/actions/admin-actions'
import { TEAM_LABELS, type TeamSlug } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function AdminStandingsPage() {
  const rows = await prisma.standingEntry.findMany({ orderBy: [{ category: 'asc' }, { position: 'asc' }], include: { competition: true } })

  return (
    <AdminTable
      title="Classements"
      description="Gérez le classement d'AKWABA FC et des autres clubs pour chaque compétition."
      newHref="/admin/standings/new"
      columns={[
        { key: 'category', label: 'Catégorie', render: (r) => TEAM_LABELS[r.category as TeamSlug] ?? r.category },
        { key: 'competition', label: 'Compétition', render: (r) => r.competition.name },
        { key: 'position', label: '#' },
        { key: 'club', label: 'Club', render: (r) => (r.isClub ? `${r.club} (AKWABA FC)` : r.club) },
        { key: 'points', label: 'Pts' },
      ]}
      rows={rows}
      editHref={(r) => `/admin/standings/${r.id}`}
      deleteAction={deleteStandingAction}
    />
  )
}
