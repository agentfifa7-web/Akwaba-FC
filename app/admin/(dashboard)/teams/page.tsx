import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'

export const dynamic = 'force-dynamic'

export default async function AdminTeamsPage() {
  const teams = await prisma.team.findMany({ include: { _count: { select: { players: true } } } })

  return (
    <AdminTable
      title="Équipes"
      description="Les quatre catégories du club. Gérez les effectifs depuis la section Joueurs."
      columns={[
        { key: 'name', label: 'Équipe' },
        { key: 'shortName', label: 'Nom court' },
        { key: 'players', label: 'Effectif', render: (r) => `${r._count.players} joueurs` },
      ]}
      rows={teams}
      editHref={(r) => `/admin/teams/edit/${r.id}`}
    />
  )
}
