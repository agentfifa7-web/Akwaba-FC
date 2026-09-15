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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className={cn('w-full max-w-md border-t-2 border-accent bg-card p-7 text-card-foreground shadow-2xl', className)}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                {kicker && <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent-foreground">{kicker}</p>}
                <h2 className="mt-2 font-display text-3xl font-black uppercase leading-none sm:text-4xl">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-2xl leading-none text-muted-foreground hover:text-foreground"
                aria-label="Fermer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
