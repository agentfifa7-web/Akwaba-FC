'use client'

import { useActionState, useState } from 'react'
import { ShoppingBag, X, Minus, Plus } from 'lucide-react'
import { useCart } from '@/components/site/cart-context'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input, Label, Textarea } from '@/components/ui/input'
import { submitShopOrderAction, type ActionState } from '@/lib/actions/public-actions'
import { formatCFA } from '@/lib/format'

export function CartDrawer() {
  const cart = useCart()
  const [open, setOpen] = useState(false)
  const [checkout, setCheckout] = useState(false)
  const [state, formAction, pending] = useActionState<ActionState, FormData>(submitShopOrderAction, {})

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#071a2f] shadow-xl lg:bottom-8"
        aria-label="Voir le panier"
      >
        <ShoppingBag className="h-5 w-5" />
        {cart.count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
            {cart.count}
          </span>
        )}
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} kicker="Boutique" title={checkout ? 'Finaliser' : 'Mon panier'}>
        {state.success ? (
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold">{state.success}</p>
            <Button
              onClick={() => {
                cart.clear()
                setOpen(false)
                setCheckout(false)
              }}
              className="w-full justify-center"
            >
              Fermer
            </Button>
          </div>
        ) : !checkout ? (
          <div className="space-y-5">
            {cart.items.length === 0 && <p className="text-sm text-muted-foreground">Votre panier est vide.</p>}
            <ul className="max-h-72 space-y-4 overflow-y-auto">
              {cart.items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="flex items-center gap-3">
                  <img src={item.imageUrl} alt="" className="h-14 w-14 shrink-0 object-cover" />
                  <div className="flex-1">
                    <p className="text-xs font-bold">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Taille {item.size} · {formatCFA(item.price)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button type="button" onClick={() => cart.updateQuantity(item.productId, item.size, item.quantity - 1)} className="flex h-6 w-6 items-center justify-center border border-border">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-xs">{item.quantity}</span>
                      <button type="button" onClick={() => cart.updateQuantity(item.productId, item.size, item.quantity + 1)} className="flex h-6 w-6 items-center justify-center border border-border">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <button type="button" onClick={() => cart.remove(item.productId, item.size)} aria-label="Retirer" className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            {cart.items.length > 0 && (
              <>
                <div className="flex items-center justify-between border-t border-border pt-4 text-sm font-bold">
                  <span>Total</span>
                  <span>{formatCFA(cart.total)}</span>
                </div>
                <Button onClick={() => setCheckout(true)} className="w-full justify-center">
                  Commander
                </Button>
              </>
            )}
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="items" value={JSON.stringify(cart.items.map(({ imageUrl, ...rest }) => rest))} />
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
              <Label htmlFor="address">Adresse de livraison</Label>
              <Textarea id="address" name="address" rows={2} required />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 text-sm font-bold">
              <span>Total</span>
              <span>{formatCFA(cart.total)}</span>
            </div>
            {state.error && <p className="text-xs font-semibold text-destructive">{state.error}</p>}
            <Button type="submit" disabled={pending} className="w-full justify-center">
              {pending ? 'Envoi…' : 'Valider la commande'}
            </Button>
            <p className="text-[11px] text-muted-foreground">Le paiement en ligne sera bientôt disponible. Notre équipe vous contactera pour la livraison.</p>
          </form>
        )}
      </Dialog>
    </>
  )
}
