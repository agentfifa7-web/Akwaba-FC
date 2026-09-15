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
    <div className={cn('scrollbar-none flex w-fit gap-1 overflow-x-auto rounded-full border border-border bg-secondary/60 p-1.5', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => select(tab.value)}
          className={cn(
            'shrink-0 rounded-full px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300',
            active === tab.value
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
