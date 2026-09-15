import Link from 'next/link'
import { PlaySquare, Ticket as TicketIcon } from 'lucide-react'
import { SiteChrome } from '@/components/site/site-chrome'
import { Reveal, Counter } from '@/components/ui/motion'
import { NewsCard } from '@/components/site/news-card'
import { NewsletterForm } from '@/components/site/newsletter-form'
import { Badge } from '@/components/ui/badge'
import {
  getNextMatch,
  getNews,
  getClubStandingRow,
  getVideos,
  getLiveVideo,
} from '@/lib/data'
import { formatDateFr, formatTime } from '@/lib/format'
import { img } from '@/lib/images'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [nextMatch, news, standingRow, liveVideo, videos] = await Promise.all([
    getNextMatch('men'),
    getNews({ take: 3 }),
    getClubStandingRow('men'),
    getLiveVideo(),
    getVideos({ take: 2 }),
  ])

  return (
    <SiteChrome transparent>
      <section id="accueil" className="relative flex min-h-[680px] items-end bg-primary sm:min-h-[820px]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,8,13,.95)_0%,rgba(7,26,47,.78)_42%,rgba(7,26,47,.18)_100%)]" />
        <img src={img('teamPitch', 2200)} alt="Joueurs d'AKWABA FC sur le terrain" className="absolute inset-0 h-full w-full object-cover object-center opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,26,47,.95)_0%,transparent_45%)]" />
        <div className="relative mx-auto grid w-full max-w-[1440px] gap-10 px-5 pb-20 pt-40 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:px-12 lg:pb-28">
          <div className="max-w-2xl">
            <Reveal>
              <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">
                <span className="h-px w-10 bg-accent" /> Saison 2026 / 2027
              </p>
              <h1 className="font-display text-6xl font-black uppercase leading-[.88] tracking-[-.03em] text-white sm:text-8xl lg:text-[9.5rem]">
                Plus qu’un
                <br />
                <span className="text-accent">club.</span>
              </h1>
              <p className="mt-7 max-w-md text-sm leading-6 text-white/75 sm:text-base">
                Une passion qui nous rassemble. Une ambition qui nous guide. Bienvenue dans la famille AKWABA FC.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/matches" className="bg-accent px-6 py-4 text-xs font-bold uppercase tracking-widest text-primary transition-transform hover:-translate-y-1">
                  Voir le prochain match
                </Link>
                <Link href="/tickets" className="flex items-center gap-2 border border-white/50 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white hover:border-accent hover:text-accent">
                  <TicketIcon className="h-3.5 w-3.5" /> Billetterie
                </Link>
                <Link href="/club-tv" className="flex items-center gap-2 border border-white/50 px-6 py-4 text-xs font-bold uppercase tracking-widest text-white hover:border-accent hover:text-accent">
                  <PlaySquare className="h-3.5 w-3.5" /> Club TV
                </Link>
              </div>
            </Reveal>
          </div>
          {nextMatch && (
            <Reveal delay={0.15} className="self-end lg:mb-3 lg:justify-self-end">
              <div className="w-full max-w-sm border-t-2 border-accent bg-primary/80 p-6 backdrop-blur-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[.22em] text-accent">
                    {nextMatch.status === 'LIVE' ? 'En ce moment' : 'Prochain match'}
                  </span>
                  <span className="text-[10px] text-white/60">{nextMatch.matchday ?? nextMatch.competition.name}</span>
                </div>
                <div className="flex items-center justify-between gap-5">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-accent/70 font-display text-lg font-bold text-accent">AFC</div>
                    <p className="text-xs font-bold text-white">{nextMatch.isHome ? 'AKWABA FC' : nextMatch.opponent}</p>
                  </div>
                  <div className="text-center">
                    {nextMatch.status === 'LIVE' ? (
                      <Badge tone="live">
                        <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> Live
                      </Badge>
                    ) : (
                      <p className="font-display text-3xl font-bold text-white">VS</p>
                    )}
                    <p className="mt-1 text-[10px] text-white/50">
                      {formatDateFr(nextMatch.date, 'd MMM')} · {formatTime(nextMatch.date)}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/30 font-display text-lg font-bold text-white/70">
                      {nextMatch.isHome ? nextMatch.opponent.slice(0, 2).toUpperCase() : 'AFC'}
                    </div>
                    <p className="text-xs font-bold text-white">{nextMatch.isHome ? nextMatch.opponent : 'AKWABA FC'}</p>
                  </div>
                </div>
                <div className="mt-7 border-t border-white/15 pt-4 text-center text-[10px] uppercase tracking-widest text-white/55">
                  {nextMatch.stadium}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section id="actualités" className="bg-secondary px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[.25em] text-primary/55">Le fil du club</p>
              <h2 className="font-display text-5xl font-black uppercase leading-none text-primary sm:text-6xl">
                Dernières
                <br />
                <span className="text-accent-foreground">actualités</span>
              </h2>
            </div>
            <Link href="/news" className="hidden text-xs font-bold uppercase tracking-widest text-primary underline decoration-accent underline-offset-8 sm:block">
              Toutes les actualités
            </Link>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {news.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.08} className={i === 0 ? 'md:col-span-2 md:row-span-2' : ''}>
                <NewsCard article={item} size={i === 0 ? 'large' : 'default'} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="matchs" className="bg-primary px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[.25em] text-accent">Match Center</p>
            <h2 className="font-display text-5xl font-black uppercase leading-none sm:text-7xl">
              Le terrain
              <br />
              <span className="text-accent">nous appelle.</span>
            </h2>
            <Link href="/matches" className="mt-6 inline-block text-xs font-bold uppercase tracking-widest text-accent underline underline-offset-8">
              Voir le Match Center →
            </Link>
          </Reveal>
          {standingRow && (
            <Reveal delay={0.1} className="grid w-full max-w-xl grid-cols-2 border border-white/20 sm:grid-cols-4">
              <div className="p-5">
                <p className="text-[10px] uppercase tracking-widest text-white/50">Joués</p>
                <p className="mt-2 font-display text-4xl font-bold"><Counter value={standingRow.played} /></p>
              </div>
              <div className="border-l border-white/20 p-5">
                <p className="text-[10px] uppercase tracking-widest text-white/50">Victoires</p>
                <p className="mt-2 font-display text-4xl font-bold text-accent"><Counter value={standingRow.won} /></p>
              </div>
              <div className="border-l border-t border-white/20 p-5 sm:border-t-0">
                <p className="text-[10px] uppercase tracking-widest text-white/50">Buts</p>
                <p className="mt-2 font-display text-4xl font-bold"><Counter value={standingRow.goalsFor} /></p>
              </div>
              <div className="border-l border-t border-white/20 p-5 sm:border-t-0">
                <p className="text-[10px] uppercase tracking-widest text-white/50">Classement</p>
                <p className="mt-2 font-display text-4xl font-bold text-accent">#{String(standingRow.position).padStart(2, '0')}</p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      <section id="club-tv" className="bg-background px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="mb-9 flex items-end justify-between">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Les images du club</p>
              <h2 className="font-display text-5xl font-black uppercase leading-none text-primary sm:text-6xl">
                AKWABA <span className="text-accent-foreground">Club TV</span>
              </h2>
            </div>
            <Link href="/club-tv" className="hidden text-xs font-bold uppercase tracking-widest text-primary underline decoration-accent underline-offset-8 sm:block">
              Voir tous les contenus
            </Link>
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            {liveVideo && (
              <Reveal>
                <Link href={`/club-tv/${liveVideo.slug}`} className="group relative block min-h-[360px] overflow-hidden bg-primary">
                  <img src={liveVideo.thumbnailUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
                  {liveVideo.isLive && (
                    <Badge tone="live" className="absolute right-6 top-6">
                      <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> Live
                    </Badge>
                  )}
                  <div className="absolute bottom-0 p-7">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">▶</span>
                    <p className="mt-5 text-[10px] font-bold uppercase tracking-[.2em] text-accent">Inside AKWABA</p>
                    <h3 className="mt-2 font-display text-3xl font-bold uppercase text-white sm:text-4xl">{liveVideo.title}</h3>
                  </div>
                </Link>
              </Reveal>
            )}
            <div className="flex flex-col gap-5">
              {videos.map((video, i) => (
                <Reveal key={video.slug} delay={i * 0.1}>
                  <Link href={`/club-tv/${video.slug}`} className="flex flex-1 gap-5 bg-secondary p-4">
                    <img src={video.thumbnailUrl} alt="" className="aspect-square w-32 object-cover sm:w-44" />
                    <div className="py-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent-foreground">{video.category}</p>
                      <h3 className="mt-3 font-display text-2xl font-bold uppercase text-primary">{video.title}</h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="supporters" className="bg-accent px-5 py-16 text-primary sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.25em]">La famille AKWABA</p>
            <h2 className="font-display text-4xl font-black uppercase leading-none sm:text-6xl">
              Ne manquez
              <br />
              aucun moment.
            </h2>
          </Reveal>
          <NewsletterForm className="w-full max-w-xl" />
        </div>
      </section>
    </SiteChrome>
  )
}
