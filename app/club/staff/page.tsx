import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { ClubSideNav } from '@/components/site/club-side-nav'
import { Reveal } from '@/components/ui/motion'
import { getStaff } from '@/lib/data'
import { STAFF_DEPARTMENTS, STAFF_DEPARTMENT_LABELS, type StaffDepartment } from '@/lib/constants'
import { img } from '@/lib/images'

export const metadata = { title: 'Staff & direction' }
export const dynamic = 'force-dynamic'

export default async function StaffPage() {
  const staff = await getStaff()
  const byDepartment = STAFF_DEPARTMENTS.map((dept) => ({
    dept,
    members: staff.filter((m) => m.department === dept),
  })).filter((g) => g.members.length > 0)

  return (
    <SiteChrome>
      <PageHeader kicker="Le club" title="Staff &" accentTitle="direction" description="Toutes les femmes et les hommes qui font vivre AKWABA FC au quotidien." image={img('sport6', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 lg:flex-row">
          <ClubSideNav />
          <div className="flex-1 space-y-14">
            {byDepartment.map((group) => (
              <div key={group.dept}>
                <h2 className="mb-6 font-display text-2xl font-black uppercase tracking-tight text-primary">
                  {STAFF_DEPARTMENT_LABELS[group.dept as StaffDepartment]}
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {group.members.map((member, i) => (
                    <Reveal key={member.id} delay={i * 0.05} className="border border-border bg-card p-5 text-center">
                      <img src={member.photoUrl ?? ''} alt={member.name} className="mx-auto aspect-square w-20 rounded-full object-cover" />
                      <p className="mt-3 text-sm font-bold">{member.name}</p>
                      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{member.role}</p>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
