// Utilitaires de session compatibles Edge Runtime (aucune dépendance Node
// comme bcrypt ou Prisma) — importés par middleware.ts pour protéger /admin.
// lib/auth.ts (Node runtime) s'appuie dessus et y ajoute bcrypt + Prisma.
import { SignJWT, jwtVerify } from 'jose'
import type { Role } from '@/lib/constants'

export const SESSION_COOKIE_NAME = 'akwaba_session'
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 jours

export type SessionPayload = {
  userId: string
  email: string
  name: string
  role: Role
}

function secretKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET manquant dans les variables d’environnement')
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey())
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey())
    if (!payload.userId || !payload.email || !payload.role) return null
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
