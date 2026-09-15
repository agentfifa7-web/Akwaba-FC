import Link from 'next/link'
import { NEWS_CATEGORY_LABELS, type NewsCategory } from '@/lib/constants'
import { formatDateShort } from '@/lib/format'

type NewsLike = {
  slug: string
  title: string
  category: string
  coverImage: string
  publishedAt: Date | string
}

export function NewsCard({ article, size = 'default' }: { article: NewsLike; size?: 'default' | 'large' }) {
  return (
    <Link href={`/news/${article.slug}`} className="group relative block overflow-hidden bg-primary">
      <img
        src={article.coverImage}
        alt=""
        className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
          size === 'large' ? 'aspect-[1.3] md:aspect-auto md:h-full' : 'aspect-[1.55]'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-accent">
          {NEWS_CATEGORY_LABELS[article.category as NewsCategory] ?? article.category}
        </p>
        <h3 className={`font-display font-bold uppercase leading-tight text-white ${size === 'large' ? 'text-3xl sm:text-5xl' : 'text-xl sm:text-2xl'}`}>
          {article.title}
        </h3>
        <p className="mt-4 text-[10px] font-semibold tracking-widest text-white/55">{formatDateShort(article.publishedAt)}</p>
      </div>
    </Link>
  )
}
