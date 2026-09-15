'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navForRole } from '@/lib/admin-nav'
import type { Role } from '@/lib/constants'

export function AdminSidebarNav({ role }: { role: Role }) {
  const pathname = usePathname()
  const items = navForRole(role)
  return (
    <nav className="flex-1 overflow-y-auto py-3">
      {items.map((item) => {
        const active = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 border-l-2 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors',
              active ? 'border-accent bg-white/[.06] text-accent' : 'border-transparent text-white/65 hover:bg-white/[.04] hover:text-white',
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
