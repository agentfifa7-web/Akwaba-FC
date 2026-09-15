import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { PlayerCard } from '@/components/site/player-card'
import { MatchCard } from '@/components/site/match-card'
import { NewsCard } from '@/components/site/news-card'
import { Reveal } from '@/components/ui/motion'
import { getSquad, getStaff, getResults, getUpcoming, getStandings, getNews } from '@/lib/data'
import { TEAM_SLUGS, TEAM_LABELS, STAFF_DEPARTMENT_LABELS, type TeamSlug, type StaffDepartment } from '@/lib/constants'
import { img } from '@/lib/images'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return TEAM_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return { title: TEAM_LABELS[slug as TeamSlug] ?? 'Équipe' }
}

const teamDepartment: Record<TeamSlug, StaffDepartment> = { men: 'MEN', women: 'WOMEN', reserve: 'RESERVE', u18: 'U18' }
const teamImages: Record<TeamSlug, 'teamPitch' | 'clubIdentity' | 'training' | 'youngTalents'> = {
  men: 'teamPitch',
  women: 'clubIdentity',
  reserve: 'training',
  u18: 'youngTalents',
}

const subNav = [
  { label: 'Effectif', href: '#effectif' },
  { label: 'Staff', href: '#staff' },
  { label: 'Calendrier & résultats', href: '#calendrier' },
  { label: 'Classement', href: '#classement' },
  { label: 'Actualités', href: '#actualites' },
]

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!TEAM_SLUGS.includes(slug as TeamSlug)) notFound()
  const teamSlug = slug as TeamSlug

  const [{ team, players }, staff, results, upcoming, standings, news] = await Promise.all([
    getSquad(teamSlug),
    getStaff(teamDepartment[teamSlug]),
    getResults(teamSlug, 6),
    getUpcoming(teamSlug, 6),
    getStandings(teamSlug),
    getNews({ teamSlug, take: 3 }),
  ])
  if (!team) notFound()

  return (
    <SiteChrome>
      <PageHeader kicker="Équipes AKWABA FC" title={team.name.split(' ')[0]} accentTitle={team.name.split(' ').slice(1).join(' ') || undefined} description={team.description ?? undefined} image={img(teamImages[teamSlug], 1800)} />

      <nav className="scrollbar-none sticky top-[72px] z-20 flex gap-6 overflow-x-auto border-b border-border bg-background/95 px-5 py-3 backdrop-blur sm:px-8 lg:px-12">
        {subNav.map((item) => (
          <a key={item.href} href={item.href} className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-accent-foreground">
            {item.label}
          </a>
        ))}
      </nav>

      <section id="effectif" className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Effectif {team.name}</p>
            <h2 className="mb-8 font-display text-4xl font-black uppercase text-primary">{players.length} joueurs</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {players.map((player, i) => (
              <Reveal key={player.slug} delay={(i % 10) * 0.04}>
                <PlayerCard player={player} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="staff" className="bg-secondary px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="mb-8 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Staff — {STAFF_DEPARTMENT_LABELS[teamDepartment[teamSlug]]}</p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {staff.map((member) => (
              <div key={member.id} className="card-elevated p-5 text-center">
                <img src={member.photoUrl ?? ''} alt={member.name} className="mx-auto aspect-square w-20 rounded-full object-cover" />
                <p className="mt-3 text-sm font-bold">{member.name}</p>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{member.role}</p>
              </div>
            ))}
            {staff.length === 0 && <p className="text-sm text-muted-foreground">Staff à venir.</p>}
          </div>
        </div>
      </section>

      <section id="calendrier" className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px] grid gap-10 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Prochains matchs</p>
            </Reveal>
            <div className="space-y-4">
              {upcoming.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
              {upcoming.length === 0 && <p className="text-sm text-muted-foreground">Aucun match programmé.</p>}
            </div>
          </div>
          <div>
            <Reveal>
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Derniers résultats</p>
            </Reveal>
            <div className="space-y-4">
              {results.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
              {results.length === 0 && <p className="text-sm text-muted-foreground">Aucun résultat pour le moment.</p>}
            </div>
          </div>
        </div>
      </section>

      <section id="classement" className="bg-primary px-5 py-16 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal>
            <p className="mb-8 text-[11px] font-bold uppercase tracking-[.25em] text-accent">Classement</p>
          </Reveal>
          {standings.map((group) => (
            <div key={group.competition.id} className="mb-10 overflow-x-auto">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest">{group.competition.name}</p>
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/20 text-[10px] uppercase tracking-widest text-white/50">
                    <th className="py-2 pr-2">#</th>
                    <th className="py-2 pr-2">Équipe</th>
                    <th className="py-2 pr-2 text-right">J</th>
                    <th className="py-2 pr-2 text-right">G</th>
                    <th className="py-2 pr-2 text-right">N</th>
                    <th className="py-2 pr-2 text-right">P</th>
                    <th className="py-2 pr-2 text-right">BP</th>
                    <th className="py-2 pr-2 text-right">BC</th>
                    <th className="py-2 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row) => (
                    <tr key={row.id} className={`border-b border-white/10 ${row.isClub ? 'bg-white/10 font-bold text-accent' : ''}`}>
                      <td className="py-2 pr-2">{row.position}</td>
                      <td className="py-2 pr-2">{row.club}</td>
                      <td className="py-2 pr-2 text-right">{row.played}</td>
                      <td className="py-2 pr-2 text-right">{row.won}</td>
                      <td className="py-2 pr-2 text-right">{row.drawn}</td>
                      <td className="py-2 pr-2 text-right">{row.lost}</td>
                      <td className="py-2 pr-2 text-right">{row.goalsFor}</td>
                      <td className="py-2 pr-2 text-right">{row.goalsAgainst}</td>
                      <td className="py-2 text-right">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </section>

      <section id="actualites" className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-8 flex items-end justify-between">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Actualités {team.name}</p>
            </Reveal>
            <Link href="/news" className="text-[11px] font-bold uppercase tracking-widest text-accent-foreground">
              Tout voir →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {news.map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
            {news.length === 0 && <p className="text-sm text-muted-foreground">Aucune actualité pour cette équipe.</p>}
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
