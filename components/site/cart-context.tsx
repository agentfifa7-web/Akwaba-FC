'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = { productId: string; name: string; size: string; quantity: number; price: number; imageUrl: string }

type CartContextValue = {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (productId: string, size: string) => void
  updateQuantity: (productId: string, size: string, quantity: number) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'akwaba-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // stockage indisponible — le panier reste en mémoire pour la session
    }
  }, [items, hydrated])

  function add(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.size === item.size)
      if (existing) {
        return prev.map((i) => (i === existing ? { ...i, quantity: i.quantity + item.quantity } : i))
      }
      return [...prev, item]
    })
  }

  function remove(productId: string, size: string) {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.size === size)))
  }

  function updateQuantity(productId: string, size: string, quantity: number) {
    setItems((prev) => prev.map((i) => (i.productId === productId && i.size === size ? { ...i, quantity: Math.max(1, quantity) } : i)))
  }

  function clear() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return <CartContext.Provider value={{ items, add, remove, updateQuantity, clear, total, count }}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider')
  return ctx
}
