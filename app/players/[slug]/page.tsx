import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PlayerPortrait } from '@/components/site/player-portrait'
import { PlayerRadar } from '@/components/site/player-radar'
import { PlayerProgressChart } from '@/components/site/player-progress-chart'
import { PlayerMediaGallery } from '@/components/site/player-media-gallery'
import { Reveal, Counter } from '@/components/ui/motion'
import { getPlayerBySlug, getPlayerCompetitionStats, getPlayerProgress } from '@/lib/data'
import { POSITION_LABELS, POSITION_THEME, PLAYER_ATTRIBUTE_KEYS, type Position } from '@/lib/constants'
import { ageFromBirthDate, formatDateFr } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const player = await getPlayerBySlug(slug)
  return { title: player ? `${player.firstName} ${player.lastName}` : 'Joueur' }
}

export default async function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const player = await getPlayerBySlug(slug)
  if (!player) notFound()

  const [{ rows: competitionStats, global }, progress] = await Promise.all([
    getPlayerCompetitionStats(player.id),
    getPlayerProgress(player.id),
  ])

  const theme = POSITION_THEME[player.position as Position]
  const attributes = (player.attributes as Record<string, number> | null) ?? Object.fromEntries(PLAYER_ATTRIBUTE_KEYS.map((k) => [k, 0]))

  const globalStats = [
    { label: 'Apparitions', value: global.appearances || player.appearances },
    { label: 'Buts', value: global.goals || player.goals },
    { label: 'Passes décisives', value: global.assists || player.assists },
    { label: 'Minutes jouées', value: global.minutes || player.minutes },
    { label: 'Cartons jaunes', value: global.yellowCards || player.yellowCards },
    { label: 'Cartons rouges', value: global.redCards || player.redCards },
  ]

  return (
    <SiteChrome transparent>
      <section className="relative flex min-h-[560px] items-end bg-primary pt-32 text-white sm:min-h-[680px]">
        {player.highlightVideoUrl ? (
          <video
            src={player.highlightVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover object-top opacity-60"
          />
        ) : (
          <PlayerPortrait
            photoUrl={player.photoUrl}
            seed={player.slug}
            number={player.number}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,8,13,.97)_10%,rgba(5,8,13,.4)_100%)]" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5"
          style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)` }}
        />
        <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-14 sm:px-8 lg:px-12">
          <Reveal>
            <Link href={`/teams/${player.team.slug}`} className="mb-4 inline-block text-[11px] font-bold uppercase tracking-widest text-accent">
              ← {player.team.name}
            </Link>
            <p className="font-display text-[8rem] font-black leading-none text-accent/90 sm:text-[11rem]">N°{player.number}</p>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.3em]" style={{ color: theme.accent, background: theme.soft }}>
              {POSITION_LABELS[player.position as Position]}
            </p>
            <h1 className="font-display text-5xl font-black uppercase leading-[.9] sm:text-7xl">
              {player.firstName}
              <br />
              {player.lastName}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <Reveal className="card-elevated p-6" style={{ borderTopColor: theme.accent, borderTopWidth: 3 }}>
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Âge</dt>
                  <dd className="font-bold">{ageFromBirthDate(player.birthDate)} ans</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Date de naissance</dt>
                  <dd className="font-bold">{formatDateFr(player.birthDate, 'd MMMM yyyy')}</dd>
                </div>
                <div className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">Nationalité</dt>
                  <dd className="font-bold">{player.nationality}</dd>
                </div>
                {player.height && (
                  <div className="flex justify-between border-b border-border pb-3">
                    <dt className="text-muted-foreground">Taille</dt>
                    <dd className="font-bold">{player.height} cm</dd>
                  </div>
                )}
                {player.preferredFoot && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Pied préféré</dt>
                    <dd className="font-bold">{player.preferredFoot}</dd>
                  </div>
                )}
              </dl>
            </Reveal>
            {player.bio && (
              <Reveal>
                <p className="text-sm leading-6 text-foreground/80">{player.bio}</p>
              </Reveal>
            )}

            <Reveal className="card-elevated p-6">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Profil & compétences</p>
              <PlayerRadar attributes={attributes} color={theme.accent} />
            </Reveal>
          </div>

          <div className="space-y-10">
            <div>
              <Reveal>
                <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Statistiques globales — carrière</p>
              </Reveal>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {globalStats.map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 0.05} className="card-elevated p-5" style={{ borderTopColor: theme.accent, borderTopWidth: 3 }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 font-display text-3xl font-black" style={{ color: theme.accent }}>
                      <Counter value={stat.value} />
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            {competitionStats.length > 0 && (
              <div>
                <Reveal>
                  <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Statistiques par compétition</p>
                </Reveal>
                <Reveal className="overflow-x-auto card-elevated">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary text-[10px] uppercase tracking-widest text-muted-foreground">
                        <th className="px-4 py-3">Compétition</th>
                        <th className="px-4 py-3 text-right">Apps</th>
                        <th className="px-4 py-3 text-right">Buts</th>
                        <th className="px-4 py-3 text-right">Passes D.</th>
                        <th className="px-4 py-3 text-right">Minutes</th>
                        <th className="px-4 py-3 text-right">🟨</th>
                        <th className="px-4 py-3 text-right">🟥</th>
                      </tr>
                    </thead>
                    <tbody>
                      {competitionStats.map((row) => (
                        <tr key={row.competition.id} className="border-b border-border last:border-b-0">
                          <td className="px-4 py-3 font-bold">
                            {row.competition.name} <span className="font-normal text-muted-foreground">— {row.competition.season}</span>
                          </td>
                          <td className="px-4 py-3 text-right">{row.appearances}</td>
                          <td className="px-4 py-3 text-right font-bold" style={{ color: theme.accent }}>{row.goals}</td>
                          <td className="px-4 py-3 text-right">{row.assists}</td>
                          <td className="px-4 py-3 text-right">{row.minutes}</td>
                          <td className="px-4 py-3 text-right">{row.yellowCards}</td>
                          <td className="px-4 py-3 text-right">{row.redCards}</td>
                        </tr>
                      ))}
                      <tr className="bg-secondary/60 font-bold">
                        <td className="px-4 py-3">Total toutes compétitions</td>
                        <td className="px-4 py-3 text-right">{global.appearances}</td>
                        <td className="px-4 py-3 text-right" style={{ color: theme.accent }}>{global.goals}</td>
                        <td className="px-4 py-3 text-right">{global.assists}</td>
                        <td className="px-4 py-3 text-right">{global.minutes}</td>
                        <td className="px-4 py-3 text-right">{global.yellowCards}</td>
                        <td className="px-4 py-3 text-right">{global.redCards}</td>
                      </tr>
                    </tbody>
                  </table>
                </Reveal>
              </div>
            )}

            <div>
              <Reveal>
                <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Progression — matchs & entraînements</p>
              </Reveal>
              <Reveal className="card-elevated p-6">
                <PlayerProgressChart entries={progress} color={theme.accent} />
              </Reveal>
            </div>

            <div>
              <Reveal>
                <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Historique</p>
              </Reveal>
              <ol className="space-y-4 border-l border-border pl-6">
                {player.careerSteps.map((step) => (
                  <li key={step.id} className="relative">
                    <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full" style={{ background: theme.accent }} />
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.accent }}>{step.season}</p>
                    <p className="text-sm font-bold">{step.club}</p>
                    {step.note && <p className="text-xs text-muted-foreground">{step.note}</p>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {player.media.length > 0 && (
          <div className="mx-auto mt-16 max-w-[1440px]">
            <Reveal>
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Médias</p>
            </Reveal>
            <Reveal>
              <PlayerMediaGallery media={player.media} color={theme.accent} />
            </Reveal>
          </div>
        )}
      </section>
    </SiteChrome>
  )
}
