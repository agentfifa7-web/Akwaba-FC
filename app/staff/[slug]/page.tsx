import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Mail, Phone, CalendarDays } from 'lucide-react'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/ui/motion'
import { LinkedInIcon } from '@/components/ui/social-icons'
import { getStaffBySlug } from '@/lib/data'
import { STAFF_DEPARTMENT_LABELS, type StaffDepartment } from '@/lib/constants'
import { formatDateFr } from '@/lib/format'
import { img } from '@/lib/images'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const member = await getStaffBySlug(slug)
  return { title: member ? member.name : 'Staff' }
}

export default async function StaffMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const member = await getStaffBySlug(slug)
  if (!member) notFound()

  return (
    <SiteChrome>
      <PageHeader
        kicker={STAFF_DEPARTMENT_LABELS[member.department as StaffDepartment] ?? member.department}
        title={member.name}
        description={member.role}
        image={member.photoUrl ?? img('clubIdentity', 1800)}
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <Reveal className="card-elevated flex flex-col items-center gap-4 p-8 text-center">
              <img
                src={member.photoUrl ?? img('clubIdentity', 400)}
                alt={member.name}
                className="h-40 w-40 rounded-full object-cover shadow-lg ring-4 ring-accent/20"
              />
              <div>
                <p className="font-display text-lg font-bold uppercase">{member.name}</p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent-foreground">{member.role}</p>
              </div>
            </Reveal>
            <Reveal className="card-elevated p-6">
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Fonction</dt>
                  <dd className="font-bold">{member.role}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Département</dt>
                  <dd className="font-bold">{STAFF_DEPARTMENT_LABELS[member.department as StaffDepartment] ?? member.department}</dd>
                </div>
                {member.team && (
                  <div className="flex justify-between border-b border-border pb-3">
                    <dt className="text-muted-foreground">Équipe</dt>
                    <dd>
                      <Link href={`/teams/${member.team.slug}`} className="font-bold text-accent-foreground hover:underline">
                        {member.team.name}
                      </Link>
                    </dd>
                  </div>
                )}
                {member.joinedAt && (
                  <div className="flex justify-between">
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" /> Au club depuis
                    </dt>
                    <dd className="font-bold">{formatDateFr(member.joinedAt, 'MMMM yyyy')}</dd>
                  </div>
                )}
              </dl>
            </Reveal>

            {(member.email || member.phone || member.linkedinUrl) && (
              <Reveal className="card-elevated space-y-3 p-6">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Contact</p>
                {member.email && (
                  <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-sm font-semibold text-foreground hover:text-accent-foreground">
                    <Mail className="h-4 w-4 shrink-0 text-accent-foreground" /> {member.email}
                  </a>
                )}
                {member.phone && (
                  <a href={`tel:${member.phone}`} className="flex items-center gap-3 text-sm font-semibold text-foreground hover:text-accent-foreground">
                    <Phone className="h-4 w-4 shrink-0 text-accent-foreground" /> {member.phone}
                  </a>
                )}
                {member.linkedinUrl && (
                  <a href={member.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm font-semibold text-foreground hover:text-accent-foreground">
                    <LinkedInIcon className="h-4 w-4 shrink-0 text-accent-foreground" /> Profil LinkedIn
                  </a>
                )}
              </Reveal>
            )}
          </div>

          <div>
            <Reveal>
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Biographie</p>
            </Reveal>
            <Reveal>
              {member.bio ? (
                <p className="text-sm leading-7 text-foreground/80">{member.bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune biographie renseignée pour le moment.</p>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
