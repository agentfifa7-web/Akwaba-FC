'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CalendarDays, PlaySquare, Newspaper, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { label: 'Accueil', href: '/', icon: Home },
  { label: 'Match', href: '/matches', icon: CalendarDays },
  { label: 'TV', href: '/club-tv', icon: PlaySquare },
  { label: 'News', href: '/news', icon: Newspaper },
  { label: 'Menu', href: '/club', icon: Menu },
]

export function MobileTabBar() {
  const pathname = usePathname()
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-white/15 bg-primary px-2 text-white lg:hidden"
      aria-label="Navigation mobile"
    >
      {tabs.map((tab) => {
        const active = tab.href === '/' ? pathname === '/' : pathname?.startsWith(tab.href)
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={cn(
              'flex flex-col items-center gap-1 text-[9px] font-bold uppercase tracking-wider',
              active ? 'text-accent' : 'text-white/70',
            )}
          >
            <tab.icon className="h-[18px] w-[18px]" />
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
