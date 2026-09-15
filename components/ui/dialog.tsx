'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Dialog({
  open,
  onClose,
  title,
  kicker,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  kicker?: string
  children: React.ReactNode
  className?: string
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/80 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn('relative w-full max-w-md overflow-hidden rounded-[1.75rem] bg-card p-7 text-card-foreground shadow-2xl', className)}
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-accent/40 via-accent to-accent/40" />
            <div className="flex items-start justify-between gap-5">
              <div>
                {kicker && <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent-foreground">{kicker}</p>}
                <h2 className="mt-2 font-display text-3xl font-black uppercase leading-none sm:text-4xl">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
