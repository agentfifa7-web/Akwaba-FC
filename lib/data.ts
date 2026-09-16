import 'server-only'
import { prisma } from '@/lib/prisma'
import type { TeamSlug } from '@/lib/constants'

export function getTeams() {
  return prisma.team.findMany({ orderBy: { createdAt: 'asc' } })
}

export function getTeamBySlug(slug: TeamSlug) {
  return prisma.team.findUnique({ where: { slug } })
}

export async function getSquad(slug: TeamSlug) {
  const team = await prisma.team.findUnique({ where: { slug } })
  if (!team) return { team: null, players: [] }
  const players = await prisma.player.findMany({
    where: { teamId: team.id, active: true },
    orderBy: { number: 'asc' },
  })
  return { team, players }
}

export function getPlayerBySlug(slug: string) {
  return prisma.player.findUnique({
    where: { slug },
    include: {
      team: true,
      careerSteps: { orderBy: { order: 'asc' } },
      media: { orderBy: { order: 'asc' } },
    },
  })
}

// Statistiques d'un joueur ventilées par compétition, plus un total
// "toutes compétitions" — calculées à la volée depuis la feuille de match
// (MatchAppearance), donc toujours à jour sans étape de synchronisation.
export async function getPlayerCompetitionStats(playerId: string) {
  const appearances = await prisma.matchAppearance.findMany({
    where: { playerId },
    include: { match: { include: { competition: true } } },
  })

  type Row = {
    competition: { id: string; name: string; season: string }
    appearances: number
    goals: number
    assists: number
    minutes: number
    yellowCards: number
    redCards: number
  }

  const byCompetition = new Map<string, Row>()
  for (const a of appearances) {
    const key = a.match.competitionId
    const row =
      byCompetition.get(key) ??
      ({ competition: a.match.competition, appearances: 0, goals: 0, assists: 0, minutes: 0, yellowCards: 0, redCards: 0 } satisfies Row)
    row.appearances += 1
    row.goals += a.goals
    row.assists += a.assists
    row.minutes += a.minutesPlayed
    row.yellowCards += a.yellowCards
    row.redCards += a.redCards
    byCompetition.set(key, row)
  }

  const rows = Array.from(byCompetition.values()).sort((a, b) => b.appearances - a.appearances)
  const global = rows.reduce(
    (acc, r) => ({
      appearances: acc.appearances + r.appearances,
      goals: acc.goals + r.goals,
      assists: acc.assists + r.assists,
      minutes: acc.minutes + r.minutes,
      yellowCards: acc.yellowCards + r.yellowCards,
      redCards: acc.redCards + r.redCards,
    }),
    { appearances: 0, goals: 0, assists: 0, minutes: 0, yellowCards: 0, redCards: 0 },
  )

  return { rows, global }
}

// Courbe de progression (matchs + entraînements), triée chronologiquement.
export function getPlayerProgress(playerId: string) {
  return prisma.playerProgressEntry.findMany({
    where: { playerId },
    orderBy: { date: 'asc' },
    include: { match: { select: { opponent: true } } },
  })
}

export function getStaff(department?: string) {
  return prisma.staffMember.findMany({
    where: department ? { department } : undefined,
    orderBy: [{ department: 'asc' }, { order: 'asc' }],
    include: { team: true },
  })
}

export function getStaffBySlug(slug: string) {
  return prisma.staffMember.findUnique({ where: { slug }, include: { team: true } })
}

export async function getNextMatch(teamSlug?: TeamSlug) {
  const team = teamSlug ? await prisma.team.findUnique({ where: { slug: teamSlug } }) : null
  return prisma.match.findFirst({
    where: {
      teamId: team?.id,
      status: { in: ['SCHEDULED', 'LIVE'] },
    },
    orderBy: { date: 'asc' },
    include: { team: true, competition: true, events: { orderBy: { order: 'asc' } }, ticketOffers: true },
  })
}

export function getLiveMatch() {
  return prisma.match.findFirst({
    where: { status: 'LIVE' },
    include: { team: true, competition: true, events: { orderBy: { order: 'asc' } } },
  })
}

export async function getResults(teamSlug?: TeamSlug, take = 6) {
  const team = teamSlug ? await prisma.team.findUnique({ where: { slug: teamSlug } }) : null
  return prisma.match.findMany({
    where: { teamId: team?.id, status: 'FINISHED' },
    orderBy: { date: 'desc' },
    take,
    include: { team: true, competition: true },
  })
}

export async function getUpcoming(teamSlug?: TeamSlug, take = 6) {
  const team = teamSlug ? await prisma.team.findUnique({ where: { slug: teamSlug } }) : null
  return prisma.match.findMany({
    where: { teamId: team?.id, status: { in: ['SCHEDULED', 'LIVE'] } },
    orderBy: { date: 'asc' },
    take,
    include: { team: true, competition: true },
  })
}

export function getMatchById(id: string) {
  return prisma.match.findUnique({
    where: { id },
    include: { team: true, competition: true, events: { orderBy: { order: 'asc' } }, ticketOffers: true },
  })
}

export async function getStandings(category: TeamSlug) {
  const entries = await prisma.standingEntry.findMany({
    where: { category },
    orderBy: { position: 'asc' },
    include: { competition: true },
  })
  const byCompetition = new Map<string, typeof entries>()
  for (const entry of entries) {
    const list = byCompetition.get(entry.competitionId) ?? []
    list.push(entry)
    byCompetition.set(entry.competitionId, list)
  }
  return Array.from(byCompetition.values()).map((rows) => ({ competition: rows[0].competition, rows }))
}

export function getNews(options: { category?: string; teamSlug?: TeamSlug; take?: number; skip?: number } = {}) {
  return prisma.newsArticle.findMany({
    where: { category: options.category, team: options.teamSlug ? { slug: options.teamSlug } : undefined },
    orderBy: { publishedAt: 'desc' },
    take: options.take,
    skip: options.skip,
    include: { team: true },
  })
}

export function countNews(category?: string) {
  return prisma.newsArticle.count({ where: { category } })
}

export function getFeaturedNews(take = 3) {
  return prisma.newsArticle.findMany({ where: { featured: true }, orderBy: { publishedAt: 'desc' }, take })
}

export function getNewsBySlug(slug: string) {
  return prisma.newsArticle.findUnique({ where: { slug }, include: { team: true } })
}

export function getRelatedNews(category: string, excludeSlug: string, take = 3) {
  return prisma.newsArticle.findMany({
    where: { category, slug: { not: excludeSlug } },
    orderBy: { publishedAt: 'desc' },
    take,
  })
}

export function getVideos(options: { category?: string; take?: number } = {}) {
  return prisma.video.findMany({ where: { category: options.category }, orderBy: { publishedAt: 'desc' }, take: options.take })
}

export function getLiveVideo() {
  return prisma.video.findFirst({ where: { isLive: true }, orderBy: { publishedAt: 'desc' } })
}

export function getVideoBySlug(slug: string) {
  return prisma.video.findUnique({ where: { slug } })
}

export function getGallery(category?: string) {
  return prisma.galleryImage.findMany({ where: { category }, orderBy: { publishedAt: 'desc' } })
}

export function getPartners() {
  return prisma.partner.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }] })
}

export function getPartnerBySlug(slug: string) {
  return prisma.partner.findUnique({ where: { slug } })
}

export function getShopProducts(category?: string) {
  return prisma.shopProduct.findMany({ where: { category }, orderBy: { name: 'asc' } })
}

export function getShopProductBySlug(slug: string) {
  return prisma.shopProduct.findUnique({ where: { slug } })
}

export function getTicketOffersForMatch(matchId: string) {
  return prisma.ticketOffer.findMany({ where: { matchId }, orderBy: { price: 'asc' } })
}

export function getUpcomingTicketMatches() {
  return prisma.match.findMany({
    where: { status: 'SCHEDULED', ticketOffers: { some: {} } },
    orderBy: { date: 'asc' },
    include: { team: true, competition: true, ticketOffers: true },
  })
}

export async function getClubStandingRow(category: TeamSlug) {
  return prisma.standingEntry.findFirst({ where: { category, isClub: true }, include: { competition: true } })
}

export function getHonours() {
  return prisma.honourTitle.findMany({ orderBy: { order: 'asc' } })
}

export function getCmsPage(slug: string) {
  return prisma.cmsPage.findUnique({ where: { slug } })
}

export function getPressItems(type?: string) {
  return prisma.pressItem.findMany({ where: { type }, orderBy: { publishedAt: 'desc' } })
}

export function getPressContacts() {
  return prisma.pressContact.findMany()
}

export function getMediaEvents() {
  return prisma.mediaEvent.findMany({ orderBy: { date: 'asc' }, where: { date: { gte: new Date() } } })
}

export function getSupporterGroups() {
  return prisma.supporterGroup.findMany()
}

export function getSupporterEvents() {
  return prisma.supporterEvent.findMany({ orderBy: { date: 'asc' }, where: { date: { gte: new Date() } } })
}

export function getNotifications(take = 12) {
  return prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take })
}

export async function recordPageView(path: string) {
  try {
    await prisma.pageView.create({ data: { path } })
  } catch {
    // best-effort — ne bloque jamais le rendu de la page
  }
}
