import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { VideoCard } from '@/components/site/video-card'
import { Reveal } from '@/components/ui/motion'
import { Badge } from '@/components/ui/badge'
import { getLiveVideo, getVideos } from '@/lib/data'
import { VIDEO_CATEGORIES, VIDEO_CATEGORY_LABELS, type VideoCategory } from '@/lib/constants'
import { img } from '@/lib/images'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Club TV' }
export const dynamic = 'force-dynamic'

export default async function ClubTvPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const cat = VIDEO_CATEGORIES.includes(category as VideoCategory) ? category : undefined
  const [liveVideo, videos] = await Promise.all([getLiveVideo(), getVideos({ category: cat })])

  return (
    <SiteChrome>
      <PageHeader kicker="AKWABA" title="Club" accentTitle="TV" description="Matchs, interviews, coulisses et documentaires : toute la vie du club en vidéo." image={img('sport3', 1800)} />

      {liveVideo && (
        <section className="bg-[#05080D] px-5 py-14 text-white sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <Reveal>
              <Badge tone="live" className="mb-6">
                <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> En direct
              </Badge>
              <Link href={`/club-tv/${liveVideo.slug}`} className="group relative block aspect-video overflow-hidden">
                <img src={liveVideo.thumbnailUrl} alt="" className="h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <h2 className="font-display text-3xl font-black uppercase sm:text-5xl">{liveVideo.title}</h2>
                  <p className="mt-3 text-sm text-white/60">Lecteur vidéo plein écran disponible sur la page du direct.</p>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="scrollbar-none mb-10 flex gap-2 overflow-x-auto">
            <Link href="/club-tv" className={cn('shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest', !cat ? 'border-accent bg-accent text-[#071a2f]' : 'border-border text-muted-foreground hover:border-accent-foreground')}>
              Toutes les émissions
            </Link>
            {VIDEO_CATEGORIES.map((c) => (
              <Link key={c} href={`/club-tv?category=${c}`} className={cn('shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest', cat === c ? 'border-accent bg-accent text-[#071a2f]' : 'border-border text-muted-foreground hover:border-accent-foreground')}>
                {VIDEO_CATEGORY_LABELS[c as VideoCategory]}
              </Link>
            ))}
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, i) => (
              <Reveal key={video.slug} delay={(i % 6) * 0.05}>
                <VideoCard video={video} />
              </Reveal>
            ))}
            {videos.length === 0 && <p className="text-sm text-muted-foreground">Aucune vidéo pour cette catégorie.</p>}
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
