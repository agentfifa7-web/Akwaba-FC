'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Vue d’ensemble', href: '/club' },
  { label: 'Notre histoire', href: '/club/histoire' },
  { label: 'Nos valeurs', href: '/club/valeurs' },
  { label: 'Notre palmarès', href: '/club/palmares' },
  { label: 'Notre stade', href: '/club/stade' },
  { label: 'Gouvernance', href: '/club/gouvernance' },
  { label: 'Staff & direction', href: '/club/staff' },
]

export function ClubSideNav() {
  const pathname = usePathname()
  return (
    <nav className="scrollbar-none flex gap-1 overflow-x-auto border-b border-border lg:sticky lg:top-28 lg:block lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r lg:pr-6">
      {links.map((link) => {
        const active = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'shrink-0 whitespace-nowrap border-b-2 px-3 py-3 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors lg:block lg:border-b-0 lg:border-l-2 lg:px-4 lg:py-2.5',
              active ? 'border-accent text-accent-foreground' : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
