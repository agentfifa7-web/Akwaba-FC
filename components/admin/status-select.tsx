'use client'

import { useTransition } from 'react'

export function StatusSelect({
  id,
  status,
  options,
  action,
}: {
  id: string
  status: string
  options: { value: string; label: string }[]
  action: (id: string, status: string) => Promise<void>
}) {
  const [pending, startTransition] = useTransition()

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => startTransition(() => action(id, e.target.value))}
      className="min-h-9 border border-border bg-background px-2 text-xs"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
