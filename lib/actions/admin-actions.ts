'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireRole, hashPassword } from '@/lib/auth'
import { avatar } from '@/lib/images'
import {
  NEWS_CATEGORIES,
  VIDEO_CATEGORIES,
  GALLERY_CATEGORIES,
  PARTNER_CATEGORIES,
  SHOP_CATEGORIES,
  TICKET_TIERS,
  PRESS_ITEM_TYPES,
  POSITIONS,
  STAFF_DEPARTMENTS,
  TEAM_SLUGS,
  MATCH_STATUSES,
  MATCH_EVENT_TYPES,
  APPLICATION_STATUSES,
  ORDER_STATUSES,
  ROLES,
  PLAYER_MEDIA_TYPES,
} from '@/lib/constants'

export type ActionState = { error?: string; success?: string }

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function str(formData: FormData, key: string) {
  const v = formData.get(key)
  return typeof v === 'string' ? v : ''
}

function optStr(formData: FormData, key: string) {
  const v = str(formData, key).trim()
  return v.length > 0 ? v : undefined
}

// ---------------------------------------------------------------------------
// Actualités
// ---------------------------------------------------------------------------

const newsSchema = z.object({
  title: z.string().min(2),
  excerpt: z.string().min(2),
  category: z.enum(NEWS_CATEGORIES),
  coverImage: z.string().url(),
  author: z.string().min(1),
  body: z.string().min(2),
  quote: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean(),
  teamSlug: z.string().optional(),
})

async function newsFromForm(formData: FormData) {
  return newsSchema.parse({
    title: str(formData, 'title'),
    excerpt: str(formData, 'excerpt'),
    category: str(formData, 'category'),
    coverImage: str(formData, 'coverImage'),
    author: str(formData, 'author'),
    body: str(formData, 'body'),
    quote: optStr(formData, 'quote'),
    tags: optStr(formData, 'tags'),
    featured: formData.get('featured') === 'on',
    teamSlug: optStr(formData, 'teamSlug'),
  })
}

export async function createNewsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MEDIA_MANAGER')
  let data
  try {
    data = await newsFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  const team = data.teamSlug ? await prisma.team.findUnique({ where: { slug: data.teamSlug } }) : null
  const blocks = [{ type: 'text', text: data.body }, ...(data.quote ? [{ type: 'quote', text: data.quote }] : [])]
  await prisma.newsArticle.create({
    data: {
      slug: `${slugify(data.title)}-${Date.now().toString(36)}`,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      coverImage: data.coverImage,
      author: data.author,
      featured: data.featured,
      blocks,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      teamId: team?.id,
    },
  })
  revalidatePath('/admin/news')
  revalidatePath('/news')
  redirect('/admin/news')
}

export async function updateNewsAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MEDIA_MANAGER')
  let data
  try {
    data = await newsFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  const team = data.teamSlug ? await prisma.team.findUnique({ where: { slug: data.teamSlug } }) : null
  const blocks = [{ type: 'text', text: data.body }, ...(data.quote ? [{ type: 'quote', text: data.quote }] : [])]
  await prisma.newsArticle.update({
    where: { id },
    data: {
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      coverImage: data.coverImage,
      author: data.author,
      featured: data.featured,
      blocks,
      tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      teamId: team?.id ?? null,
    },
  })
  revalidatePath('/admin/news')
  revalidatePath('/news')
  redirect('/admin/news')
}

export async function deleteNewsAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MEDIA_MANAGER')
  await prisma.newsArticle.delete({ where: { id } })
  revalidatePath('/admin/news')
  revalidatePath('/news')
}

// ---------------------------------------------------------------------------
// Joueurs
// ---------------------------------------------------------------------------

const playerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  number: z.coerce.number().int().min(0).max(99),
  position: z.enum(POSITIONS),
  birthDate: z.string().min(1),
  nationality: z.string().min(1),
  height: z.coerce.number().optional(),
  preferredFoot: z.string().optional(),
  photoUrl: z.string().optional(),
  highlightVideoUrl: z.string().optional(),
  bio: z.string().optional(),
  captain: z.boolean(),
  active: z.boolean(),
  teamSlug: z.enum(TEAM_SLUGS),
  appearances: z.coerce.number().default(0),
  goals: z.coerce.number().default(0),
  assists: z.coerce.number().default(0),
  minutes: z.coerce.number().default(0),
  yellowCards: z.coerce.number().default(0),
  redCards: z.coerce.number().default(0),
  pace: z.coerce.number().min(0).max(100).default(60),
  shooting: z.coerce.number().min(0).max(100).default(60),
  passing: z.coerce.number().min(0).max(100).default(60),
  dribbling: z.coerce.number().min(0).max(100).default(60),
  defending: z.coerce.number().min(0).max(100).default(60),
  physical: z.coerce.number().min(0).max(100).default(60),
})

async function playerFromForm(formData: FormData) {
  return playerSchema.parse({
    firstName: str(formData, 'firstName'),
    lastName: str(formData, 'lastName'),
    number: str(formData, 'number'),
    position: str(formData, 'position'),
    birthDate: str(formData, 'birthDate'),
    nationality: str(formData, 'nationality'),
    height: optStr(formData, 'height'),
    preferredFoot: optStr(formData, 'preferredFoot'),
    photoUrl: optStr(formData, 'photoUrl'),
    highlightVideoUrl: optStr(formData, 'highlightVideoUrl'),
    bio: optStr(formData, 'bio'),
    captain: formData.get('captain') === 'on',
    active: formData.get('active') === 'on',
    teamSlug: str(formData, 'teamSlug'),
    appearances: str(formData, 'appearances') || '0',
    goals: str(formData, 'goals') || '0',
    assists: str(formData, 'assists') || '0',
    minutes: str(formData, 'minutes') || '0',
    yellowCards: str(formData, 'yellowCards') || '0',
    redCards: str(formData, 'redCards') || '0',
    pace: str(formData, 'pace') || '60',
    shooting: str(formData, 'shooting') || '60',
    passing: str(formData, 'passing') || '60',
    dribbling: str(formData, 'dribbling') || '60',
    defending: str(formData, 'defending') || '60',
    physical: str(formData, 'physical') || '60',
  })
}

export async function createPlayerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  let data
  try {
    data = await playerFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  const team = await prisma.team.findUnique({ where: { slug: data.teamSlug } })
  if (!team) return { error: 'Équipe introuvable' }
  const { teamSlug, photoUrl, pace, shooting, passing, dribbling, defending, physical, ...rest } = data
  await prisma.player.create({
    data: {
      ...rest,
      photoUrl: photoUrl || avatar(`${data.firstName} ${data.lastName}`),
      attributes: { pace, shooting, passing, dribbling, defending, physical },
      birthDate: new Date(data.birthDate),
      slug: `${slugify(`${data.firstName}-${data.lastName}`)}-${data.number}-${Date.now().toString(36)}`,
      teamId: team.id,
    },
  })
  revalidatePath('/admin/players')
  revalidatePath(`/teams/${teamSlug}`)
  redirect('/admin/players')
}

export async function updatePlayerAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  let data
  try {
    data = await playerFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  const team = await prisma.team.findUnique({ where: { slug: data.teamSlug } })
  if (!team) return { error: 'Équipe introuvable' }
  const { teamSlug, photoUrl, pace, shooting, passing, dribbling, defending, physical, ...rest } = data
  await prisma.player.update({
    where: { id },
    data: {
      ...rest,
      photoUrl: photoUrl || undefined,
      attributes: { pace, shooting, passing, dribbling, defending, physical },
      birthDate: new Date(data.birthDate),
      teamId: team.id,
    },
  })
  revalidatePath('/admin/players')
  revalidatePath(`/teams/${teamSlug}`)
  redirect('/admin/players')
}

// ---------------------------------------------------------------------------
// Fiche joueur — médias (photos/vidéos) et progression
// ---------------------------------------------------------------------------

const playerMediaSchema = z.object({
  type: z.enum(PLAYER_MEDIA_TYPES),
  url: z.string().min(1),
  caption: z.string().optional(),
})

export async function addPlayerMediaAction(playerId: string, formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER', 'MEDIA_MANAGER')
  let data
  try {
    data = playerMediaSchema.parse({
      type: str(formData, 'type'),
      url: str(formData, 'url'),
      caption: optStr(formData, 'caption'),
    })
  } catch {
    return
  }
  const count = await prisma.playerMedia.count({ where: { playerId } })
  await prisma.playerMedia.create({ data: { ...data, playerId, order: count } })
  revalidatePath(`/admin/players/${playerId}`)
}

export async function deletePlayerMediaAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER', 'MEDIA_MANAGER')
  const media = await prisma.playerMedia.delete({ where: { id } })
  revalidatePath(`/admin/players/${media.playerId}`)
}

const playerProgressSchema = z.object({
  date: z.string().min(1),
  rating: z.coerce.number().min(0).max(10),
  note: z.string().optional(),
})

export async function addPlayerProgressAction(playerId: string, formData: FormData) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  let data
  try {
    data = playerProgressSchema.parse({
      date: str(formData, 'date'),
      rating: str(formData, 'rating'),
      note: optStr(formData, 'note'),
    })
  } catch {
    return
  }
  await prisma.playerProgressEntry.create({
    data: { playerId, type: 'TRAINING', date: new Date(data.date), rating: data.rating, note: data.note },
  })
  revalidatePath(`/admin/players/${playerId}`)
}

export async function deletePlayerProgressAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  const entry = await prisma.playerProgressEntry.delete({ where: { id } })
  revalidatePath(`/admin/players/${entry.playerId}`)
}

export async function deletePlayerAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  await prisma.player.delete({ where: { id } })
  revalidatePath('/admin/players')
}

// ---------------------------------------------------------------------------
// Équipes (édition uniquement — les 4 catégories sont fixes)
// ---------------------------------------------------------------------------

const teamSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  tagline: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
})

export async function updateTeamAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  const parsed = teamSchema.safeParse({
    name: str(formData, 'name'),
    shortName: str(formData, 'shortName'),
    tagline: optStr(formData, 'tagline'),
    description: optStr(formData, 'description'),
    coverImage: optStr(formData, 'coverImage'),
  })
  if (!parsed.success) return { error: 'Merci de vérifier les champs du formulaire.' }
  await prisma.team.update({ where: { id }, data: parsed.data })
  revalidatePath('/admin/teams')
  revalidatePath('/teams')
  redirect('/admin/teams')
}

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

const staffSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  department: z.enum(STAFF_DEPARTMENTS),
  photoUrl: z.string().optional(),
  bio: z.string().optional(),
  teamSlug: z.string().optional(),
})

async function staffFromForm(formData: FormData) {
  return staffSchema.parse({
    name: str(formData, 'name'),
    role: str(formData, 'role'),
    department: str(formData, 'department'),
    photoUrl: optStr(formData, 'photoUrl'),
    bio: optStr(formData, 'bio'),
    teamSlug: optStr(formData, 'teamSlug'),
  })
}

export async function createStaffAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  let data
  try {
    data = await staffFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  const team = data.teamSlug ? await prisma.team.findUnique({ where: { slug: data.teamSlug } }) : null
  await prisma.staffMember.create({
    data: {
      name: data.name,
      role: data.role,
      department: data.department,
      bio: data.bio,
      photoUrl: data.photoUrl || avatar(data.name),
      slug: `${slugify(data.name)}-${Date.now().toString(36)}`,
      teamId: team?.id,
    },
  })
  revalidatePath('/admin/staff')
  redirect('/admin/staff')
}

export async function updateStaffAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  let data
  try {
    data = await staffFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  const team = data.teamSlug ? await prisma.team.findUnique({ where: { slug: data.teamSlug } }) : null
  await prisma.staffMember.update({
    where: { id },
    data: { name: data.name, role: data.role, department: data.department, photoUrl: data.photoUrl, bio: data.bio, teamId: team?.id ?? null },
  })
  revalidatePath('/admin/staff')
  redirect('/admin/staff')
}

export async function deleteStaffAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  await prisma.staffMember.delete({ where: { id } })
  revalidatePath('/admin/staff')
}

// ---------------------------------------------------------------------------
// Compétitions
// ---------------------------------------------------------------------------

const competitionSchema = z.object({ name: z.string().min(1), season: z.string().min(1) })

export async function createCompetitionAction(formData: FormData): Promise<void> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  const parsed = competitionSchema.safeParse({ name: str(formData, 'name'), season: str(formData, 'season') })
  if (!parsed.success) return
  await prisma.competition.create({ data: { ...parsed.data, slug: `${slugify(parsed.data.name)}-${Date.now().toString(36)}` } })
  revalidatePath('/admin/matches')
}

export async function deleteCompetitionAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  await prisma.competition.delete({ where: { id } })
  revalidatePath('/admin/matches')
}

// ---------------------------------------------------------------------------
// Matchs
// ---------------------------------------------------------------------------

const matchSchema = z.object({
  teamSlug: z.enum(TEAM_SLUGS),
  competitionId: z.string().min(1),
  opponent: z.string().min(1),
  opponentLogo: z.string().optional(),
  isHome: z.boolean(),
  date: z.string().min(1),
  stadium: z.string().min(1),
  matchday: z.string().optional(),
  status: z.enum(MATCH_STATUSES),
  homeScore: z.coerce.number().optional(),
  awayScore: z.coerce.number().optional(),
})

async function matchFromForm(formData: FormData) {
  return matchSchema.parse({
    teamSlug: str(formData, 'teamSlug'),
    competitionId: str(formData, 'competitionId'),
    opponent: str(formData, 'opponent'),
    opponentLogo: optStr(formData, 'opponentLogo'),
    isHome: formData.get('isHome') === 'on',
    date: str(formData, 'date'),
    stadium: str(formData, 'stadium'),
    matchday: optStr(formData, 'matchday'),
    status: str(formData, 'status'),
    homeScore: optStr(formData, 'homeScore'),
    awayScore: optStr(formData, 'awayScore'),
  })
}

export async function createMatchAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  let data
  try {
    data = await matchFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  const team = await prisma.team.findUnique({ where: { slug: data.teamSlug } })
  if (!team) return { error: 'Équipe introuvable' }
  const { teamSlug, ...rest } = data
  await prisma.match.create({ data: { ...rest, date: new Date(data.date), teamId: team.id } })
  revalidatePath('/admin/matches')
  revalidatePath('/matches')
  redirect('/admin/matches')
}

export async function updateMatchAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  let data
  try {
    data = await matchFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  const team = await prisma.team.findUnique({ where: { slug: data.teamSlug } })
  if (!team) return { error: 'Équipe introuvable' }
  const { teamSlug, ...rest } = data
  await prisma.match.update({ where: { id }, data: { ...rest, date: new Date(data.date), teamId: team.id } })
  revalidatePath('/admin/matches')
  revalidatePath('/matches')
  revalidatePath(`/matches/${id}`)
  redirect('/admin/matches')
}

export async function deleteMatchAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  await prisma.match.delete({ where: { id } })
  revalidatePath('/admin/matches')
}

const matchEventSchema = z.object({
  minute: z.coerce.number().min(0).max(130),
  type: z.enum(MATCH_EVENT_TYPES),
  side: z.enum(['HOME', 'AWAY']),
  player: z.string().min(1),
  detail: z.string().optional(),
})

export async function addMatchEventAction(matchId: string, formData: FormData): Promise<void> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  const parsed = matchEventSchema.safeParse({
    minute: str(formData, 'minute'),
    type: str(formData, 'type'),
    side: str(formData, 'side'),
    player: str(formData, 'player'),
    detail: optStr(formData, 'detail'),
  })
  if (!parsed.success) return
  const count = await prisma.matchEvent.count({ where: { matchId } })
  await prisma.matchEvent.create({ data: { ...parsed.data, matchId, order: count } })
  revalidatePath(`/admin/matches/${matchId}`)
  revalidatePath(`/matches/${matchId}`)
}

export async function deleteMatchEventAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  const event = await prisma.matchEvent.delete({ where: { id } })
  revalidatePath(`/admin/matches/${event.matchId}`)
  revalidatePath(`/matches/${event.matchId}`)
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(n) ? n : min))
}

// Feuille de match : une ligne par joueur de l'effectif. À l'enregistrement,
// on met à jour la table MatchAppearance (source de vérité des stats), on
// génère automatiquement un point de progression "MATCH" par joueur ayant
// joué, puis on recalcule les totaux carrière mis en cache sur Player —
// c'est ce qui rend la mise à jour des statistiques automatique.
export async function saveMatchSheetAction(matchId: string, formData: FormData): Promise<void> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  const match = await prisma.match.findUnique({ where: { id: matchId }, include: { team: true } })
  if (!match) return
  const squad = await prisma.player.findMany({ where: { teamId: match.teamId } })

  for (const player of squad) {
    const selected = formData.get(`selected_${player.id}`) === 'on'
    if (!selected) {
      await prisma.matchAppearance.deleteMany({ where: { matchId, playerId: player.id } })
      await prisma.playerProgressEntry.deleteMany({ where: { matchId, playerId: player.id } })
      continue
    }
    const started = formData.get(`started_${player.id}`) === 'on'
    const minutesPlayed = clamp(Number(formData.get(`minutes_${player.id}`)), 0, 120)
    const goals = clamp(Number(formData.get(`goals_${player.id}`)), 0, 20)
    const assists = clamp(Number(formData.get(`assists_${player.id}`)), 0, 20)
    const yellowCards = clamp(Number(formData.get(`yellow_${player.id}`)), 0, 2)
    const redCards = clamp(Number(formData.get(`red_${player.id}`)), 0, 1)

    await prisma.matchAppearance.upsert({
      where: { matchId_playerId: { matchId, playerId: player.id } },
      create: { matchId, playerId: player.id, started, minutesPlayed, goals, assists, yellowCards, redCards },
      update: { started, minutesPlayed, goals, assists, yellowCards, redCards },
    })

    const rating = clamp(6 + goals * 1 + assists * 0.5 - redCards * 2 - yellowCards * 0.5 + (minutesPlayed >= 60 ? 0.3 : 0), 0, 10)
    await prisma.playerProgressEntry.upsert({
      where: { playerId_matchId: { playerId: player.id, matchId } },
      create: { playerId: player.id, matchId, type: 'MATCH', date: match.date, rating },
      update: { type: 'MATCH', date: match.date, rating },
    })
  }

  for (const player of squad) {
    const agg = await prisma.matchAppearance.aggregate({
      where: { playerId: player.id },
      _sum: { minutesPlayed: true, goals: true, assists: true, yellowCards: true, redCards: true },
      _count: { id: true },
    })
    await prisma.player.update({
      where: { id: player.id },
      data: {
        appearances: agg._count.id,
        goals: agg._sum.goals ?? 0,
        assists: agg._sum.assists ?? 0,
        minutes: agg._sum.minutesPlayed ?? 0,
        yellowCards: agg._sum.yellowCards ?? 0,
        redCards: agg._sum.redCards ?? 0,
      },
    })
  }

  revalidatePath(`/admin/matches/${matchId}`)
  revalidatePath(`/matches/${matchId}`)
  revalidatePath(`/teams/${match.team.slug}`)
}

// ---------------------------------------------------------------------------
// Classements
// ---------------------------------------------------------------------------

const standingSchema = z.object({
  competitionId: z.string().min(1),
  category: z.enum(TEAM_SLUGS),
  club: z.string().min(1),
  isClub: z.boolean(),
  position: z.coerce.number().min(1),
  played: z.coerce.number().default(0),
  won: z.coerce.number().default(0),
  drawn: z.coerce.number().default(0),
  lost: z.coerce.number().default(0),
  goalsFor: z.coerce.number().default(0),
  goalsAgainst: z.coerce.number().default(0),
  points: z.coerce.number().default(0),
})

async function standingFromForm(formData: FormData) {
  return standingSchema.parse({
    competitionId: str(formData, 'competitionId'),
    category: str(formData, 'category'),
    club: str(formData, 'club'),
    isClub: formData.get('isClub') === 'on',
    position: str(formData, 'position'),
    played: str(formData, 'played') || '0',
    won: str(formData, 'won') || '0',
    drawn: str(formData, 'drawn') || '0',
    lost: str(formData, 'lost') || '0',
    goalsFor: str(formData, 'goalsFor') || '0',
    goalsAgainst: str(formData, 'goalsAgainst') || '0',
    points: str(formData, 'points') || '0',
  })
}

export async function createStandingAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  let data
  try {
    data = await standingFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  await prisma.standingEntry.create({ data })
  revalidatePath('/admin/standings')
  revalidatePath('/standings')
  redirect('/admin/standings')
}

export async function updateStandingAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  let data
  try {
    data = await standingFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  await prisma.standingEntry.update({ where: { id }, data })
  revalidatePath('/admin/standings')
  revalidatePath('/standings')
  redirect('/admin/standings')
}

export async function deleteStandingAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'SPORT_MANAGER')
  await prisma.standingEntry.delete({ where: { id } })
  revalidatePath('/admin/standings')
  revalidatePath('/standings')
}

// ---------------------------------------------------------------------------
// Vidéos
// ---------------------------------------------------------------------------

const videoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(VIDEO_CATEGORIES),
  thumbnailUrl: z.string().url(),
  videoUrl: z.string().url(),
  durationSeconds: z.coerce.number().default(0),
  isLive: z.boolean(),
})

async function videoFromForm(formData: FormData) {
  return videoSchema.parse({
    title: str(formData, 'title'),
    description: optStr(formData, 'description'),
    category: str(formData, 'category'),
    thumbnailUrl: str(formData, 'thumbnailUrl'),
    videoUrl: str(formData, 'videoUrl'),
    durationSeconds: str(formData, 'durationSeconds') || '0',
    isLive: formData.get('isLive') === 'on',
  })
}

export async function createVideoAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR')
  let data
  try {
    data = await videoFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  await prisma.video.create({ data: { ...data, slug: `${slugify(data.title)}-${Date.now().toString(36)}` } })
  revalidatePath('/admin/videos')
  revalidatePath('/club-tv')
  redirect('/admin/videos')
}

export async function updateVideoAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR')
  let data
  try {
    data = await videoFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  await prisma.video.update({ where: { id }, data })
  revalidatePath('/admin/videos')
  revalidatePath('/club-tv')
  redirect('/admin/videos')
}

export async function deleteVideoAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR')
  await prisma.video.delete({ where: { id } })
  revalidatePath('/admin/videos')
  revalidatePath('/club-tv')
}

// ---------------------------------------------------------------------------
// Galerie
// ---------------------------------------------------------------------------

const galleryImageSchema = z.object({ url: z.string().url(), caption: z.string().optional(), category: z.enum(GALLERY_CATEGORIES) })

export async function createGalleryImageAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR')
  const parsed = galleryImageSchema.safeParse({ url: str(formData, 'url'), caption: optStr(formData, 'caption'), category: str(formData, 'category') })
  if (!parsed.success) return { error: 'Merci de vérifier les champs du formulaire.' }
  await prisma.galleryImage.create({ data: parsed.data })
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
  redirect('/admin/gallery')
}

export async function deleteGalleryImageAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR')
  await prisma.galleryImage.delete({ where: { id } })
  revalidatePath('/admin/gallery')
  revalidatePath('/gallery')
}

// ---------------------------------------------------------------------------
// Partenaires
// ---------------------------------------------------------------------------

const partnerSchema = z.object({
  name: z.string().min(1),
  category: z.enum(PARTNER_CATEGORIES),
  logoUrl: z.string().url(),
  description: z.string().optional(),
  websiteUrl: z.string().optional(),
})

async function partnerFromForm(formData: FormData) {
  return partnerSchema.parse({
    name: str(formData, 'name'),
    category: str(formData, 'category'),
    logoUrl: str(formData, 'logoUrl'),
    description: optStr(formData, 'description'),
    websiteUrl: optStr(formData, 'websiteUrl'),
  })
}

export async function createPartnerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  let data
  try {
    data = await partnerFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  await prisma.partner.create({ data: { ...data, slug: `${slugify(data.name)}-${Date.now().toString(36)}` } })
  revalidatePath('/admin/partners')
  revalidatePath('/partners')
  redirect('/admin/partners')
}

export async function updatePartnerAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  let data
  try {
    data = await partnerFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  await prisma.partner.update({ where: { id }, data })
  revalidatePath('/admin/partners')
  revalidatePath('/partners')
  redirect('/admin/partners')
}

export async function deletePartnerAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  await prisma.partner.delete({ where: { id } })
  revalidatePath('/admin/partners')
  revalidatePath('/partners')
}

// ---------------------------------------------------------------------------
// Boutique
// ---------------------------------------------------------------------------

const shopProductSchema = z.object({
  name: z.string().min(1),
  category: z.enum(SHOP_CATEGORIES),
  price: z.coerce.number().min(0),
  imageUrl: z.string().url(),
  description: z.string().optional(),
  sizes: z.string().optional(),
  inStock: z.boolean(),
})

async function shopProductFromForm(formData: FormData) {
  return shopProductSchema.parse({
    name: str(formData, 'name'),
    category: str(formData, 'category'),
    price: str(formData, 'price'),
    imageUrl: str(formData, 'imageUrl'),
    description: optStr(formData, 'description'),
    sizes: optStr(formData, 'sizes'),
    inStock: formData.get('inStock') === 'on',
  })
}

export async function createShopProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  let data
  try {
    data = await shopProductFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  const sizes = data.sizes ? data.sizes.split(',').map((s) => s.trim()).filter(Boolean) : ['Unique']
  await prisma.shopProduct.create({ data: { ...data, sizes, slug: `${slugify(data.name)}-${Date.now().toString(36)}` } })
  revalidatePath('/admin/shop')
  revalidatePath('/shop')
  redirect('/admin/shop')
}

export async function updateShopProductAction(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  let data
  try {
    data = await shopProductFromForm(formData)
  } catch {
    return { error: 'Merci de vérifier les champs du formulaire.' }
  }
  const sizes = data.sizes ? data.sizes.split(',').map((s) => s.trim()).filter(Boolean) : ['Unique']
  await prisma.shopProduct.update({ where: { id }, data: { ...data, sizes } })
  revalidatePath('/admin/shop')
  revalidatePath('/shop')
  redirect('/admin/shop')
}

export async function deleteShopProductAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  await prisma.shopProduct.delete({ where: { id } })
  revalidatePath('/admin/shop')
  revalidatePath('/shop')
}

export async function updateShopOrderStatusAction(id: string, status: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  if (!ORDER_STATUSES.includes(status as never)) return
  await prisma.shopOrder.update({ where: { id }, data: { status } })
  revalidatePath('/admin/shop')
}

// ---------------------------------------------------------------------------
// Billetterie
// ---------------------------------------------------------------------------

const ticketOfferSchema = z.object({
  matchId: z.string().min(1),
  tier: z.enum(TICKET_TIERS),
  price: z.coerce.number().min(0),
  capacity: z.coerce.number().min(0),
})

export async function createTicketOfferAction(formData: FormData): Promise<void> {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  const parsed = ticketOfferSchema.safeParse({
    matchId: str(formData, 'matchId'),
    tier: str(formData, 'tier'),
    price: str(formData, 'price'),
    capacity: str(formData, 'capacity'),
  })
  if (!parsed.success) return
  await prisma.ticketOffer.create({ data: { ...parsed.data, remaining: parsed.data.capacity } })
  revalidatePath('/admin/tickets')
  revalidatePath('/tickets')
}

export async function deleteTicketOfferAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  await prisma.ticketOffer.delete({ where: { id } })
  revalidatePath('/admin/tickets')
  revalidatePath('/tickets')
}

export async function updateTicketOrderStatusAction(id: string, status: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  if (!ORDER_STATUSES.includes(status as never)) return
  await prisma.ticketOrder.update({ where: { id }, data: { status } })
  revalidatePath('/admin/tickets')
}

// ---------------------------------------------------------------------------
// Espace presse
// ---------------------------------------------------------------------------

const pressItemSchema = z.object({
  type: z.enum(PRESS_ITEM_TYPES),
  title: z.string().min(1),
  description: z.string().optional(),
  fileUrl: z.string().optional(),
})

export async function createPressItemAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER')
  const parsed = pressItemSchema.safeParse({
    type: str(formData, 'type'),
    title: str(formData, 'title'),
    description: optStr(formData, 'description'),
    fileUrl: optStr(formData, 'fileUrl'),
  })
  if (!parsed.success) return { error: 'Merci de vérifier les champs du formulaire.' }
  await prisma.pressItem.create({ data: parsed.data })
  revalidatePath('/admin/press')
  revalidatePath('/media')
  redirect('/admin/press')
}

export async function deletePressItemAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER')
  await prisma.pressItem.delete({ where: { id } })
  revalidatePath('/admin/press')
  revalidatePath('/media')
}

// ---------------------------------------------------------------------------
// Pages CMS (édition uniquement)
// ---------------------------------------------------------------------------

const cmsPageSchema = z.object({ title: z.string().min(1), subtitle: z.string().optional(), body: z.string().min(1) })

export async function updateCmsPageAction(slug: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'EDITOR')
  const parsed = cmsPageSchema.safeParse({ title: str(formData, 'title'), subtitle: optStr(formData, 'subtitle'), body: str(formData, 'body') })
  if (!parsed.success) return { error: 'Merci de vérifier les champs du formulaire.' }
  const existing = await prisma.cmsPage.findUnique({ where: { slug } })
  const existingBlocks = Array.isArray(existing?.blocks) ? (existing.blocks as { type: string }[]) : []
  const nonParagraphBlocks = existingBlocks.filter((b) => b.type !== 'paragraph')
  const paragraphs = parsed.data.body.split(/\n{2,}/).filter(Boolean).map((text) => ({ type: 'paragraph', text: text.trim() }))
  await prisma.cmsPage.update({ where: { slug }, data: { title: parsed.data.title, subtitle: parsed.data.subtitle, blocks: [...paragraphs, ...nonParagraphBlocks] } })
  revalidatePath('/admin/pages')
  revalidatePath(`/club/${slug}`)
  redirect('/admin/pages')
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

const notificationSchema = z.object({ icon: z.string().min(1), title: z.string().min(1), body: z.string().min(1), url: z.string().optional() })

export async function createNotificationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR')
  const parsed = notificationSchema.safeParse({
    icon: str(formData, 'icon') || '🔔',
    title: str(formData, 'title'),
    body: str(formData, 'body'),
    url: optStr(formData, 'url'),
  })
  if (!parsed.success) return { error: 'Merci de vérifier les champs du formulaire.' }
  await prisma.notification.create({ data: parsed.data })
  revalidatePath('/admin/notifications')
  redirect('/admin/notifications')
}

export async function deleteNotificationAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'MEDIA_MANAGER', 'EDITOR')
  await prisma.notification.delete({ where: { id } })
  revalidatePath('/admin/notifications')
}

// ---------------------------------------------------------------------------
// Candidatures
// ---------------------------------------------------------------------------

export async function updateAcademyApplicationStatusAction(id: string, status: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'ACADEMY_MANAGER')
  if (!APPLICATION_STATUSES.includes(status as never)) return
  await prisma.academyApplication.update({ where: { id }, data: { status } })
  revalidatePath('/admin/academy-applications')
}

export async function deleteAcademyApplicationAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN', 'ACADEMY_MANAGER')
  await prisma.academyApplication.delete({ where: { id } })
  revalidatePath('/admin/academy-applications')
}

export async function updateRecruitmentApplicationStatusAction(id: string, status: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  if (!APPLICATION_STATUSES.includes(status as never)) return
  await prisma.recruitmentApplication.update({ where: { id }, data: { status } })
  revalidatePath('/admin/recruitment')
}

export async function deleteRecruitmentApplicationAction(id: string) {
  await requireRole('SUPER_ADMIN', 'ADMIN')
  await prisma.recruitmentApplication.delete({ where: { id } })
  revalidatePath('/admin/recruitment')
}

// ---------------------------------------------------------------------------
// Utilisateurs (Super Admin uniquement)
// ---------------------------------------------------------------------------

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(ROLES),
  password: z.string().min(6).optional(),
})

export async function createUserAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole('SUPER_ADMIN')
  const parsed = userSchema.safeParse({
    name: str(formData, 'name'),
    email: str(formData, 'email'),
    role: str(formData, 'role'),
    password: str(formData, 'password'),
  })
  if (!parsed.success || !parsed.data.password) return { error: 'Merci de vérifier les champs (mot de passe requis, 6 caractères minimum).' }
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } })
  if (existing) return { error: 'Un compte existe déjà avec cette adresse e-mail.' }
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      role: parsed.data.role,
      passwordHash: await hashPassword(parsed.data.password),
    },
  })
  revalidatePath('/admin/users')
  redirect('/admin/users')
}

export async function toggleUserActiveAction(id: string, active: boolean) {
  await requireRole('SUPER_ADMIN')
  await prisma.user.update({ where: { id }, data: { active } })
  revalidatePath('/admin/users')
}

export async function deleteUserAction(id: string) {
  await requireRole('SUPER_ADMIN')
  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/users')
}
