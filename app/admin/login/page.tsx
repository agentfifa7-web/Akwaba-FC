'use client'

import { Suspense, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loginAction, type LoginState } from '@/lib/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input, Label } from '@/components/ui/input'

const initialState: LoginState = {}

function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/admin'

  return (
    <form action={formAction} className="space-y-5 border-t-2 border-accent bg-white/[.03] p-7">
      <input type="hidden" name="next" value={next} />
      <div>
        <Label className="text-white/60">Adresse e-mail</Label>
        <Input type="email" name="email" required autoComplete="email" className="border-white/20 bg-transparent text-white placeholder:text-white/30" placeholder="admin@akwabafc.ci" />
      </div>
      <div>
        <Label className="text-white/60">Mot de passe</Label>
        <Input type="password" name="password" required autoComplete="current-password" className="border-white/20 bg-transparent text-white placeholder:text-white/30" placeholder="••••••••" />
      </div>
      {state.error && (
        <p role="alert" className="border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive-foreground">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="accent" disabled={pending} className="w-full justify-center">
        {pending ? 'Connexion…' : 'Se connecter'}
      </Button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-5 py-16 text-white">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent font-display text-sm font-bold text-accent">
            AFC
          </div>
          <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.25em] text-accent">Back-office</p>
          <h1 className="mt-2 font-display text-3xl font-black uppercase">Administration</h1>
          <p className="mt-2 text-xs text-white/50">Connectez-vous pour gérer la plateforme AKWABA FC.</p>
        </div>

        <Suspense fallback={<div className="h-64 animate-pulse bg-white/5" />}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-[11px] text-white/30">
          Accès réservé au personnel autorisé du club.
        </p>
      </div>
    </main>
  )
}
