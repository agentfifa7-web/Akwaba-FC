'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

type NotificationItem = {
  id: string
  icon: string
  title: string
  body: string
  url: string | null
  createdAt: string
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  async function handleOpen() {
    const next = !open
    setOpen(next)
    if (next && !loaded) {
      try {
        const res = await fetch('/api/notifications')
        if (res.ok) setItems(await res.json())
      } finally {
        setLoaded(true)
      }
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center text-white/80 transition-colors hover:text-accent"
      >
        <Bell className="h-[18px] w-[18px]" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-80 max-w-[90vw] border-t-2 border-accent bg-primary text-white shadow-2xl">
          <p className="border-b border-white/10 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            Notifications
          </p>
          <div className="max-h-96 overflow-y-auto">
            {!loaded && <p className="px-4 py-6 text-center text-xs text-white/50">Chargement…</p>}
            {loaded && items.length === 0 && (
              <p className="px-4 py-6 text-center text-xs text-white/50">Aucune notification pour le moment.</p>
            )}
            {items.map((item) => (
              <div key={item.id} className={cn('flex gap-3 border-b border-white/10 px-4 py-3 last:border-b-0')}>
                <span className="text-lg leading-none">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-white/60">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
