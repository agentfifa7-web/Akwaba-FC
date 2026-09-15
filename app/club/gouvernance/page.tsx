import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { ClubSideNav } from '@/components/site/club-side-nav'
import { CmsBlocks } from '@/components/site/cms-blocks'
import { getCmsPage, getStaff } from '@/lib/data'
import { img } from '@/lib/images'

export const metadata = { title: 'Gouvernance' }
export const dynamic = 'force-dynamic'

export default async function GouvernancePage() {
  const [page, direction] = await Promise.all([getCmsPage('gouvernance'), getStaff('DIRECTION')])
  if (!page) notFound()
  return (
    <SiteChrome>
      <PageHeader kicker="Le club" title="Notre" accentTitle="gouvernance" description={page.subtitle ?? undefined} image={img('sport8', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 lg:flex-row">
          <ClubSideNav />
          <div className="flex-1 space-y-12">
            <CmsBlocks blocks={page.blocks} />
            <div>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Le conseil de direction</p>
                <Link href="/club/staff" className="text-[11px] font-bold uppercase tracking-widest text-accent-foreground">
                  Staff complet →
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {direction.map((member) => (
                  <div key={member.id} className="border border-border bg-card p-5 text-center">
                    <img src={member.photoUrl ?? ''} alt={member.name} className="mx-auto aspect-square w-20 rounded-full object-cover" />
                    <p className="mt-3 text-sm font-bold">{member.name}</p>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
