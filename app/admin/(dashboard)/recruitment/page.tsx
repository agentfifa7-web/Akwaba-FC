import { prisma } from '@/lib/prisma'
import { DeleteButton } from '@/components/admin/delete-button'
import { StatusSelect } from '@/components/admin/status-select'
import { updateRecruitmentApplicationStatusAction, deleteRecruitmentApplicationAction } from '@/lib/actions/admin-actions'
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, RECRUITMENT_CATEGORY_LABELS, type ApplicationStatus, type RecruitmentCategory } from '@/lib/constants'
import { formatDateShort } from '@/lib/format'

export const dynamic = 'force-dynamic'

const statusOptions = APPLICATION_STATUSES.map((s) => ({ value: s, label: APPLICATION_STATUS_LABELS[s as ApplicationStatus] }))

export default async function AdminRecruitmentPage() {
  const applications = await prisma.recruitmentApplication.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Recrutement</h1>
      <p className="mb-8 text-sm text-muted-foreground">Candidatures reçues pour rejoindre le club (joueurs, éducateurs, staff, administration, bénévoles).</p>

      <div className="overflow-x-auto card-elevated">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-3">Candidat</th>
              <th className="px-4 py-3">Domaine</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Reçu le</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.id} className="border-b border-border last:border-b-0 align-top">
                <td className="px-4 py-3">
                  <p className="font-semibold">{application.fullName}</p>
                  <p className="text-[11px] text-muted-foreground">{application.email} · {application.phone}</p>
                </td>
                <td className="px-4 py-3">{RECRUITMENT_CATEGORY_LABELS[application.category as RecruitmentCategory] ?? application.category}</td>
                <td className="max-w-xs px-4 py-3 text-[13px] text-muted-foreground">{application.message}</td>
                <td className="px-4 py-3">{formatDateShort(application.createdAt)}</td>
                <td className="px-4 py-3">
                  <StatusSelect id={application.id} status={application.status} options={statusOptions} action={updateRecruitmentApplicationStatusAction} />
                </td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton id={application.id} action={deleteRecruitmentApplicationAction} />
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
