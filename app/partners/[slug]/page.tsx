import { notFound } from 'next/navigation'
import { SiteChrome } from '@/components/site/site-chrome'
import { Reveal } from '@/components/ui/motion'
import { getPartnerBySlug } from '@/lib/data'
import { PARTNER_CATEGORY_LABELS, type PartnerCategory } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const partner = await getPartnerBySlug(slug)
  return { title: partner?.name ?? 'Partenaire' }
}

export default async function PartnerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const partner = await getPartnerBySlug(slug)
  if (!partner) notFound()

  return (
    <SiteChrome>
      <section className="bg-primary px-5 pb-16 pt-32 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <img src={partner.logoUrl} alt={partner.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.25em] text-accent">{PARTNER_CATEGORY_LABELS[partner.category as PartnerCategory]}</p>
            <h1 className="mt-3 font-display text-4xl font-black uppercase sm:text-5xl">{partner.name}</h1>
            {partner.description && <p className="mt-6 text-sm leading-6 text-white/70">{partner.description}</p>}
            {partner.websiteUrl && (
              <a href={partner.websiteUrl} target="_blank" rel="noreferrer" className="mt-8 inline-block bg-accent px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-primary">
                Visiter le site
              </a>
            )}
          </Reveal>
        </div>
      </section>
    </SiteChrome>
  )
}
