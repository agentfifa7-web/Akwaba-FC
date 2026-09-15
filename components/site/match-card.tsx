import Link from 'next/link'
import { formatDateShort, formatTime } from '@/lib/format'
import { Badge, LiveDot } from '@/components/ui/badge'
import { ClubLogo } from '@/components/site/club-logo'
import { MapPin } from 'lucide-react'

type MatchLike = {
  id: string
  opponent: string
  opponentLogo?: string | null
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
      className="card-elevated card-elevated-hover group block rounded-3xl p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span className="rounded-full bg-secondary px-3 py-1">{match.competition.name}</span>
        {match.status === 'LIVE' ? (
          <Badge tone="live">
            <LiveDot /> En direct
          </Badge>
        ) : (
          <span>{formatDateShort(match.date)}</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <ClubLogo name={home} logoUrl={match.isHome ? undefined : match.opponentLogo} size={30} />
          <p className="truncate text-sm font-bold leading-tight">{home}</p>
        </div>
        <p
          className={
            match.status === 'SCHEDULED'
              ? 'shrink-0 rounded-full border border-border bg-secondary px-4 py-1.5 font-display text-sm font-bold text-muted-foreground'
              : 'shrink-0 rounded-full bg-primary px-4 py-1.5 font-display text-lg font-bold text-primary-foreground shadow-md transition-transform duration-300 group-hover:scale-105'
          }
        >
          {match.status === 'SCHEDULED' ? 'VS' : `${match.homeScore} - ${match.awayScore}`}
        </p>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5 text-right">
          <p className="truncate text-sm font-bold leading-tight">{away}</p>
          <ClubLogo name={away} logoUrl={match.isHome ? match.opponentLogo : undefined} size={30} />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-2.5 text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className="flex items-center gap-1.5 truncate">
          <MapPin className="h-3 w-3 shrink-0 text-accent-foreground" /> {match.stadium}
        </span>
        {match.status === 'SCHEDULED' && <span className="shrink-0 font-bold text-foreground">{formatTime(match.date)}</span>}
      </div>
    </Link>
  )
}
