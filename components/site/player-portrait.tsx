import { Shirt } from 'lucide-react'
import { cn } from '@/lib/utils'

// Portraits chic de secours (dégradé navy + silhouette maillot + numéro
// géant en filigrane) utilisés tant qu'aucune vraie photo n'a été
// téléversée par le club — bien plus élégant qu'un simple monogramme.
const GRADIENTS = [
  'bg-[linear-gradient(135deg,#0a1f3d_0%,#123258_45%,#1d4a86_100%)]',
  'bg-[linear-gradient(135deg,#0d2540_0%,#16406f_45%,#2c5c9e_100%)]',
  'bg-[linear-gradient(135deg,#10192a_0%,#1b3660_45%,#284d8f_100%)]',
  'bg-[linear-gradient(135deg,#081b33_0%,#173a68_45%,#2f5fa0_100%)]',
  'bg-[linear-gradient(135deg,#0e2038_0%,#1a3c6c_45%,#3566a6_100%)]',
]

function hash(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return h
}

function isPlaceholder(url: string | null) {
  return !url || url.includes('dicebear.com')
}

export function PlayerPortrait({
  photoUrl,
  seed,
  number,
  alt,
  className,
}: {
  photoUrl: string | null
  seed: string
  number: number
  alt: string
  className?: string
}) {
  if (!isPlaceholder(photoUrl)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl!} alt={alt} className={className} />
  }

  const h = hash(seed)
  const gradient = GRADIENTS[h % GRADIENTS.length]
  const rotate = (h % 5) - 2

  return (
    <div className={cn('relative flex items-center justify-center overflow-hidden', gradient, className)} aria-label={alt} role="img">
      <span
        className="pointer-events-none absolute -right-3 -top-8 select-none font-display text-[9rem] font-black leading-none text-white/[0.07] sm:text-[12rem]"
        aria-hidden
      >
        {number}
      </span>
      <Shirt
        strokeWidth={0.6}
        className="relative h-[58%] w-[58%] text-white/[0.1]"
        style={{ transform: `rotate(${rotate}deg)` }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(212,175,55,0.18),transparent_60%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_95%,rgba(0,0,0,0.35),transparent_55%)]" aria-hidden />
    </div>
  )
}
