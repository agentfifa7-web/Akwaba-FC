import Link from 'next/link'
import { formatDateShort, formatTime } from '@/lib/format'
import { Badge } from '@/components/ui/badge'

type MatchLike = {
  id: string
  opponent: string
  isHome: boolean
  date: Date | string
  stadium: string
  status: string
  homeScore: number | null
  awayScore: number | null
  competition: { name: string }
  team: { name: string; slug: string }
}

export function MatchCard({ match }: { match: MatchLike }) {
  const home = match.isHome ? 'AKWABA FC' : match.opponent
  const away = match.isHome ? match.opponent : 'AKWABA FC'
  return (
    <Link
      href={`/matches/${match.id}`}
      className="block border border-border bg-card p-5 transition-colors hover:border-accent-foreground"
    >
      <div className="mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>{match.competition.name}</span>
        {match.status === 'LIVE' ? (
          <Badge tone="live">
            <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> En direct
          </Badge>
        ) : (
          <span>{formatDateShort(match.date)}</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="flex-1 text-sm font-bold leading-tight">{home}</p>
        <p className="shrink-0 px-3 font-display text-xl font-bold">
          {match.status === 'SCHEDULED' ? 'VS' : `${match.homeScore} - ${match.awayScore}`}
        </p>
        <p className="flex-1 text-right text-sm font-bold leading-tight">{away}</p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>{match.stadium}</span>
        {match.status === 'SCHEDULED' && <span>{formatTime(match.date)}</span>}
      </div>
    </Link>
  )
}
