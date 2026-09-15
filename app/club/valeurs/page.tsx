import { notFound } from 'next/navigation'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { ClubSideNav } from '@/components/site/club-side-nav'
import { CmsBlocks } from '@/components/site/cms-blocks'
import { getCmsPage } from '@/lib/data'
import { img } from '@/lib/images'

export const metadata = { title: 'Nos valeurs' }
export const dynamic = 'force-dynamic'

export default async function ValeursPage() {
  const page = await getCmsPage('valeurs')
  if (!page) notFound()
  return (
    <SiteChrome>
      <PageHeader kicker="Le club" title="Nos" accentTitle="valeurs" description={page.subtitle ?? undefined} image={img('celebration', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 lg:flex-row">
          <ClubSideNav />
          <div className="flex-1">
            <CmsBlocks blocks={page.blocks} />
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
