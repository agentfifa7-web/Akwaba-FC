import Link from 'next/link'
import { Play } from 'lucide-react'
import { VIDEO_CATEGORY_LABELS, type VideoCategory } from '@/lib/constants'
import { formatDuration } from '@/lib/format'
import { Badge } from '@/components/ui/badge'

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
    <Link href={`/club-tv/${video.slug}`} className="group relative block overflow-hidden bg-primary">
      <div className="relative aspect-video overflow-hidden">
        <img src={video.thumbnailUrl} alt="" className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-primary/20" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[#071a2f] transition-transform group-hover:scale-110">
            <Play className="h-5 w-5 fill-current" />
          </span>
        </span>
        {video.isLive ? (
          <Badge tone="live" className="absolute left-3 top-3">
            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> Live
          </Badge>
        ) : (
          <span className="absolute bottom-3 right-3 bg-primary/90 px-2 py-1 text-[10px] font-bold text-white">
            {formatDuration(video.durationSeconds)}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{VIDEO_CATEGORY_LABELS[video.category as VideoCategory] ?? video.category}</p>
        <h3 className="mt-2 font-display text-lg font-bold uppercase leading-tight text-white">{video.title}</h3>
      </div>
    </Link>
  )
}
