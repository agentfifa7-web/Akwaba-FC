'use client'

import { useTransition } from 'react'
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from '@/lib/constants'

export function OrderStatusSelect({
  id,
  status,
  action,
}: {
  id: string
  status: string
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
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {ORDER_STATUS_LABELS[s as OrderStatus]}
        </option>
      ))}
    </select>
  )
}
