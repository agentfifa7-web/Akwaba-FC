'use client'

import { useActionState } from 'react'
import { subscribeNewsletterAction, type ActionState } from '@/lib/actions/public-actions'

export function NewsletterForm({ className }: { className?: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(subscribeNewsletterAction, {})

  return (
    <form action={formAction} className={className}>
      <label htmlFor="newsletter-email" className="sr-only">
        Votre adresse e-mail
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="votre@email.com"
          className="min-h-14 flex-1 border border-primary/30 bg-white px-4 text-sm text-primary outline-none placeholder:text-primary/50 focus:border-primary"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full min-h-14 bg-primary px-6 text-xs font-bold uppercase tracking-widest text-white transition-transform hover:-translate-y-1 disabled:opacity-60"
        >
          {pending ? 'Envoi…' : "S’inscrire"}
        </button>
      </div>
      {state.success && (
        <p role="status" className="mt-3 text-xs font-bold">
          {state.success}
        </p>
      )}
      {state.error && (
        <p role="alert" className="mt-3 text-xs font-bold text-destructive">
          {state.error}
        </p>
      )}
    </form>
  )
}
