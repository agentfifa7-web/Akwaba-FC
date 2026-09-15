import { notFound } from 'next/navigation'
import { SiteChrome } from '@/components/site/site-chrome'
import { Reveal } from '@/components/ui/motion'
import { NewsBlocks } from '@/components/site/news-blocks'
import { ShareButtons } from '@/components/site/share-buttons'
import { NewsCard } from '@/components/site/news-card'
import { getNewsBySlug, getRelatedNews } from '@/lib/data'
import { NEWS_CATEGORY_LABELS, type NewsCategory } from '@/lib/constants'
import { formatDateFr } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)
  return { title: article?.title ?? 'Actualité' }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)
  if (!article) notFound()
  const related = await getRelatedNews(article.category, article.slug)
  const tags = Array.isArray(article.tags) ? (article.tags as string[]) : []

  return (
    <SiteChrome transparent>
      <section className="relative flex min-h-[440px] items-end bg-primary pb-12 pt-32 text-white sm:min-h-[540px]">
        <img src={article.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,8,13,.97)_10%,rgba(5,8,13,.4)_100%)]" />
        <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-12">
          <Reveal>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-accent">{NEWS_CATEGORY_LABELS[article.category as NewsCategory] ?? article.category}</p>
            <h1 className="font-display text-4xl font-black uppercase leading-[.95] sm:text-6xl">{article.title}</h1>
            <p className="mt-5 text-sm text-white/60">
              Par {article.author} · {formatDateFr(article.publishedAt)}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="mb-8 text-lg font-semibold leading-7 text-foreground">{article.excerpt}</p>
          </Reveal>
          <NewsBlocks blocks={article.blocks} />

          <div className="mt-10 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <ShareButtons title={article.title} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-secondary px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <p className="mb-8 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">À lire aussi</p>
            <div className="grid gap-5 sm:grid-cols-3">
              {related.map((item) => (
                <NewsCard key={item.slug} article={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteChrome>
  )
}
