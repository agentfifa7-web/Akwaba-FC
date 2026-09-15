import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { ClubLogo } from '@/components/site/club-logo'
import { Reveal } from '@/components/ui/motion'
import { Badge, LiveDot } from '@/components/ui/badge'
import { getMatchById } from '@/lib/data'
import { formatDateFr, formatTime } from '@/lib/format'
import { MATCH_EVENT_ICONS, MATCH_STATUS_LABELS, type MatchEventType, type MatchStatus } from '@/lib/constants'
import { img } from '@/lib/images'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = await getMatchById(id)
  return { title: match ? `AKWABA FC vs ${match.opponent}` : 'Match' }
}

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const match = await getMatchById(id)
  if (!match) notFound()

  const home = match.isHome ? 'AKWABA FC' : match.opponent
  const away = match.isHome ? match.opponent : 'AKWABA FC'
  const isLive = match.status === 'LIVE'
  const isDone = match.status === 'FINISHED'

  return (
    <SiteChrome transparent>
      <section className="relative flex min-h-[480px] items-end bg-primary pb-14 pt-32 text-white sm:min-h-[560px]">
        <img src={img('stadiumLights', 1800)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,8,13,.97)_15%,rgba(5,8,13,.5)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-accent">
              <span>{match.competition.name}</span>
              {match.matchday && <span className="text-white/40">· {match.matchday}</span>}
              {isLive && (
                <Badge tone="live">
                  <LiveDot /> Live
                </Badge>
              )}
            </div>
            <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
              <div className="flex items-center gap-4">
                <ClubLogo name={home} logoUrl={match.isHome ? undefined : match.opponentLogo} size={56} className="border-2" />
                <h1 className="font-display text-3xl font-black uppercase leading-none sm:text-5xl">{home}</h1>
              </div>
              <p className="font-display text-5xl font-black text-accent sm:text-6xl">
                {isLive || isDone ? `${match.homeScore ?? 0} - ${match.awayScore ?? 0}` : 'VS'}
              </p>
              <div className="flex items-center justify-start gap-4 sm:flex-row-reverse">
                <ClubLogo name={away} logoUrl={match.isHome ? match.opponentLogo : undefined} size={56} className="border-2" />
                <h1 className="font-display text-3xl font-black uppercase leading-none sm:text-right sm:text-5xl">{away}</h1>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[11px] uppercase tracking-widest text-white/60">
              <span>{formatDateFr(match.date)}</span>
              <span>{formatTime(match.date)}</span>
              <span>{match.stadium}</span>
              <span>{MATCH_STATUS_LABELS[match.status as MatchStatus]}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Reveal>
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Chronologie</p>
            </Reveal>
            {match.events.length === 0 ? (
              <p className="text-sm text-muted-foreground">Les événements du match seront publiés ici.</p>
            ) : (
              <ol className="space-y-4">
                {match.events.map((event) => (
                  <li key={event.id} className="flex items-center gap-4 card-elevated p-4">
                    <span className="w-12 shrink-0 font-display text-lg font-bold text-accent-foreground">{event.minute}&apos;</span>
                    <span className="text-lg">{MATCH_EVENT_ICONS[event.type as MatchEventType]}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{event.player}</p>
                      {event.detail && <p className="text-xs text-muted-foreground">{event.detail}</p>}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{event.side === 'HOME' ? home : away}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="space-y-6">
            <Reveal className="card-elevated p-6">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Informations</p>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">Compétition</dt>
                  <dd className="font-bold">{match.competition.name}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <dt className="text-muted-foreground">Équipe</dt>
                  <dd className="font-bold">{match.team.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Stade</dt>
                  <dd className="font-bold">{match.stadium}</dd>
                </div>
              </dl>
            </Reveal>
            {match.ticketOffers.length > 0 && (
              <Reveal className="border-t-2 border-accent bg-primary p-6 text-white">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[.22em] text-accent">Billetterie</p>
                <p className="text-sm text-white/70">Des places sont disponibles pour ce match.</p>
                <Link href="/tickets" className="rounded-full mt-5 block bg-accent px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-widest text-primary">
                  Réserver mes billets
                </Link>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
