'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Tabs({
  tabs,
  defaultValue,
  onChange,
  className,
}: {
  tabs: { value: string; label: string }[]
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
}) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value)

  function select(value: string) {
    setActive(value)
    onChange?.(value)
  }

  return (
    <div className={cn('scrollbar-none flex gap-1 overflow-x-auto border-b border-border', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => select(tab.value)}
          className={cn(
            'shrink-0 border-b-2 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-colors',
            active === tab.value
              ? 'border-accent text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
