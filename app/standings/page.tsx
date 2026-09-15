import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/ui/motion'
import { getStandings } from '@/lib/data'
import { TEAM_SLUGS, TEAM_LABELS, type TeamSlug } from '@/lib/constants'
import { img } from '@/lib/images'

export const metadata = { title: 'Classements' }
export const dynamic = 'force-dynamic'

export default async function StandingsPage({ searchParams }: { searchParams: Promise<{ team?: string }> }) {
  const { team } = await searchParams
  const active = TEAM_SLUGS.includes(team as TeamSlug) ? (team as TeamSlug) : 'men'
  const groups = await getStandings(active)

  return (
    <SiteChrome>
      <PageHeader kicker="Compétitions" title="Nos" accentTitle="classements" description="Suivez la position d'AKWABA FC dans chacune de ses compétitions." image={img('sport8', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="scrollbar-none mb-10 flex gap-2 overflow-x-auto">
            {TEAM_SLUGS.map((slug) => (
              <a
                key={slug}
                href={`/standings?team=${slug}`}
                className={`shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest ${
                  active === slug ? 'border-accent bg-accent text-[#071a2f]' : 'border-border text-muted-foreground hover:border-accent-foreground'
                }`}
              >
                {TEAM_LABELS[slug as TeamSlug]}
              </a>
            ))}
          </div>

          {groups.map((group) => (
            <Reveal key={group.competition.id} className="mb-12 overflow-x-auto border border-border bg-card">
              <p className="border-b border-border px-5 py-4 text-sm font-bold uppercase tracking-widest text-primary">{group.competition.name} — {group.competition.season}</p>
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary text-[10px] uppercase tracking-widest text-muted-foreground">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Équipe</th>
                    <th className="px-4 py-3 text-right">J</th>
                    <th className="px-4 py-3 text-right">G</th>
                    <th className="px-4 py-3 text-right">N</th>
                    <th className="px-4 py-3 text-right">P</th>
                    <th className="px-4 py-3 text-right">BP</th>
                    <th className="px-4 py-3 text-right">BC</th>
                    <th className="px-4 py-3 text-right">Diff.</th>
                    <th className="px-4 py-3 text-right">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row) => (
                    <tr key={row.id} className={`border-b border-border last:border-b-0 ${row.isClub ? 'bg-accent/10 font-bold' : ''}`}>
                      <td className="px-4 py-3">{row.position}</td>
                      <td className="px-4 py-3">{row.club}</td>
                      <td className="px-4 py-3 text-right">{row.played}</td>
                      <td className="px-4 py-3 text-right">{row.won}</td>
                      <td className="px-4 py-3 text-right">{row.drawn}</td>
                      <td className="px-4 py-3 text-right">{row.lost}</td>
                      <td className="px-4 py-3 text-right">{row.goalsFor}</td>
                      <td className="px-4 py-3 text-right">{row.goalsAgainst}</td>
                      <td className="px-4 py-3 text-right">{row.goalsFor - row.goalsAgainst}</td>
                      <td className="px-4 py-3 text-right text-accent-foreground">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteChrome>
  )
}
