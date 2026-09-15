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
