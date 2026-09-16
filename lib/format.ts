import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export function formatDateFr(date: Date | string, pattern = 'd MMMM yyyy') {
  return format(new Date(date), pattern, { locale: fr }).toUpperCase()
}

export function formatDateShort(date: Date | string) {
  return format(new Date(date), 'd MMM yyyy', { locale: fr })
}

export function formatTime(date: Date | string) {
  return format(new Date(date), 'HH:mm')
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatCFA(amount: number) {
  return `${amount.toLocaleString('fr-FR')} FCFA`
}

export function ageFromBirthDate(birthDate: Date | string) {
  const diff = Date.now() - new Date(birthDate).getTime()
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000))
}

// Convertit un lien YouTube/Vimeo classique en URL "embed" utilisable dans
// une <iframe>. Renvoie null si l'URL ne correspond à aucun des deux (dans
// ce cas on utilisera une balise <video> classique).
export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
      if (u.pathname.startsWith('/embed/')) return url
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1)
      if (id) return `https://www.youtube.com/embed/${id}`
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      if (id) return `https://player.vimeo.com/video/${id}`
    }
    return null
  } catch {
    return null
  }
}

export function isVideoFile(url: string) {
  return /\.(mp4|webm|ogg|mov)$/i.test(new URL(url, 'https://x.invalid').pathname)
}
