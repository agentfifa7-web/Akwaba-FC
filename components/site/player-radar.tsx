import { PLAYER_ATTRIBUTE_KEYS, PLAYER_ATTRIBUTE_LABELS, type PlayerAttributeKey } from '@/lib/constants'

const SIZE = 280
const CENTER = SIZE / 2
const MAX_R = 88
const LEVELS = [20, 40, 60, 80, 100]

function point(index: number, total: number, value: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const r = (value / 100) * MAX_R
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)] as const
}

// Radar des attributs / compétences du joueur — dessiné en SVG pur (pas de
// dépendance de charting) pour rester léger et cohérent avec le design.
export function PlayerRadar({ attributes, color }: { attributes: Record<string, number>; color: string }) {
  const keys = PLAYER_ATTRIBUTE_KEYS
  const n = keys.length
  const valuePoints = keys.map((k, i) => point(i, n, attributes[k] ?? 0))
  const polygon = valuePoints.map((p) => p.join(',')).join(' ')

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-sm text-border">
      {LEVELS.map((lvl) => (
        <polygon key={lvl} points={keys.map((_, i) => point(i, n, lvl).join(',')).join(' ')} fill="none" stroke="currentColor" strokeOpacity={0.5} />
      ))}
      {keys.map((_, i) => {
        const [x, y] = point(i, n, 100)
        return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="currentColor" strokeOpacity={0.5} />
      })}
      <polygon points={polygon} fill={color} fillOpacity={0.28} stroke={color} strokeWidth={2} strokeLinejoin="round" />
      {valuePoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.5} fill={color} stroke="var(--card)" strokeWidth={1.5} />
      ))}
      {keys.map((k, i) => {
        const [lx, ly] = point(i, n, 120)
        return (
          <text
            key={k}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted-foreground text-[9px] font-bold uppercase tracking-wide"
          >
            {PLAYER_ATTRIBUTE_LABELS[k as PlayerAttributeKey]} · {attributes[k] ?? 0}
          </text>
        )
      })}
    </svg>
  )
}
