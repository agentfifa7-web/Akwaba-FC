import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { NewsCard } from '@/components/site/news-card'
import { Reveal } from '@/components/ui/motion'
import { getNews, countNews } from '@/lib/data'
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS, type NewsCategory } from '@/lib/constants'
import { img } from '@/lib/images'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Actualités' }
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 9

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const { category, page } = await searchParams
  const cat = NEWS_CATEGORIES.includes(category as NewsCategory) ? category : undefined
  const currentPage = Math.max(1, Number(page) || 1)

  const [articles, total] = await Promise.all([
    getNews({ category: cat, take: PAGE_SIZE, skip: (currentPage - 1) * PAGE_SIZE }),
    countNews(cat),
  ])
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <SiteChrome>
      <PageHeader kicker="Newsroom" title="Toute" accentTitle="l'actualité" description="Chaque étape de la saison AKWABA FC, décryptée par la rédaction du club." image={img('sport4', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="scrollbar-none mb-10 flex gap-2 overflow-x-auto">
            <Link
              href="/news"
              className={cn('shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest', !cat ? 'border-accent bg-accent text-[#071a2f]' : 'border-border text-muted-foreground hover:border-accent-foreground')}
            >
              Toutes
            </Link>
            {NEWS_CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/news?category=${c}`}
                className={cn('shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest', cat === c ? 'border-accent bg-accent text-[#071a2f]' : 'border-border text-muted-foreground hover:border-accent-foreground')}
              >
                {NEWS_CATEGORY_LABELS[c as NewsCategory]}
              </Link>
            ))}
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <Reveal key={article.slug} delay={(i % 6) * 0.05}>
                <NewsCard article={article} />
              </Reveal>
            ))}
            {articles.length === 0 && <p className="text-sm text-muted-foreground">Aucune actualité pour cette catégorie.</p>}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-3">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1
                const qs = new URLSearchParams({ ...(cat ? { category: cat } : {}), page: String(p) })
                return (
                  <Link
                    key={p}
                    href={`/news?${qs.toString()}`}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center text-xs font-bold',
                      p === currentPage ? 'bg-primary text-white' : 'border border-border text-muted-foreground hover:border-accent-foreground',
                    )}
                  >
                    {p}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </SiteChrome>
  )
}
