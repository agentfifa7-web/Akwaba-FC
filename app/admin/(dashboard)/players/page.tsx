import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { deletePlayerAction } from '@/lib/actions/admin-actions'
import { POSITION_LABELS, type Position } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function AdminPlayersPage() {
  const players = await prisma.player.findMany({ orderBy: [{ team: { name: 'asc' } }, { number: 'asc' }], include: { team: true } })

  return (
    <AdminTable
      title="Joueurs"
      description="Ajoutez, modifiez ou transférez les joueurs des quatre équipes du club."
      newHref="/admin/players/new"
      columns={[
        { key: 'number', label: 'N°' },
        { key: 'name', label: 'Nom', render: (r) => `${r.firstName} ${r.lastName}` },
        { key: 'team', label: 'Équipe', render: (r) => r.team.name },
        { key: 'position', label: 'Poste', render: (r) => POSITION_LABELS[r.position as Position] ?? r.position },
        { key: 'active', label: 'Statut', render: (r) => (r.active ? 'Actif' : 'Inactif') },
      ]}
      rows={players}
      editHref={(r) => `/admin/players/${r.id}`}
      deleteAction={deletePlayerAction}
    />
  )
}
