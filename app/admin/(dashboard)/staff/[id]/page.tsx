import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { updateStaffAction } from '@/lib/actions/admin-actions'
import { STAFF_DEPARTMENTS, STAFF_DEPARTMENT_LABELS, TEAM_SLUGS, TEAM_LABELS, type StaffDepartment, type TeamSlug } from '@/lib/constants'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

const fields: FormFieldDef[] = [
  { name: 'name', label: 'Nom complet', type: 'text', required: true },
  { name: 'role', label: 'Fonction', type: 'text', required: true },
  { name: 'department', label: 'Département', type: 'select', required: true, options: STAFF_DEPARTMENTS.map((d) => ({ value: d, label: STAFF_DEPARTMENT_LABELS[d as StaffDepartment] })) },
  { name: 'teamSlug', label: 'Équipe associée (optionnel)', type: 'select', options: TEAM_SLUGS.map((t) => ({ value: t, label: TEAM_LABELS[t as TeamSlug] })) },
  { name: 'photoUrl', label: 'Photo (URL)', type: 'url', span: 2 },
  { name: 'email', label: 'E-mail (optionnel)', type: 'email' },
  { name: 'phone', label: 'Téléphone (optionnel)', type: 'tel' },
  { name: 'joinedAt', label: 'Au club depuis (optionnel)', type: 'date' },
  { name: 'linkedinUrl', label: 'LinkedIn (URL, optionnel)', type: 'url' },
  { name: 'bio', label: 'Biographie', type: 'textarea', span: 2 },
]

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.staffMember.findUnique({ where: { id }, include: { team: true } })
  if (!member) notFound()

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Modifier {member.name}</h1>
      <AdminForm
        fields={fields}
        action={updateStaffAction.bind(null, id)}
        cancelHref="/admin/staff"
        defaultValues={{ ...member, teamSlug: member.team?.slug, joinedAt: member.joinedAt ? format(member.joinedAt, 'yyyy-MM-dd') : undefined }}
      />
    </div>
  )
}
