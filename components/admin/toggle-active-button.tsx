'use client'

import { useTransition } from 'react'
import { cn } from '@/lib/utils'

export function ToggleActiveButton({
  id,
  active,
  action,
}: {
  id: string
  active: boolean
  action: (id: string, active: boolean) => Promise<void>
}) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => action(id, !active))}
      className={cn(
        'px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50',
        active ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive',
      )}
    >
      {active ? 'Actif' : 'Désactivé'}
    </button>
  )
}
