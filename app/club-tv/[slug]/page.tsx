import { notFound } from 'next/navigation'
import { SiteChrome } from '@/components/site/site-chrome'
import { Reveal } from '@/components/ui/motion'
import { VideoCard } from '@/components/site/video-card'
import { Badge } from '@/components/ui/badge'
import { getVideoBySlug, getVideos } from '@/lib/data'
import { VIDEO_CATEGORY_LABELS, type VideoCategory } from '@/lib/constants'
import { formatDateFr, formatDuration } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const video = await getVideoBySlug(slug)
  return { title: video?.title ?? 'Club TV' }
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const video = await getVideoBySlug(slug)
  if (!video) notFound()
  const more = (await getVideos({ category: video.category, take: 4 })).filter((v) => v.slug !== video.slug)

  return (
    <SiteChrome>
      <section className="bg-[#05080D] px-5 pb-16 pt-32 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <div className="aspect-video w-full bg-black">
              <video src={video.videoUrl} poster={video.thumbnailUrl} controls autoPlay={video.isLive} className="h-full w-full" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">{VIDEO_CATEGORY_LABELS[video.category as VideoCategory]}</span>
              {video.isLive && (
                <Badge tone="live">
                  <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> En direct
                </Badge>
              )}
              {!video.isLive && <span className="text-[11px] text-white/50">{formatDuration(video.durationSeconds)}</span>}
              <span className="text-[11px] text-white/40">{formatDateFr(video.publishedAt)}</span>
            </div>
            <h1 className="font-display text-3xl font-black uppercase sm:text-4xl">{video.title}</h1>
            {video.description && <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">{video.description}</p>}
          </Reveal>
        </div>
      </section>

      {more.length > 0 && (
        <section className="px-5 py-16 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1440px]">
            <p className="mb-8 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Plus de contenus</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {more.map((v) => (
                <VideoCard key={v.slug} video={v} />
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteChrome>
  )
}
