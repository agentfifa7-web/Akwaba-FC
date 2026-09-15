import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/ui/motion'
import { NewsletterForm } from '@/components/site/newsletter-form'
import { NewsCard } from '@/components/site/news-card'
import { getSupporterGroups, getSupporterEvents, getNews, getGallery } from '@/lib/data'
import { formatDateFr } from '@/lib/format'
import { img } from '@/lib/images'
import { Megaphone } from 'lucide-react'

export const metadata = { title: 'Supporters' }
export const dynamic = 'force-dynamic'

export default async function SupportersPage() {
  const [groups, events, news, photos] = await Promise.all([
    getSupporterGroups(),
    getSupporterEvents(),
    getNews({ category: 'SUPPORTERS', take: 3 }),
    getGallery('SUPPORTERS'),
  ])

  return (
    <SiteChrome>
      <PageHeader kicker="La famille AKWABA" title="Supporters" description="Une communauté unie, dans le stade comme en dehors." image={img('crowd', 1800)} />

      <section className="bg-accent px-5 py-10 text-primary sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4">
          <Megaphone className="h-8 w-8 shrink-0" />
          <p className="font-display text-2xl font-black uppercase sm:text-3xl">#TousEnsemble — la voix des supporters AKWABA FC</p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="mb-8 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Groupes de supporters</p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-3">
            {groups.map((group, i) => (
              <Reveal key={group.id} delay={i * 0.08} className="card-elevated p-6">
                <img src={group.logoUrl ?? ''} alt="" className="h-14 w-14 rounded-full object-cover" />
                <h3 className="mt-4 font-display text-xl font-bold uppercase">{group.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>
                <div className="mt-4 flex justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
                  <span>Depuis {group.since}</span>
                  <span>{group.membersLabel}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="mb-8 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Prochains événements & concours</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.08} className="border-t-2 border-accent bg-card p-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-accent-foreground">{formatDateFr(event.date, 'd MMM yyyy')}</p>
                <h3 className="mt-2 font-display text-lg font-bold uppercase">{event.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                {event.location && <p className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">{event.location}</p>}
              </Reveal>
            ))}
            {events.length === 0 && <p className="text-sm text-muted-foreground">Aucun événement programmé pour le moment.</p>}
          </div>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-8 flex items-center justify-between">
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Photos des supporters</p>
              </Reveal>
              <Link href="/gallery?category=SUPPORTERS" className="text-[11px] font-bold uppercase tracking-widest text-accent-foreground">
                Voir la galerie →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photos.slice(0, 8).map((photo) => (
                <img key={photo.id} src={photo.url} alt="" className="aspect-square w-full object-cover" />
              ))}
            </div>
          </div>
        </section>
      )}

      {news.length > 0 && (
        <section className="bg-secondary px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <Reveal>
              <p className="mb-8 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Actualités supporters</p>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-3">
              {news.map((article) => (
                <NewsCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-primary px-5 py-16 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.25em] text-accent">Fan Zone</p>
            <h2 className="font-display text-4xl font-black uppercase leading-none sm:text-5xl">Ne manquez aucune actualité supporters.</h2>
          </Reveal>
          <NewsletterForm className="w-full max-w-xl [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input]:placeholder:text-white/40 [&_button]:bg-accent [&_button]:text-primary" />
        </div>
      </section>
    </SiteChrome>
  )
}
