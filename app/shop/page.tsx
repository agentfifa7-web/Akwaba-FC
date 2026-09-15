import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/ui/motion'
import { ProductCard } from '@/components/site/product-card'
import { CartDrawer } from '@/components/site/cart-drawer'
import { getShopProducts } from '@/lib/data'
import { SHOP_CATEGORIES, SHOP_CATEGORY_LABELS, type ShopCategory } from '@/lib/constants'
import { img } from '@/lib/images'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Boutique officielle' }
export const dynamic = 'force-dynamic'

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const cat = SHOP_CATEGORIES.includes(category as ShopCategory) ? category : undefined
  const products = await getShopProducts(cat)

  return (
    <SiteChrome>
      <PageHeader kicker="Official Store" title="Boutique" accentTitle="officielle" description="Maillots, textiles et produits supporters aux couleurs d'AKWABA FC." image={img('sport5', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="scrollbar-none mb-10 flex gap-2 overflow-x-auto">
            <Link href="/shop" className={cn('shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest', !cat ? 'border-accent bg-accent text-[#071a2f]' : 'border-border text-muted-foreground hover:border-accent-foreground')}>
              Tout
            </Link>
            {SHOP_CATEGORIES.map((c) => (
              <Link key={c} href={`/shop?category=${c}`} className={cn('shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest', cat === c ? 'border-accent bg-accent text-[#071a2f]' : 'border-border text-muted-foreground hover:border-accent-foreground')}>
                {SHOP_CATEGORY_LABELS[c as ShopCategory]}
              </Link>
            ))}
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 8) * 0.05}>
                <ProductCard product={product} />
              </Reveal>
            ))}
            {products.length === 0 && <p className="text-sm text-muted-foreground">Aucun produit dans cette catégorie.</p>}
          </div>
        </div>
      </section>
      <CartDrawer />
    </SiteChrome>
  )
}
