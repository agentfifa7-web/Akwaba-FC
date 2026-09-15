'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Ticket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DarkModeToggle } from '@/components/site/dark-mode-toggle'
import { NotificationBell } from '@/components/site/notification-bell'
import { TEAM_LABELS } from '@/lib/constants'

const teamLinks = [
  { label: TEAM_LABELS.men, href: '/teams/men' },
  { label: TEAM_LABELS.women, href: '/teams/women' },
  { label: TEAM_LABELS.reserve, href: '/teams/reserve' },
  { label: TEAM_LABELS.u18, href: '/teams/u18' },
]

const clubLinks = [
  { label: "Notre histoire", href: '/club/histoire' },
  { label: 'Nos valeurs', href: '/club/valeurs' },
  { label: 'Notre palmarès', href: '/club/palmares' },
  { label: 'Notre stade', href: '/club/stade' },
  { label: 'Gouvernance', href: '/club/gouvernance' },
  { label: 'Staff & direction', href: '/club/staff' },
]

const primaryNav = [
  { label: 'Le club', href: '/club', children: clubLinks },
  { label: 'Équipes', href: '/teams/men', children: teamLinks },
  { label: 'Matchs', href: '/matches' },
  { label: 'Actualités', href: '/news' },
  { label: 'Club TV', href: '/club-tv' },
  { label: 'Academy', href: '/academy' },
  { label: 'Boutique', href: '/shop' },
  { label: 'Partenaires', href: '/partners' },
  { label: 'Contact', href: '/contact' },
]

const tickerLinks = [
  { label: 'Prochain match', href: '/matches' },
  { label: 'Résultats', href: '/matches#resultats' },
  { label: 'Classement', href: '/standings' },
  { label: 'Club TV', href: '/club-tv' },
  { label: 'Billetterie', href: '/tickets' },
]

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  const solid = !transparent || scrolled

  return (
    <header className="fixed inset-x-0 top-0 z-40 text-white">
      <div className="hidden border-b border-white/10 bg-primary sm:block">
        <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-end gap-6 px-8 lg:px-12">
          {tickerLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div
        className={cn(
          'border-b transition-colors duration-300',
          solid ? 'border-white/10 bg-primary/97 backdrop-blur-md' : 'border-white/15 bg-transparent',
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3" aria-label="AKWABA FC, accueil">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-accent bg-primary font-display text-[11px] font-bold tracking-tighter text-accent">
              AFC
            </div>
            <div className="hidden border-l border-white/30 pl-3 text-[11px] font-bold leading-tight tracking-[0.22em] sm:block">
              AKWABA
              <br />
              FOOTBALL CLUB
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
            {primaryNav.map((item) => (
              <div
                key={item.label}
                className="group relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                onMouseLeave={() => item.children && setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 py-6 text-[11px] font-semibold uppercase tracking-[0.13em] transition-colors hover:text-accent',
                    pathname === item.href || pathname?.startsWith(item.href + '/') ? 'text-accent' : 'text-white/80',
                  )}
                >
                  {item.label}
                  {item.children && <ChevronDown className="h-3 w-3" />}
                </Link>
                {item.children && (
                  <div
                    className={cn(
                      'glass-panel absolute left-0 top-[calc(100%-4px)] min-w-[240px] overflow-hidden rounded-2xl bg-primary/95 p-2 shadow-2xl transition-all duration-300',
                      openDropdown === item.label ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0',
                    )}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-xl px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-white/80 transition-colors hover:bg-white/10 hover:text-accent"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <DarkModeToggle />
            <NotificationBell />
            <Link
              href="/tickets"
              className="hidden items-center gap-2 rounded-full bg-accent px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[#071a2f] shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40 sm:flex"
            >
              <Ticket className="h-3.5 w-3.5" /> Billetterie
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white/10 lg:hidden"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="menu-mobile"
          className="max-h-[calc(100vh-72px)] overflow-y-auto rounded-b-[1.75rem] border-t border-white/15 bg-primary px-6 py-5 shadow-2xl lg:hidden"
          aria-label="Menu mobile"
        >
          {primaryNav.map((item) => (
            <div key={item.label} className="border-b border-white/10 py-3">
              <Link href={item.href} className="block text-xs font-bold uppercase tracking-widest text-white">
                {item.label}
              </Link>
              {item.children && (
                <div className="mt-3 flex flex-col gap-2.5 pl-3">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href} className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/tickets" className="rounded-full mt-5 flex items-center justify-center gap-2 bg-accent px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#071a2f]">
            <Ticket className="h-4 w-4" /> Billetterie
          </Link>
        </nav>
      )}
    </header>
  )
}
