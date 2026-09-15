import { prisma } from '@/lib/prisma'
import { DeleteButton } from '@/components/admin/delete-button'
import { StatusSelect } from '@/components/admin/status-select'
import { updateAcademyApplicationStatusAction, deleteAcademyApplicationAction } from '@/lib/actions/admin-actions'
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, type ApplicationStatus } from '@/lib/constants'
import { formatDateShort } from '@/lib/format'

export const dynamic = 'force-dynamic'

const statusOptions = APPLICATION_STATUSES.map((s) => ({ value: s, label: APPLICATION_STATUS_LABELS[s as ApplicationStatus] }))

export default async function AdminAcademyApplicationsPage() {
  const applications = await prisma.academyApplication.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Candidatures Academy</h1>
      <p className="mb-8 text-sm text-muted-foreground">Consultez les candidatures « Devenir joueur » reçues via le site public.</p>

      <div className="overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-3">Candidat</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Parent / tuteur</th>
              <th className="px-4 py-3">Reçu le</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="border-b border-border last:border-b-0 align-top">
                <td className="px-4 py-3">
                  <p className="font-semibold">{application.firstName} {application.lastName}</p>
                  <p className="text-[11px] text-muted-foreground">{application.position} · {application.nationality}</p>
                </td>
                <td className="px-4 py-3">{application.category}</td>
                <td className="px-4 py-3">
                  <p>{application.parentName}</p>
                  <p className="text-[11px] text-muted-foreground">{application.parentEmail} · {application.parentPhone}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
                    {application.parentalConsent ? 'Consentement donné' : 'Consentement manquant'}
                  </p>
                </td>
                <td className="px-4 py-3">{formatDateShort(application.createdAt)}</td>
                <td className="px-4 py-3">
                  <StatusSelect id={application.id} status={application.status} options={statusOptions} action={updateAcademyApplicationStatusAction} />
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton id={application.id} action={deleteAcademyApplicationAction} />
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Aucune candidature reçue pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
