import Link from 'next/link'
import { Play } from 'lucide-react'
import { VIDEO_CATEGORY_LABELS, type VideoCategory } from '@/lib/constants'
import { formatDuration } from '@/lib/format'
import { Badge, LiveDot } from '@/components/ui/badge'

type VideoLike = {
  slug: string
  title: string
  category: string
  thumbnailUrl: string
  durationSeconds: number
  isLive: boolean
}

export function VideoCard({ video }: { video: VideoLike }) {
  return (
    <Link
      href={`/club-tv/${video.slug}`}
      className="card-elevated card-elevated-hover group relative block overflow-hidden rounded-3xl bg-primary"
    >
      <div className="relative aspect-video overflow-hidden rounded-t-3xl">
        <img src={video.thumbnailUrl} alt="" className="h-full w-full object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-110" />
        <div className="absolute inset-0 bg-primary/20" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#071a2f] shadow-xl transition-transform duration-300 group-hover:scale-110">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </span>
        {video.isLive ? (
          <Badge tone="live" className="absolute left-3 top-3">
            <LiveDot /> Live
          </Badge>
        ) : (
          <span className="absolute bottom-3 right-3 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            {formatDuration(video.durationSeconds)}
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{VIDEO_CATEGORY_LABELS[video.category as VideoCategory] ?? video.category}</p>
        <h3 className="mt-2 font-display text-lg font-bold uppercase leading-tight text-white">{video.title}</h3>
      </div>
    </Link>
  )
}
