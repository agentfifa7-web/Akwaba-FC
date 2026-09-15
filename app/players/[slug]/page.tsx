import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PlayerPortrait } from '@/components/site/player-portrait'
import { Reveal, Counter } from '@/components/ui/motion'
import { getPlayerBySlug } from '@/lib/data'
import { POSITION_LABELS, type Position } from '@/lib/constants'
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

  const stats = [
    { label: 'Apparitions', value: player.appearances },
    { label: 'Buts', value: player.goals },
    { label: 'Passes décisives', value: player.assists },
    { label: 'Minutes jouées', value: player.minutes },
    { label: 'Cartons jaunes', value: player.yellowCards },
    { label: 'Cartons rouges', value: player.redCards },
  ]

  return (
    <SiteChrome transparent>
      <section className="relative flex min-h-[560px] items-end bg-primary pt-32 text-white sm:min-h-[680px]">
        <PlayerPortrait
          photoUrl={player.photoUrl}
          seed={player.slug}
          number={player.number}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top opacity-60"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,8,13,.97)_10%,rgba(5,8,13,.4)_100%)]" />
        <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-14 sm:px-8 lg:px-12">
          <Reveal>
            <Link href={`/teams/${player.team.slug}`} className="mb-4 inline-block text-[11px] font-bold uppercase tracking-widest text-accent">
              ← {player.team.name}
            </Link>
            <p className="font-display text-[8rem] font-black leading-none text-accent/90 sm:text-[11rem]">N°{player.number}</p>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-accent">{POSITION_LABELS[player.position as Position]}</p>
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
            <Reveal className="card-elevated p-6">
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
          </div>

          <div className="space-y-10">
            <div>
              <Reveal>
                <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Statistiques — saison 2026/2027</p>
              </Reveal>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {stats.map((stat, i) => (
                  <Reveal key={stat.label} delay={i * 0.05} className="card-elevated p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 font-display text-3xl font-black text-accent-foreground">
                      <Counter value={stat.value} />
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            <div>
              <Reveal>
                <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Historique</p>
              </Reveal>
              <ol className="space-y-4 border-l border-border pl-6">
                {player.careerSteps.map((step) => (
                  <li key={step.id} className="relative">
                    <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full bg-accent" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent-foreground">{step.season}</p>
                    <p className="text-sm font-bold">{step.club}</p>
                    {step.note && <p className="text-xs text-muted-foreground">{step.note}</p>}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
