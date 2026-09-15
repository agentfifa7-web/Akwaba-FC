import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { updatePlayerAction } from '@/lib/actions/admin-actions'
import { POSITIONS, POSITION_LABELS, TEAM_SLUGS, TEAM_LABELS, type Position, type TeamSlug } from '@/lib/constants'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

const fields: FormFieldDef[] = [
  { name: 'firstName', label: 'Prénom', type: 'text', required: true },
  { name: 'lastName', label: 'Nom', type: 'text', required: true },
  { name: 'teamSlug', label: 'Équipe', type: 'select', required: true, options: TEAM_SLUGS.map((t) => ({ value: t, label: TEAM_LABELS[t as TeamSlug] })) },
  { name: 'number', label: 'Numéro', type: 'number', required: true },
  { name: 'position', label: 'Poste', type: 'select', required: true, options: POSITIONS.map((p) => ({ value: p, label: POSITION_LABELS[p as Position] })) },
  { name: 'birthDate', label: 'Date de naissance', type: 'date', required: true },
  { name: 'nationality', label: 'Nationalité', type: 'text', required: true },
  { name: 'height', label: 'Taille (cm)', type: 'number' },
  {
    name: 'preferredFoot',
    label: 'Pied préféré',
    type: 'select',
    options: [
      { value: 'GAUCHE', label: 'Gauche' },
      { value: 'DROIT', label: 'Droit' },
      { value: 'AMBIDEXTRE', label: 'Ambidextre' },
    ],
  },
  { name: 'photoUrl', label: 'Photo (URL)', type: 'url', span: 2 },
  { name: 'bio', label: 'Biographie', type: 'textarea', span: 2 },
  { name: 'captain', label: 'Capitaine', type: 'checkbox' },
  { name: 'active', label: 'Actif dans l’effectif', type: 'checkbox' },
  { name: 'appearances', label: 'Apparitions', type: 'number' },
  { name: 'goals', label: 'Buts', type: 'number' },
  { name: 'assists', label: 'Passes décisives', type: 'number' },
  { name: 'minutes', label: 'Minutes jouées', type: 'number' },
  { name: 'yellowCards', label: 'Cartons jaunes', type: 'number' },
  { name: 'redCards', label: 'Cartons rouges', type: 'number' },
]

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const player = await prisma.player.findUnique({ where: { id }, include: { team: true } })
  if (!player) notFound()

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
        Modifier {player.firstName} {player.lastName}
      </h1>
      <AdminForm
        fields={fields}
        action={updatePlayerAction.bind(null, id)}
        cancelHref="/admin/players"
        defaultValues={{ ...player, teamSlug: player.team.slug, birthDate: format(player.birthDate, 'yyyy-MM-dd') }}
      />
    </div>
  )
}
