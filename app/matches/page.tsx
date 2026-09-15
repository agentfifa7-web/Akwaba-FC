import Link from 'next/link'
import { Suspense } from 'react'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { MatchCard } from '@/components/site/match-card'
import { ClubLogo } from '@/components/site/club-logo'
import { TeamFilterTabs } from '@/components/site/team-filter-tabs'
import { Reveal } from '@/components/ui/motion'
import { Badge, LiveDot } from '@/components/ui/badge'
import { getNextMatch, getResults, getUpcoming } from '@/lib/data'
import { TEAM_SLUGS, type TeamSlug } from '@/lib/constants'
import { formatDateFr, formatTime } from '@/lib/format'
import { img } from '@/lib/images'

export const metadata = { title: 'Match Center' }
export const dynamic = 'force-dynamic'

export default async function MatchesPage({ searchParams }: { searchParams: Promise<{ team?: string }> }) {
  const { team } = await searchParams
  const teamSlug = TEAM_SLUGS.includes(team as TeamSlug) ? (team as TeamSlug) : undefined

  const [nextMatch, results, upcoming] = await Promise.all([
    getNextMatch(teamSlug),
    getResults(teamSlug, 9),
    getUpcoming(teamSlug, 9),
  ])

  return (
    <SiteChrome>
      <PageHeader kicker="Match Center" title="Le terrain" accentTitle="nous appelle" description="Prochain match, résultats et calendrier de toutes les équipes AKWABA FC." image={img('ballField', 1800)} />

      {nextMatch && (
        <section className="bg-primary px-5 py-14 text-white sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <Reveal className="mb-6 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-[.25em] text-accent">
                {nextMatch.status === 'LIVE' ? 'En ce moment' : 'Prochain match'}
              </p>
              {nextMatch.status === 'LIVE' && (
                <Badge tone="live">
                  <LiveDot /> En direct
                </Badge>
              )}
            </Reveal>
            <Reveal className="grid gap-8 border-t border-white/15 pt-8 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                <ClubLogo
                  name={nextMatch.isHome ? 'AKWABA FC' : nextMatch.opponent}
                  logoUrl={nextMatch.isHome ? undefined : nextMatch.opponentLogo}
                  size={52}
                  className="border-2"
                />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">{nextMatch.competition.name}</p>
                  <h2 className="mt-1 font-display text-3xl font-black uppercase sm:text-5xl">{nextMatch.isHome ? 'AKWABA FC' : nextMatch.opponent}</h2>
                </div>
              </div>
              <div className="text-center">
                <p className="font-display text-4xl font-black text-accent">
                  {nextMatch.status === 'LIVE' ? `${nextMatch.homeScore} - ${nextMatch.awayScore}` : 'VS'}
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-widest text-white/50">
                  {formatDateFr(nextMatch.date, 'd MMM')} · {formatTime(nextMatch.date)}
                </p>
                <p className="text-[11px] uppercase tracking-widest text-white/40">{nextMatch.stadium}</p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row-reverse sm:text-right">
                <ClubLogo
                  name={nextMatch.isHome ? nextMatch.opponent : 'AKWABA FC'}
                  logoUrl={nextMatch.isHome ? nextMatch.opponentLogo : undefined}
                  size={52}
                  className="border-2"
                />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">&nbsp;</p>
                  <h2 className="mt-1 font-display text-3xl font-black uppercase sm:text-5xl">{nextMatch.isHome ? nextMatch.opponent : 'AKWABA FC'}</h2>
                </div>
              </div>
            </Reveal>
            <Reveal className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
              <Link href={`/matches/${nextMatch.id}`} className="rounded-full bg-accent px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-primary">
                {nextMatch.status === 'LIVE' ? 'Suivre en direct' : 'Présentation'}
              </Link>
              <Link href="/tickets" className="rounded-full border border-white/40 px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-white hover:border-accent hover:text-accent">
                Billetterie
              </Link>
              <a href="#" className="rounded-full border border-white/40 px-6 py-3.5 text-[11px] font-bold uppercase tracking-widest text-white hover:border-accent hover:text-accent">
                Itinéraire
              </a>
            </Reveal>
          </div>
        </section>
      )}

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="mb-8">
            <Suspense fallback={null}>
              <TeamFilterTabs />
            </Suspense>
          </Reveal>

          <div className="grid gap-12 lg:grid-cols-2">
            <div id="calendrier">
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Calendrier</p>
              <div className="space-y-4">
                {upcoming.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
                {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Aucun match programmé.</p>}
              </div>
            </div>
            <div id="resultats">
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Résultats</p>
              <div className="space-y-4">
                {results.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
                {results.length === 0 && <p className="text-sm text-muted-foreground">Aucun résultat pour le moment.</p>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
