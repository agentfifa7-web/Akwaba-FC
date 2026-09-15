'use client'

import { LogOut } from 'lucide-react'
import { logoutAction } from '@/lib/actions/auth-actions'

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className={
          compact
            ? 'flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground'
            : 'flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-destructive'
        }
      >
        <LogOut className="h-3.5 w-3.5" /> Déconnexion
      </button>
    </form>
  )
}
