import Link from 'next/link'
import { Star } from 'lucide-react'
import { POSITION_LABELS, type Position } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { PlayerPortrait } from '@/components/site/player-portrait'

type PlayerLike = {
  slug: string
  firstName: string
  lastName: string
  number: number
  position: string
  photoUrl: string | null
  nationality: string
  captain: boolean
}

export function PlayerCard({ player }: { player: PlayerLike }) {
  return (
    <Link
      href={`/players/${player.slug}`}
      className="group card-elevated card-elevated-hover relative block overflow-hidden rounded-[1.75rem] bg-primary"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem]">
        <PlayerPortrait
          photoUrl={player.photoUrl}
          seed={player.slug}
          number={player.number}
          alt={`${player.firstName} ${player.lastName}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/25 to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:ring-accent/60" />

        <div className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border-2 border-accent bg-primary/90 shadow-lg backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:scale-105">
          <span className="font-display text-lg font-bold text-accent">{player.number}</span>
        </div>

        {player.captain && (
          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-accent shadow-lg">
            <Star className="h-4 w-4 fill-[#071a2f] text-[#071a2f]" />
          </span>
        )}

        <div className="glass-panel absolute inset-x-2 bottom-2 rounded-2xl px-4 py-3.5">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent">
            {POSITION_LABELS[player.position as Position] ?? player.position}
          </p>
          <h3 className="mt-1 truncate font-display text-lg font-bold uppercase leading-tight text-white">
            {player.firstName} {player.lastName}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white/55">
            <span className={cn('h-1.5 w-1.5 rounded-full bg-accent/70')} />
            {player.nationality}
          </p>
        </div>
      </div>
    </Link>
  )
}
