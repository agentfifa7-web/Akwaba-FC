import { cn } from '@/lib/utils'

function isAkwaba(name: string) {
  return name.trim().toUpperCase().includes('AKWABA')
}

function initials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

function hash(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

// Écussons clairs générés en local (dégradé + initiales) — aucune requête
// réseau, donc toujours visibles instantanément, contrairement à un avatar
// distant qui peut tarder ou échouer à charger.
const OPPONENT_GRADIENTS = [
  'linear-gradient(135deg,#eef1f5 0%,#d7e0ea 100%)',
  'linear-gradient(135deg,#f2ece0 0%,#e0d2b8 100%)',
  'linear-gradient(135deg,#e9eef5 0%,#c3d2e6 100%)',
  'linear-gradient(135deg,#f0eee8 0%,#d9d1bf 100%)',
  'linear-gradient(135deg,#eaf0ee 0%,#c9ddd3 100%)',
]

// Écusson générique pour tout club affiché sur la plateforme : AKWABA FC
// garde son identité navy/or, les adversaires reçoivent un écusson dégradé
// avec leurs initiales (ou leur vrai logo si `logoUrl` est fourni).
export function ClubLogo({
  name,
  logoUrl,
  size = 40,
  className,
}: {
  name: string
  logoUrl?: string | null
  size?: number
  className?: string
}) {
  if (isAkwaba(name)) {
    return (
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full border-2 border-accent bg-primary font-display font-bold text-accent shadow-sm transition-transform duration-500 group-hover:animate-wobble',
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.3 }}
      >
        AFC
      </div>
    )
  }

  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={`Écusson ${name}`}
        className={cn(
          'shrink-0 rounded-full border border-border bg-white object-cover shadow-sm transition-transform duration-500 group-hover:animate-wobble',
          className,
        )}
        style={{ width: size, height: size }}
      />
    )
  }

  const gradient = OPPONENT_GRADIENTS[hash(name) % OPPONENT_GRADIENTS.length]
  return (
    <div
      role="img"
      aria-label={`Écusson ${name}`}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full border border-black/5 font-display font-bold text-[#071a2f] shadow-sm transition-transform duration-500 group-hover:animate-wobble',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.32, backgroundImage: gradient }}
    >
      {initials(name)}
    </div>
  )
}
