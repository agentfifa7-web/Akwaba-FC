'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { TEAM_SLUGS, TEAM_LABELS, type TeamSlug } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function TeamFilterTabs({ paramName = 'team' }: { paramName?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get(paramName) ?? 'all'

  function go(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'all') params.delete(paramName)
    else params.set(paramName, value)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto">
      <button
        onClick={() => go('all')}
        className={cn(
          'shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest',
          active === 'all' ? 'border-accent bg-accent text-[#071a2f]' : 'border-border text-muted-foreground hover:border-accent-foreground',
        )}
      >
        Toutes les équipes
      </button>
      {TEAM_SLUGS.map((slug) => (
        <button
          key={slug}
          onClick={() => go(slug)}
          className={cn(
            'shrink-0 border px-4 py-2 text-[11px] font-bold uppercase tracking-widest',
            active === slug ? 'border-accent bg-accent text-[#071a2f]' : 'border-border text-muted-foreground hover:border-accent-foreground',
          )}
        >
          {TEAM_LABELS[slug as TeamSlug]}
        </button>
      ))}
    </div>
  )
}
