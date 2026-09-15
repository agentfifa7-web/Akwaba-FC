import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/ui/motion'
import { getPartners } from '@/lib/data'
import { PARTNER_CATEGORIES, PARTNER_CATEGORY_LABELS, type PartnerCategory } from '@/lib/constants'
import { img } from '@/lib/images'

export const metadata = { title: 'Nos partenaires' }
export const dynamic = 'force-dynamic'

export default async function PartnersPage() {
  const partners = await getPartners()
  const grouped = PARTNER_CATEGORIES.map((cat) => ({ cat, items: partners.filter((p) => p.category === cat) })).filter((g) => g.items.length > 0)

  return (
    <SiteChrome>
      <PageHeader kicker="Ensemble" title="Nos" accentTitle="partenaires" description="Ils accompagnent l'ambition d'AKWABA FC, saison après saison." image={img('sport7', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px] space-y-14">
          {grouped.map((group) => (
            <div key={group.cat}>
              <Reveal>
                <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">{PARTNER_CATEGORY_LABELS[group.cat as PartnerCategory]}</p>
              </Reveal>
              <div className={`grid gap-5 ${group.cat === 'PRINCIPAL' ? 'sm:grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
                {group.items.map((partner, i) => (
                  <Reveal key={partner.slug} delay={i * 0.06}>
                    <Link
                      href={`/partners/${partner.slug}`}
                      className="card-elevated card-elevated-hover group flex h-full flex-col items-center justify-center gap-4 p-8 text-center"
                    >
                      <img src={partner.logoUrl} alt={partner.name} className="h-16 w-16 rounded-full object-cover grayscale transition-all group-hover:grayscale-0" />
                      <p className="font-display text-lg font-bold uppercase">{partner.name}</p>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteChrome>
  )
}
