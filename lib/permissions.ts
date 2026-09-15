import type { Role } from '@/lib/constants'

// Règles d'accès par préfixe de route admin. `null` = tout utilisateur
// authentifié (peu importe le rôle) peut accéder. Le premier préfixe
// correspondant l'emporte — on trie par spécificité (le plus long d'abord)
// dans getAllowedRoles.
const ADMIN_ACCESS_RULES: Array<{ prefix: string; roles: Role[] | null }> = [
  { prefix: '/admin/users', roles: ['SUPER_ADMIN'] },
  { prefix: '/admin/staff', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { prefix: '/admin/partners', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { prefix: '/admin/shop', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { prefix: '/admin/tickets', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { prefix: '/admin/recruitment', roles: ['SUPER_ADMIN', 'ADMIN'] },
  { prefix: '/admin/players', roles: ['SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER'] },
  { prefix: '/admin/teams', roles: ['SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER'] },
  { prefix: '/admin/matches', roles: ['SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER'] },
  { prefix: '/admin/standings', roles: ['SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER'] },
  { prefix: '/admin/academy-applications', roles: ['SUPER_ADMIN', 'ADMIN', 'ACADEMY_MANAGER'] },
  { prefix: '/admin/academy', roles: ['SUPER_ADMIN', 'ADMIN', 'ACADEMY_MANAGER'] },
  { prefix: '/admin/videos', roles: ['SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR'] },
  { prefix: '/admin/gallery', roles: ['SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR'] },
  { prefix: '/admin/press', roles: ['SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER'] },
  { prefix: '/admin/notifications', roles: ['SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR'] },
  { prefix: '/admin/pages', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'] },
  { prefix: '/admin/news', roles: ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MEDIA_MANAGER'] },
  { prefix: '/admin/login', roles: null },
  { prefix: '/admin', roles: null },
]

export function getAllowedRoles(pathname: string): Role[] | null {
  const rule = ADMIN_ACCESS_RULES.filter((r) => pathname.startsWith(r.prefix)).sort(
    (a, b) => b.prefix.length - a.prefix.length,
  )[0]
  return rule ? rule.roles : null
}

export function canAccess(pathname: string, role: Role | undefined) {
  const allowed = getAllowedRoles(pathname)
  if (allowed === null) return true
  if (!role) return false
  return allowed.includes(role)
}
