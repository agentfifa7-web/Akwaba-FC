import { formatDateFr } from '@/lib/format'

type Entry = { id: string; date: Date | string; type: string; rating: number }

const W = 640
const H = 200
const PAD_X = 16
const PAD_Y = 20
const MAX_RATING = 10

// Courbe de progression du joueur (matchs + entraînements) — SVG pur,
// point plein pour un match, point creux pour un entraînement.
export function PlayerProgressChart({ entries, color }: { entries: Entry[]; color: string }) {
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">Pas encore de données de progression.</p>
  }

  const points = entries.map((e, i) => {
    const x = entries.length === 1 ? PAD_X : PAD_X + (i / (entries.length - 1)) * (W - PAD_X * 2)
    const y = H - PAD_Y - (Math.min(MAX_RATING, Math.max(0, e.rating)) / MAX_RATING) * (H - PAD_Y * 2)
    return { x, y, entry: e }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${H - PAD_Y} L${points[0].x.toFixed(1)},${H - PAD_Y} Z`
  const gradientId = `progress-fill-${color.replace('#', '')}`

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-border">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {[0, 2.5, 5, 7.5, 10].map((v) => {
          const y = H - PAD_Y - (v / MAX_RATING) * (H - PAD_Y * 2)
          return <line key={v} x1={PAD_X} x2={W - PAD_X} y1={y} y2={y} stroke="currentColor" strokeOpacity={0.5} />
        })}
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {points.map(({ x, y, entry }) => (
          <circle
            key={entry.id}
            cx={x}
            cy={y}
            r={entry.type === 'MATCH' ? 4.5 : 3.5}
            fill={entry.type === 'MATCH' ? color : 'var(--card)'}
            stroke={color}
            strokeWidth={entry.type === 'TRAINING' ? 2 : 0}
          >
            <title>{`${formatDateFr(entry.date, 'd MMM yyyy')} — ${entry.type === 'MATCH' ? 'Match' : 'Entraînement'} — ${entry.rating.toFixed(1)}/10`}</title>
          </circle>
        ))}
      </svg>
      <div className="mt-3 flex items-center gap-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} /> Match
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: color, background: 'var(--card)' }} /> Entraînement
        </span>
      </div>
    </div>
  )
}
