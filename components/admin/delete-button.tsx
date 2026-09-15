'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'

export function DeleteButton({ id, action }: { id: string; action: (id: string) => Promise<void> }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      aria-label="Supprimer"
      onClick={() => {
        if (!confirm('Confirmer la suppression ? Cette action est irréversible.')) return
        startTransition(() => action(id))
      }}
      className="text-muted-foreground hover:text-destructive disabled:opacity-40"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
