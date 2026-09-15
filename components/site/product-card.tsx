'use client'

import { useState } from 'react'
import { useCart } from '@/components/site/cart-context'
import { formatCFA } from '@/lib/format'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/input'

type Product = { id: string; slug: string; name: string; category: string; price: number; imageUrl: string; sizes: unknown; inStock: boolean }

export function ProductCard({ product }: { product: Product }) {
  const sizes = Array.isArray(product.sizes) ? (product.sizes as string[]) : ['Unique']
  const [size, setSize] = useState(sizes[0])
  const [added, setAdded] = useState(false)
  const { add } = useCart()

  return (
    <div className="group border border-border bg-card">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {!product.inStock && (
          <span className="absolute right-3 top-3 bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Rupture</span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold uppercase leading-tight">{product.name}</h3>
        <p className="mt-2 font-display text-xl font-black text-accent-foreground">{formatCFA(product.price)}</p>
        <div className="mt-4 flex items-center gap-2">
          {sizes.length > 1 && (
            <Select value={size} onChange={(e) => setSize(e.target.value)} className="min-h-10 flex-1" aria-label="Taille">
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          )}
          <Button
            size="sm"
            disabled={!product.inStock}
            onClick={() => {
              add({ productId: product.id, name: product.name, size, price: product.price, quantity: 1, imageUrl: product.imageUrl })
              setAdded(true)
              setTimeout(() => setAdded(false), 1500)
            }}
            className="shrink-0"
          >
            {added ? 'Ajouté ✓' : 'Ajouter'}
          </Button>
        </div>
      </div>
    </div>
  )
}
