import { prisma } from '@/lib/prisma'
import { DeleteButton } from '@/components/admin/delete-button'
import { OrderStatusSelect } from '@/components/admin/order-status-select'
import { createTicketOfferAction, deleteTicketOfferAction, updateTicketOrderStatusAction } from '@/lib/actions/admin-actions'
import { TICKET_TIERS, TICKET_TIER_LABELS, type TicketTier } from '@/lib/constants'
import { formatCFA, formatDateShort } from '@/lib/format'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminTicketsPage() {
  const [offers, orders, matches] = await Promise.all([
    prisma.ticketOffer.findMany({ orderBy: { price: 'asc' }, include: { match: true } }),
    prisma.ticketOrder.findMany({ orderBy: { createdAt: 'desc' }, take: 30, include: { ticketOffer: { include: { match: true } } } }),
    prisma.match.findMany({ where: { status: { in: ['SCHEDULED', 'LIVE'] } }, orderBy: { date: 'asc' }, include: { team: true } }),
  ])

  return (
    <div className="space-y-12">
      <div>
        <h1 className="mb-2 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Billetterie</h1>
        <p className="mb-8 text-sm text-muted-foreground">Créez les catégories de billets pour chaque match et suivez les réservations.</p>

        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Match</th>
                <th className="px-4 py-3">Catégorie</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Restant / Capacité</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">AKWABA FC vs {offer.match.opponent}</td>
                  <td className="px-4 py-3">{TICKET_TIER_LABELS[offer.tier as TicketTier] ?? offer.tier}</td>
                  <td className="px-4 py-3">{formatCFA(offer.price)}</td>
                  <td className="px-4 py-3">{offer.remaining} / {offer.capacity}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton id={offer.id} action={deleteTicketOfferAction} />
                  </td>
                </tr>
              ))}
              {offers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Aucune offre de billet créée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <form action={createTicketOfferAction} className="mt-5 flex flex-wrap items-end gap-3 border-t border-border pt-5">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Match</label>
            <select name="matchId" required className="min-h-11 border border-border bg-background px-3 text-sm">
              {matches.map((m) => (
                <option key={m.id} value={m.id}>{m.team.name} vs {m.opponent} — {formatDateShort(m.date)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Catégorie</label>
            <select name="tier" required className="min-h-11 border border-border bg-background px-3 text-sm">
              {TICKET_TIERS.map((t) => (
                <option key={t} value={t}>{TICKET_TIER_LABELS[t as TicketTier]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Prix (FCFA)</label>
            <input name="price" type="number" min={0} required className="min-h-11 w-32 border border-border bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Capacité</label>
            <input name="capacity" type="number" min={1} required className="min-h-11 w-32 border border-border bg-background px-3 text-sm" />
          </div>
          <button type="submit" className="flex items-center gap-2 bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl font-bold uppercase text-foreground">Réservations récentes</h2>
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Match</th>
                <th className="px-4 py-3">Qté</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{order.fullName}</p>
                    <p className="text-[11px] text-muted-foreground">{order.email}</p>
                  </td>
                  <td className="px-4 py-3">vs {order.ticketOffer.match.opponent}</td>
                  <td className="px-4 py-3">{order.quantity}</td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect id={order.id} status={order.status} action={updateTicketOrderStatusAction} />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Aucune réservation pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
