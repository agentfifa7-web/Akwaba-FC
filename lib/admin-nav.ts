import type { Role } from '@/lib/constants'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Newspaper,
  UserSquare2,
  Shield,
  CalendarDays,
  ListOrdered,
  Video,
  Image as ImageIcon,
  Handshake,
  ShoppingBag,
  Ticket,
  Bell,
  FileStack,
  GraduationCap,
  Megaphone,
  UsersRound,
  Landmark,
} from 'lucide-react'

export type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
  roles: Role[] | null
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard, roles: null },
  { label: 'Actualités', href: '/admin/news', icon: Newspaper, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MEDIA_MANAGER'] },
  { label: 'Équipes', href: '/admin/teams', icon: UsersRound, roles: ['SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER'] },
  { label: 'Joueurs', href: '/admin/players', icon: UserSquare2, roles: ['SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER'] },
  { label: 'Staff', href: '/admin/staff', icon: Shield, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Matchs', href: '/admin/matches', icon: CalendarDays, roles: ['SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER'] },
  { label: 'Classements', href: '/admin/standings', icon: ListOrdered, roles: ['SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER'] },
  { label: 'Vidéos / Club TV', href: '/admin/videos', icon: Video, roles: ['SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR'] },
  { label: 'Galerie', href: '/admin/gallery', icon: ImageIcon, roles: ['SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR'] },
  { label: 'Academy — candidatures', href: '/admin/academy-applications', icon: GraduationCap, roles: ['SUPER_ADMIN', 'ADMIN', 'ACADEMY_MANAGER'] },
  { label: 'Partenaires', href: '/admin/partners', icon: Handshake, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Boutique', href: '/admin/shop', icon: ShoppingBag, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Billetterie', href: '/admin/tickets', icon: Ticket, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Espace presse', href: '/admin/press', icon: Megaphone, roles: ['SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER'] },
  { label: 'Recrutement', href: '/admin/recruitment', icon: FileStack, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { label: 'Pages du club', href: '/admin/pages', icon: Landmark, roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell, roles: ['SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR'] },
  { label: 'Utilisateurs', href: '/admin/users', icon: Shield, roles: ['SUPER_ADMIN'] },
]

export function navForRole(role: Role) {
  return ADMIN_NAV.filter((item) => item.roles === null || item.roles.includes(role))
}
