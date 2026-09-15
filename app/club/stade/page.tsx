import { notFound } from 'next/navigation'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { ClubSideNav } from '@/components/site/club-side-nav'
import { CmsBlocks } from '@/components/site/cms-blocks'
import { getCmsPage } from '@/lib/data'
import { img } from '@/lib/images'

export const metadata = { title: 'Notre stade' }
export const dynamic = 'force-dynamic'

export default async function StadePage() {
  const page = await getCmsPage('stade')
  if (!page) notFound()
  return (
    <SiteChrome>
      <PageHeader kicker="Infrastructures" title="Notre" accentTitle="stade" description={page.subtitle ?? undefined} image={img('stadiumLights', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 lg:flex-row">
          <ClubSideNav />
          <div className="flex-1 space-y-10">
            <CmsBlocks blocks={page.blocks} />
            <div className="overflow-hidden">
              <img src={img('stadium', 1600)} alt="Stade de l'Amitié" className="aspect-video w-full object-cover" />
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
