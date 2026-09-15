import Link from 'next/link'
import { POSITION_LABELS, type Position } from '@/lib/constants'

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
    <Link href={`/players/${player.slug}`} className="group relative block overflow-hidden bg-primary">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={player.photoUrl ?? ''}
          alt={`${player.firstName} ${player.lastName}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/10 to-transparent" />
        <p className="absolute left-3 top-3 font-display text-3xl font-black text-accent">{player.number}</p>
        {player.captain && (
          <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-black text-[#071a2f]">
            C
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">{POSITION_LABELS[player.position as Position] ?? player.position}</p>
        <h3 className="mt-1 font-display text-lg font-bold uppercase leading-tight text-white">
          {player.firstName}
          <br />
          {player.lastName}
        </h3>
        <p className="mt-2 text-[10px] uppercase tracking-widest text-white/50">{player.nationality}</p>
      </div>
    </Link>
  )
}
