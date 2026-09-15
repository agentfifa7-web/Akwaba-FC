import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/ui/motion'
import { TicketPurchaseButton } from '@/components/site/ticket-purchase'
import { getUpcomingTicketMatches } from '@/lib/data'
import { formatCFA } from '@/lib/format'
import { formatDateFr, formatTime } from '@/lib/format'
import { TICKET_TIER_LABELS, type TicketTier } from '@/lib/constants'
import { img } from '@/lib/images'

export const metadata = { title: 'Billetterie' }
export const dynamic = 'force-dynamic'

export default async function TicketsPage() {
  const matches = await getUpcomingTicketMatches()

  return (
    <SiteChrome>
      <PageHeader kicker="Jour de match" title="Billetterie" description="Réservez votre place au Stade de l'Amitié pour vivre les prochains matchs d'AKWABA FC." image={img('stadium', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px] space-y-12">
          {matches.map((match, mi) => (
            <Reveal key={match.id} delay={mi * 0.05} className="card-elevated">
              <div className="flex flex-col justify-between gap-3 border-b border-border p-6 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent-foreground">{match.competition.name}</p>
                  <h2 className="mt-1 font-display text-2xl font-black uppercase">
                    {match.isHome ? 'AKWABA FC' : match.opponent} vs {match.isHome ? match.opponent : 'AKWABA FC'}
                  </h2>
                </div>
                <div className="text-left text-sm text-muted-foreground sm:text-right">
                  <p>{formatDateFr(match.date)}</p>
                  <p>{formatTime(match.date)} · {match.stadium}</p>
                </div>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
                {match.ticketOffers.map((offer) => (
                  <div key={offer.id} className="flex flex-col justify-between border border-border p-5">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-primary">{TICKET_TIER_LABELS[offer.tier as TicketTier] ?? offer.tier}</p>
                      <p className="mt-2 font-display text-2xl font-black text-accent-foreground">{formatCFA(offer.price)}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{offer.remaining} places restantes</p>
                    </div>
                    <div className="mt-5">
                      <TicketPurchaseButton
                        offerId={offer.id}
                        tier={offer.tier}
                        price={offer.price}
                        remaining={offer.remaining}
                        matchLabel={`AKWABA FC vs ${match.opponent}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
          {matches.length === 0 && <p className="text-sm text-muted-foreground">Aucune billetterie ouverte pour le moment. Revenez bientôt !</p>}
        </div>
      </section>
    </SiteChrome>
  )
}
