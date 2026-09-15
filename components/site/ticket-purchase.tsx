'use client'

import { useActionState, useState } from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'
import { submitTicketOrderAction, type ActionState } from '@/lib/actions/public-actions'
import { formatCFA } from '@/lib/format'
import { TICKET_TIER_LABELS, type TicketTier } from '@/lib/constants'

export function TicketPurchaseButton({
  offerId,
  tier,
  price,
  remaining,
  matchLabel,
}: {
  offerId: string
  tier: string
  price: number
  remaining: number
  matchLabel: string
}) {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState<ActionState, FormData>(submitTicketOrderAction, {})

  return (
    <>
      <Button variant="accent" size="sm" disabled={remaining <= 0} onClick={() => setOpen(true)}>
        {remaining <= 0 ? 'Épuisé' : 'Acheter'}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} kicker="Jour de match" title={TICKET_TIER_LABELS[tier as TicketTier] ?? tier}>
        {state.success ? (
          <p className="text-sm font-semibold text-foreground">{state.success}</p>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="ticketOfferId" value={offerId} />
            <p className="text-sm text-muted-foreground">
              {matchLabel} — {formatCFA(price)} / billet
            </p>
            <div>
              <Label htmlFor="fullName">Nom complet</Label>
              <Input id="fullName" name="fullName" required />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
            <div>
              <Label htmlFor="quantity">Nombre de billets</Label>
              <Input id="quantity" name="quantity" type="number" min={1} max={Math.min(10, remaining)} defaultValue={1} required />
            </div>
            {state.error && <p className="text-xs font-semibold text-destructive">{state.error}</p>}
            <Button type="submit" variant="primary" disabled={pending} className="w-full justify-center">
              {pending ? 'Envoi…' : 'Confirmer la réservation'}
            </Button>
            <p className="text-[11px] text-muted-foreground">
              Le paiement en ligne sera bientôt disponible. Votre réservation est enregistrée et confirmée par e-mail.
            </p>
          </form>
        )}
      </Dialog>
    </>
  )
}
