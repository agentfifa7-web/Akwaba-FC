import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { GalleryGrid } from '@/components/site/gallery-grid'
import { Reveal } from '@/components/ui/motion'
import { getGallery } from '@/lib/data'
import { GALLERY_CATEGORIES, GALLERY_CATEGORY_LABELS, type GalleryCategory } from '@/lib/constants'
import { img } from '@/lib/images'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Galerie' }
export const dynamic = 'force-dynamic'

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const cat = GALLERY_CATEGORIES.includes(category as GalleryCategory) ? category : undefined
  const images = await getGallery(cat)

  return (
    <SiteChrome>
      <PageHeader kicker="Médias" title="Notre" accentTitle="galerie" description="Matchs, entraînements, supporters, événements : revivez les temps forts du club en images." image={img('crowd', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="scrollbar-none mb-10 flex gap-2 overflow-x-auto">
            <Link href="/gallery" className={cn('shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest', !cat ? 'border-accent bg-accent text-[#071a2f]' : 'border-border text-muted-foreground hover:border-accent-foreground')}>
              Tout
            </Link>
            {GALLERY_CATEGORIES.map((c) => (
              <Link key={c} href={`/gallery?category=${c}`} className={cn('shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest', cat === c ? 'border-accent bg-accent text-[#071a2f]' : 'border-border text-muted-foreground hover:border-accent-foreground')}>
                {GALLERY_CATEGORY_LABELS[c as GalleryCategory]}
              </Link>
            ))}
          </Reveal>
          <GalleryGrid images={images} />
        </div>
      </section>
    </SiteChrome>
  )
}
