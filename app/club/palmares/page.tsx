import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { ClubSideNav } from '@/components/site/club-side-nav'
import { Reveal } from '@/components/ui/motion'
import { getHonours, getCmsPage } from '@/lib/data'
import { img } from '@/lib/images'
import { Trophy } from 'lucide-react'

export const metadata = { title: 'Notre palmarès' }
export const dynamic = 'force-dynamic'

export default async function PalmaresPage() {
  const [honours, page] = await Promise.all([getHonours(), getCmsPage('palmares')])

  return (
    <SiteChrome>
      <PageHeader kicker="Le club" title="Notre" accentTitle="palmarès" description={page?.subtitle ?? undefined} image={img('celebration', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 lg:flex-row">
          <ClubSideNav />
          <div className="flex-1">
            <ol className="relative space-y-8 border-l border-border pl-8">
              {honours.map((title, i) => (
                <Reveal key={title.id} as="li" delay={i * 0.06} className="relative">
                  <span className="absolute -left-[41px] flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[#071a2f]">
                    <Trophy className="h-4 w-4" />
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-foreground">{title.season}</p>
                  <h3 className="mt-1 font-display text-2xl font-bold uppercase text-foreground">{title.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{title.competition}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
