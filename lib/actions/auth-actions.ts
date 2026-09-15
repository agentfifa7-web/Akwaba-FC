'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createSession, destroySession, verifyPassword } from '@/lib/auth'
import type { Role } from '@/lib/constants'

const loginSchema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
  next: z.string().optional(),
})

export type LoginState = { error?: string }

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    next: formData.get('next'),
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Formulaire invalide' }

  const { email, password, next } = parsed.data
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  if (!user || !user.active) return { error: 'Identifiants incorrects' }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) return { error: 'Identifiants incorrects' }

  await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role as Role })

  redirect(next && next.startsWith('/admin') ? next : '/admin')
}

export async function logoutAction() {
  await destroySession()
  redirect('/admin/login')
}
