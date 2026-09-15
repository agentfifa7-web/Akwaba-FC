import { CartProvider } from '@/components/site/cart-context'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
