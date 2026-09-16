import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { avatar, logoAvatar } from '../lib/images'

const prisma = new PrismaClient()

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function img(id: string, width = 1200, quality = 85) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=${quality}`
}
const PHOTOS = {
  teamPitch: '1579952363873-27f3bade9f55',
  clubIdentity: '1526232761682-d26e03ac148e',
  youngTalents: '1517466787929-bc90951d0974',
  training: '1553778263-73a83bab9b0c',
  stadium: '1522778119026-d647f0596c20',
  ballField: '1431324155629-1a6deb1dec8d',
  crowd: '1518091043644-c1d4457512c6',
  closeup: '1552667466-07770ae110d0',
  celebration: '1543326727-cf6c39e8f84c',
  stadiumLights: '1546519638-68e109498ffc',
  sport1: '1489944440615-453fc2b6a9a9',
  sport2: '1550881111-7cfde14b8073',
  sport3: '1614632537197-38a17061c2bd',
  sport4: '1487466365202-1afdb86c764e',
  sport5: '1560272564-c83b66b1ad12',
  sport6: '1607627000458-210e8d2bdb1d',
  sport7: '1600679472829-3044539ce8ed',
  sport8: '1522778034537-20a2486be803',
  sport9: '1454789476662-53eb23ba5907',
  sport10: '1594736797933-d0501ba2fe65',
}
const photoPool = Object.values(PHOTOS)
function poolImg(i: number, width = 1200) {
  return img(photoPool[i % photoPool.length], width)
}
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const MALE_FIRST = ['Yao', 'Kouassi', 'Konan', 'Didier', 'Franck', 'Wilfried', 'Max', 'Ibrahim', 'Mohamed', 'Sekou', 'Emmanuel', 'Patrick', 'Gervais', 'Eric', 'Cyrille', 'Bertin', 'Lassina', 'Serge', 'Aboubakar', 'Christian', 'Junior', 'Armand', 'Fabrice', 'Hervé']
const FEMALE_FIRST = ['Aya', 'Akissi', 'Amenan', 'Adjoua', 'Affoué', 'Ahou', 'Awa', 'Fatou', 'Mariam', 'Aminata', 'Rokia', 'Josiane', 'Christelle', 'Nadège', 'Sandrine', 'Viviane', 'Grace', 'Esther', 'Prisca', 'Adèle']
const SURNAMES = ['Kouassi', 'Kouamé', 'Koffi', 'Kouadio', 'Konan', 'Yao', 'Aka', 'Bamba', 'Traoré', 'Touré', 'Diabaté', 'Ouattara', 'Konaté', 'Coulibaly', 'Diallo', 'Sanogo', 'Doumbia', "N'Guessan", 'Zadi', 'Gnahoré', 'Yapi', 'Djé', 'Assouan', 'Boa', 'Kra', 'Angoua', 'Brou', 'Gogoua', 'Kacou', 'Loba']
const NATIONALITIES = ["Côte d'Ivoire", "Côte d'Ivoire", "Côte d'Ivoire", "Côte d'Ivoire", 'Mali', 'Sénégal', 'Burkina Faso', 'Ghana', 'France', 'Guinée']

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length]
}

type SquadSpec = { teamSlug: 'men' | 'women' | 'reserve' | 'u18'; count: number; femaleNames: boolean; minAge: number; maxAge: number }

// Bornes d'attributs radar (0-100) par poste — utilisées pour générer un
// profil de compétences crédible pour chaque joueur de démonstration.
const ATTRIBUTE_RANGES: Record<'GK' | 'DEF' | 'MID' | 'FWD', Record<string, [number, number]>> = {
  GK: { pace: [42, 58], shooting: [20, 34], passing: [55, 72], dribbling: [35, 50], defending: [70, 88], physical: [66, 82] },
  DEF: { pace: [55, 72], shooting: [30, 46], passing: [60, 76], dribbling: [45, 60], defending: [76, 92], physical: [70, 86] },
  MID: { pace: [60, 76], shooting: [50, 66], passing: [75, 92], dribbling: [66, 82], defending: [55, 72], physical: [64, 80] },
  FWD: { pace: [76, 92], shooting: [76, 92], passing: [55, 70], dribbling: [70, 86], defending: [24, 40], physical: [64, 80] },
}
function attributeValue(range: [number, number], idx: number) {
  const [min, max] = range
  return min + (idx % (max - min + 1))
}
function buildAttributes(position: 'GK' | 'DEF' | 'MID' | 'FWD', idx: number) {
  const ranges = ATTRIBUTE_RANGES[position]
  return Object.fromEntries(Object.entries(ranges).map(([key, range], i) => [key, attributeValue(range, idx * 7 + i * 3)]))
}

function buildSquad(spec: SquadSpec, seedOffset: number) {
  const positions: Array<'GK' | 'DEF' | 'MID' | 'FWD'> = []
  const gk = Math.max(2, Math.round(spec.count * 0.11))
  const def = Math.round(spec.count * 0.32)
  const mid = Math.round(spec.count * 0.32)
  const fwd = spec.count - gk - def - mid
  for (let i = 0; i < gk; i++) positions.push('GK')
  for (let i = 0; i < def; i++) positions.push('DEF')
  for (let i = 0; i < mid; i++) positions.push('MID')
  for (let i = 0; i < fwd; i++) positions.push('FWD')

  const firstPool = spec.femaleNames ? FEMALE_FIRST : MALE_FIRST
  const usedNumbers = new Set<number>()
  const now = Date.now()

  return positions.map((position, i) => {
    const idx = seedOffset + i
    const firstName = pick(firstPool, idx * 3 + 1)
    const lastName = pick(SURNAMES, idx * 5 + 2)
    let number = ((idx * 7) % 29) + 1
    while (usedNumbers.has(number)) number = (number % 29) + 1
    usedNumbers.add(number)
    const age = spec.minAge + (idx % (spec.maxAge - spec.minAge + 1))
    const birthDate = new Date(now - age * 365.25 * 24 * 3600 * 1000 - (idx % 300) * 86400000)
    const nationality = pick(NATIONALITIES, idx * 2 + 1)
    return {
      slug: slugify(`${firstName}-${lastName}-${number}`),
      firstName,
      lastName,
      number,
      position,
      birthDate,
      nationality,
      height: 165 + ((idx * 3) % 30),
      preferredFoot: idx % 3 === 0 ? 'GAUCHE' : idx % 3 === 1 ? 'DROIT' : 'AMBIDEXTRE',
      photoUrl: avatar(`${firstName} ${lastName}`),
      bio: `${firstName} ${lastName} évolue au poste de ${LABEL_POSITION[position]} et incarne l’exigence et la générosité chères à AKWABA FC.`,
      captain: i === gk, // premier gardien capitaine par défaut pour l'exemple
      appearances: 8 + (idx % 20),
      goals: position === 'FWD' ? idx % 14 : position === 'MID' ? idx % 7 : idx % 2,
      assists: position === 'MID' ? idx % 9 : idx % 4,
      minutes: 400 + (idx % 18) * 90,
      yellowCards: idx % 6,
      redCards: idx % 11 === 0 ? 1 : 0,
      attributes: buildAttributes(position, idx),
    }
  })
}
const LABEL_POSITION: Record<string, string> = { GK: 'gardien', DEF: 'défenseur', MID: 'milieu', FWD: 'attaquant' }

async function main() {
  console.log('Nettoyage de la base…')
  await prisma.$transaction([
    prisma.pageView.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.newsletterSubscriber.deleteMany(),
    prisma.academyApplication.deleteMany(),
    prisma.recruitmentApplication.deleteMany(),
    prisma.mediaEvent.deleteMany(),
    prisma.pressContact.deleteMany(),
    prisma.pressItem.deleteMany(),
    prisma.partner.deleteMany(),
    prisma.shopOrder.deleteMany(),
    prisma.shopProduct.deleteMany(),
    prisma.ticketOrder.deleteMany(),
    prisma.ticketOffer.deleteMany(),
    prisma.supporterEvent.deleteMany(),
    prisma.supporterGroup.deleteMany(),
    prisma.galleryImage.deleteMany(),
    prisma.video.deleteMany(),
    prisma.newsArticle.deleteMany(),
    prisma.standingEntry.deleteMany(),
    prisma.matchEvent.deleteMany(),
    prisma.match.deleteMany(),
    prisma.competition.deleteMany(),
    prisma.playerCareerStep.deleteMany(),
    prisma.player.deleteMany(),
    prisma.staffMember.deleteMany(),
    prisma.team.deleteMany(),
    prisma.honourTitle.deleteMany(),
    prisma.cmsPage.deleteMany(),
    prisma.user.deleteMany(),
  ])

  // -------------------------------------------------------------------------
  // Utilisateurs admin
  // -------------------------------------------------------------------------
  console.log('Création des comptes administrateurs…')
  const superAdminEmail = (process.env.SEED_ADMIN_EMAIL || 'admin@akwabafc.ci').toLowerCase()
  const superAdminPassword = process.env.SEED_ADMIN_PASSWORD || 'AkwabaFC2026!'
  const roleUsers: Array<{ name: string; email: string; role: string; password: string }> = [
    { name: 'Super Administrateur', email: superAdminEmail, role: 'SUPER_ADMIN', password: superAdminPassword },
    { name: 'Direction Administrative', email: 'direction@akwabafc.ci', role: 'ADMIN', password: superAdminPassword },
    { name: 'Rédaction Club', email: 'redaction@akwabafc.ci', role: 'EDITOR', password: superAdminPassword },
    { name: 'Direction Sportive', email: 'sportif@akwabafc.ci', role: 'SPORT_MANAGER', password: superAdminPassword },
    { name: 'Responsable Academy', email: 'academy@akwabafc.ci', role: 'ACADEMY_MANAGER', password: superAdminPassword },
    { name: 'Responsable Média', email: 'media@akwabafc.ci', role: 'MEDIA_MANAGER', password: superAdminPassword },
  ]
  for (const u of roleUsers) {
    await prisma.user.create({ data: { name: u.name, email: u.email, role: u.role, passwordHash: await bcrypt.hash(u.password, 12) } })
  }

  // -------------------------------------------------------------------------
  // Équipes
  // -------------------------------------------------------------------------
  console.log('Création des équipes…')
  const teamDefs = [
    { slug: 'men', name: 'Équipe Première', shortName: 'Seniors', tagline: 'Le fer de lance du club', description: "L'équipe première d'AKWABA FC évolue en Ligue 1 et porte l'ambition du club chaque week-end au Stade de l'Amitié.", coverImage: img(PHOTOS.teamPitch, 1600) },
    { slug: 'women', name: 'Équipe Féminine', shortName: 'Féminines', tagline: 'Une même exigence, une même fierté', description: "L'équipe féminine d'AKWABA FC incarne l'ambition du club au plus haut niveau du football féminin ivoirien.", coverImage: img(PHOTOS.clubIdentity, 1600) },
    { slug: 'reserve', name: 'Équipe Réserve', shortName: 'Réserve', tagline: 'Le tremplin vers l’élite', description: "L'équipe réserve prépare la relève et assure la transition entre le Centre de Formation et l'équipe première.", coverImage: img(PHOTOS.training, 1600) },
    { slug: 'u18', name: 'U18', shortName: 'U18', tagline: 'Les talents de demain', description: "L'équipe U18 rassemble les meilleurs espoirs formés au Centre de Formation AKWABA FC.", coverImage: img(PHOTOS.youngTalents, 1600) },
  ]
  const teams: Record<string, { id: string }> = {}
  for (const t of teamDefs) {
    teams[t.slug] = await prisma.team.create({ data: t })
  }

  // -------------------------------------------------------------------------
  // Effectifs
  // -------------------------------------------------------------------------
  console.log('Génération des effectifs…')
  const squads: Record<string, SquadSpec> = {
    men: { teamSlug: 'men', count: 22, femaleNames: false, minAge: 18, maxAge: 33 },
    women: { teamSlug: 'women', count: 20, femaleNames: true, minAge: 17, maxAge: 30 },
    reserve: { teamSlug: 'reserve', count: 18, femaleNames: false, minAge: 17, maxAge: 21 },
    u18: { teamSlug: 'u18', count: 18, femaleNames: false, minAge: 15, maxAge: 18 },
  }
  const playersBySlug: Record<string, string> = {}
  const playersByTeam: Record<string, Array<{ id: string; position: string; captain: boolean }>> = { men: [], women: [], reserve: [], u18: [] }
  let offset = 0
  for (const key of Object.keys(squads)) {
    const spec = squads[key]
    const squad = buildSquad(spec, offset)
    offset += spec.count * 4
    for (const p of squad) {
      const created = await prisma.player.create({
        data: { ...p, teamId: teams[key].id },
      })
      playersBySlug[`${key}-${p.number}`] = created.id
      playersByTeam[key].push({ id: created.id, position: p.position, captain: p.captain })
      await prisma.playerCareerStep.createMany({
        data: [
          { playerId: created.id, season: '2023/2024', club: 'Centre de Formation AKWABA FC', note: 'Formation', order: 0 },
          { playerId: created.id, season: '2024/2025', club: key === 'u18' ? 'U18 AKWABA FC' : 'AKWABA FC', note: 'Intégration effectif', order: 1 },
          { playerId: created.id, season: '2025/2026', club: 'AKWABA FC', note: 'Saison en cours', order: 2 },
        ],
      })
    }
  }

  // -------------------------------------------------------------------------
  // Staff
  // -------------------------------------------------------------------------
  console.log('Création du staff…')
  const staffDefs: Array<{ name: string; role: string; department: string; teamSlug?: string }> = [
    { name: 'Amara Diomandé', role: 'Président du club', department: 'DIRECTION' },
    { name: 'Solange Kacou', role: 'Directrice générale', department: 'DIRECTION' },
    { name: 'Étienne Brou', role: 'Directeur sportif', department: 'DIRECTION' },
    { name: 'Nadia Fofana', role: 'Secrétaire générale', department: 'DIRECTION' },
    { name: 'Paul N’Dri', role: 'Entraîneur principal', department: 'MEN', teamSlug: 'men' },
    { name: 'Ibrahim Cissé', role: 'Entraîneur adjoint', department: 'MEN', teamSlug: 'men' },
    { name: 'Roger Aka', role: 'Préparateur physique', department: 'MEN', teamSlug: 'men' },
    { name: 'Fatoumata Sangaré', role: 'Entraîneure principale', department: 'WOMEN', teamSlug: 'women' },
    { name: 'Bintou Koné', role: 'Entraîneure adjointe', department: 'WOMEN', teamSlug: 'women' },
    { name: 'David Loba', role: 'Entraîneur principal', department: 'RESERVE', teamSlug: 'reserve' },
    { name: 'Kader Sanogo', role: 'Entraîneur principal', department: 'U18', teamSlug: 'u18' },
    { name: 'Michel Angoua', role: 'Directeur du Centre de Formation', department: 'ACADEMY' },
    { name: 'Grace Ahou', role: 'Coordinatrice U13-U15', department: 'ACADEMY' },
    { name: 'Yves Kra', role: 'Coordinateur U17-U18', department: 'ACADEMY' },
    { name: 'Aïcha Bamba', role: 'Responsable communication', department: 'MEDIA' },
    { name: 'Sylvain Gogoua', role: 'Réalisateur Club TV', department: 'MEDIA' },
  ]
  for (const s of staffDefs) {
    await prisma.staffMember.create({
      data: {
        slug: slugify(s.name),
        name: s.name,
        role: s.role,
        department: s.department,
        photoUrl: avatar(s.name),
        bio: `${s.name} accompagne AKWABA FC au poste de ${s.role.toLowerCase()}, avec pour mission d’élever le club à chaque saison.`,
        teamId: s.teamSlug ? teams[s.teamSlug].id : undefined,
      },
    })
  }

  // -------------------------------------------------------------------------
  // Compétitions
  // -------------------------------------------------------------------------
  console.log('Création des compétitions et matchs…')
  const competitions = {
    men: await prisma.competition.create({ data: { name: 'Ligue 1', slug: 'ligue-1', season: '2026/2027' } }),
    cup: await prisma.competition.create({ data: { name: 'Coupe Nationale', slug: 'coupe-nationale', season: '2026/2027' } }),
    women: await prisma.competition.create({ data: { name: 'Championnat Féminin D1', slug: 'championnat-feminin-d1', season: '2026/2027' } }),
    reserve: await prisma.competition.create({ data: { name: 'Ligue Réserve', slug: 'ligue-reserve', season: '2026/2027' } }),
    u18: await prisma.competition.create({ data: { name: 'Championnat U18', slug: 'championnat-u18', season: '2026/2027' } }),
  }
  const OPPONENTS = ['Racing Club', 'ASEC Étoile', 'Fraternité FC', 'Lagune United', 'Bassam FC', 'Sud Sporting', 'Étoile du Nord', 'Cocody Athletic', 'Yamoussoukro FC', 'Littoral FC']

  const teamCompetition: Record<string, { comp: (typeof competitions)[keyof typeof competitions]; category: string }> = {
    men: { comp: competitions.men, category: 'men' },
    women: { comp: competitions.women, category: 'women' },
    reserve: { comp: competitions.reserve, category: 'reserve' },
    u18: { comp: competitions.u18, category: 'u18' },
  }

  const now = new Date()
  let matchdayCounter = 1
  const matchIdsByTeam: Record<string, string[]> = { men: [], women: [], reserve: [], u18: [] }
  const playedMatchesByTeam: Record<string, Array<{ id: string; date: Date }>> = { men: [], women: [], reserve: [], u18: [] }

  for (const key of Object.keys(teamCompetition)) {
    const { comp, category } = teamCompetition[key]
    // 6 matchs passés
    for (let i = 6; i >= 1; i--) {
      const date = new Date(now.getTime() - i * 8 * 86400000)
      const homeScore = (i * 3 + offset) % 4
      const awayScore = (i * 2 + offset) % 3
      const match = await prisma.match.create({
        data: {
          opponent: pick(OPPONENTS, i + offset),
          isHome: i % 2 === 0,
          date,
          stadium: i % 2 === 0 ? "Stade de l'Amitié · Abidjan" : 'Stade adverse',
          matchday: `J${matchdayCounter++}`,
          status: 'FINISHED',
          homeScore,
          awayScore,
          summary: `${key === 'men' ? 'AKWABA FC' : teamDefs.find((t) => t.slug === key)?.name} ${i % 2 === 0 ? homeScore : awayScore} - ${i % 2 === 0 ? awayScore : homeScore} ${pick(OPPONENTS, i + offset)}`,
          teamId: teams[key].id,
          competitionId: comp.id,
        },
      })
      matchIdsByTeam[key].push(match.id)
      playedMatchesByTeam[key].push({ id: match.id, date })
      if (i <= 2) {
        await prisma.matchEvent.createMany({
          data: [
            { matchId: match.id, minute: 23, type: 'GOAL', side: 'HOME', player: 'Numéro 9', detail: 'Ouverture du score', order: 0 },
            { matchId: match.id, minute: 41, type: 'YELLOW', side: 'AWAY', player: "Numéro 6 adverse", order: 1 },
            { matchId: match.id, minute: 67, type: 'SUB', side: 'HOME', player: 'Numéro 11 ↔ Numéro 17', order: 2 },
            { matchId: match.id, minute: 78, type: 'GOAL', side: 'HOME', player: 'Numéro 7', detail: 'Sur coup franc', order: 3 },
          ],
        })
      }
    }
    // 1 match en direct pour l'équipe première (démonstration Live Match Center)
    if (key === 'men') {
      const liveMatch = await prisma.match.create({
        data: {
          opponent: 'Racing Club',
          isHome: true,
          date: new Date(now.getTime() - 45 * 60000),
          stadium: "Stade de l'Amitié · Abidjan",
          matchday: `J${matchdayCounter++}`,
          status: 'LIVE',
          homeScore: 2,
          awayScore: 1,
          summary: 'AKWABA FC 2 - 1 Racing Club',
          teamId: teams[key].id,
          competitionId: comp.id,
        },
      })
      matchIdsByTeam[key].push(liveMatch.id)
      playedMatchesByTeam[key].push({ id: liveMatch.id, date: liveMatch.date })
      await prisma.matchEvent.createMany({
        data: [
          { matchId: liveMatch.id, minute: 12, type: 'GOAL', side: 'HOME', player: 'Numéro 9', detail: 'Passe décisive n°10', order: 0 },
          { matchId: liveMatch.id, minute: 34, type: 'YELLOW', side: 'AWAY', player: 'Numéro 4 Racing Club', order: 1 },
          { matchId: liveMatch.id, minute: 39, type: 'GOAL', side: 'AWAY', player: 'Numéro 11 Racing Club', order: 2 },
          { matchId: liveMatch.id, minute: 58, type: 'GOAL', side: 'HOME', player: 'Numéro 7', detail: 'Frappe enroulée', order: 3 },
          { matchId: liveMatch.id, minute: 63, type: 'SUB', side: 'HOME', player: 'Numéro 15 ↔ Numéro 22', order: 4 },
        ],
      })
    }
    // 4 matchs à venir
    for (let i = 1; i <= 4; i++) {
      const date = new Date(now.getTime() + i * 9 * 86400000)
      const match = await prisma.match.create({
        data: {
          opponent: pick(OPPONENTS, i + offset + 5),
          isHome: i % 2 === 1,
          date,
          stadium: i % 2 === 1 ? "Stade de l'Amitié · Abidjan" : 'Stade adverse',
          matchday: `J${matchdayCounter++}`,
          status: 'SCHEDULED',
          teamId: teams[key].id,
          competitionId: comp.id,
        },
      })
      matchIdsByTeam[key].push(match.id)
    }
    // Coupe nationale (hommes uniquement) : un match supplémentaire
    if (key === 'men') {
      await prisma.match.create({
        data: {
          opponent: 'ASEC Étoile',
          isHome: true,
          date: new Date(now.getTime() + 14 * 86400000),
          stadium: "Stade de l'Amitié · Abidjan",
          matchday: 'Huitièmes de finale',
          status: 'SCHEDULED',
          teamId: teams.men.id,
          competitionId: competitions.cup.id,
        },
      })
    }

    // Classement
    const clubNames = [...OPPONENTS].slice(0, 9)
    const table = clubNames.map((name, idx) => ({
      club: name,
      played: 18,
      won: 12 - idx,
      drawn: 2,
      lost: 4 + idx,
      goalsFor: 40 - idx * 2,
      goalsAgainst: 18 + idx,
      points: (12 - idx) * 3 + 2 * 1,
    }))
    table.splice(1, 0, { club: 'AKWABA FC', played: 18, won: 12, drawn: 2, lost: 4, goalsFor: 34, goalsAgainst: 17, points: 38 })
    const sorted = table.sort((a, b) => b.points - a.points)
    await prisma.standingEntry.createMany({
      data: sorted.map((row, idx) => ({
        club: row.club,
        isClub: row.club === 'AKWABA FC',
        category,
        position: idx + 1,
        played: row.played,
        won: row.won,
        drawn: row.drawn,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        points: row.points,
        competitionId: comp.id,
      })),
    })
  }

  // -------------------------------------------------------------------------
  // Feuilles de match, progression et médias des joueurs
  // -------------------------------------------------------------------------
  console.log('Génération des feuilles de match et statistiques joueurs…')
  const SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

  for (const key of Object.keys(playersByTeam)) {
    const squad = playersByTeam[key]
    const matches = playedMatchesByTeam[key]
    if (squad.length === 0) continue

    for (const [mIdx, match] of matches.entries()) {
      // Convoque ~16 joueurs (rotation déterministe) : 11 titulaires + remplaçants.
      const squadSize = Math.min(squad.length, 16)
      const called = Array.from({ length: squadSize }, (_, i) => squad[(mIdx * 5 + i) % squad.length])
      const appearanceRows = called.map((player, i) => {
        const started = i < 11
        const minutesPlayed = started ? 70 + ((mIdx + i) % 21) : 8 + ((mIdx + i) % 25)
        const isAttacker = player.position === 'FWD' || player.position === 'MID'
        const goals = isAttacker && (mIdx + i) % 5 === 0 ? 1 + ((mIdx + i) % 2) : 0
        const assists = isAttacker && (mIdx + i) % 6 === 1 ? 1 : 0
        const yellowCards = (mIdx + i) % 9 === 0 ? 1 : 0
        const redCards = (mIdx + i) % 27 === 0 ? 1 : 0
        return { matchId: match.id, playerId: player.id, started, minutesPlayed, goals, assists, yellowCards, redCards }
      })
      await prisma.matchAppearance.createMany({ data: appearanceRows })
      await prisma.playerProgressEntry.createMany({
        data: appearanceRows.map((a) => ({
          playerId: a.playerId,
          matchId: a.matchId,
          type: 'MATCH',
          date: match.date,
          rating: Math.max(0, Math.min(10, 6 + a.goals * 1 + a.assists * 0.5 - a.redCards * 2 - a.yellowCards * 0.5 + (a.minutesPlayed >= 60 ? 0.3 : 0))),
        })),
      })
    }

    // Entraînements : 2 évaluations par joueur, réparties sur les dernières semaines.
    await prisma.playerProgressEntry.createMany({
      data: squad.flatMap((player, i) => [
        {
          playerId: player.id,
          type: 'TRAINING',
          date: new Date(now.getTime() - (10 + (i % 5)) * 86400000),
          rating: Math.min(10, 6 + ((i * 3) % 4) * 0.5),
          note: 'Séance technique — bon engagement.',
        },
        {
          playerId: player.id,
          type: 'TRAINING',
          date: new Date(now.getTime() - (3 + (i % 4)) * 86400000),
          rating: Math.min(10, 6.5 + ((i * 5) % 4) * 0.5),
          note: 'Travail physique et tactique.',
        },
      ]),
    })

    // Médias : 3 photos + 1 vidéo par joueur ; vidéo highlight en fond pour le capitaine.
    for (const [i, player] of squad.entries()) {
      await prisma.playerMedia.createMany({
        data: [
          { playerId: player.id, type: 'PHOTO', url: poolImg(i * 3 + 1, 900), order: 0 },
          { playerId: player.id, type: 'PHOTO', url: poolImg(i * 3 + 2, 900), order: 1 },
          { playerId: player.id, type: 'PHOTO', url: poolImg(i * 3 + 3, 900), order: 2 },
          { playerId: player.id, type: 'VIDEO', url: SAMPLE_VIDEO, caption: 'Temps forts — dernière sortie', order: 3 },
        ],
      })
      if (player.captain) {
        await prisma.player.update({ where: { id: player.id }, data: { highlightVideoUrl: SAMPLE_VIDEO } })
      }
    }

    // Recalcule les totaux carrière depuis les feuilles de match — cohérent
    // avec ce que fait l'action admin saveMatchSheetAction en production.
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
  }

  // -------------------------------------------------------------------------
  // Actualités
  // -------------------------------------------------------------------------
  console.log('Création des actualités…')
  const newsDefs = [
    { title: 'AKWABA FC lance sa nouvelle saison avec ambition', category: 'EQUIPE_PREMIERE', featured: true },
    { title: 'Une identité, une famille, un avenir', category: 'VIE_DU_CLUB', featured: true },
    { title: 'Les jeunes talents entrent en scène', category: 'ACADEMY', featured: false },
    { title: "Victoire de caractère face au Racing Club", category: 'EQUIPE_PREMIERE', featured: false },
    { title: "Les Féminines démarrent tambour battant", category: 'FEMININES', featured: false },
    { title: 'Trois arrivées majeures pour renforcer l’effectif', category: 'MERCATO', featured: false },
    { title: 'Interview exclusive : le capitaine se confie', category: 'INTERVIEWS', featured: false },
    { title: 'Communiqué officiel : nouveau partenaire principal', category: 'COMMUNIQUES', featured: false },
    { title: "L'Academy accueille 40 nouveaux stagiaires", category: 'ACADEMY', featured: false },
    { title: 'La Réserve enchaîne les bonnes performances', category: 'RESERVE', featured: false },
    { title: 'Le groupe U18 impressionne en championnat', category: 'U18', featured: false },
    { title: '#TousEnsemble : les supporters se mobilisent', category: 'SUPPORTERS', featured: false },
    { title: 'Portrait : nos partenaires historiques', category: 'PARTENAIRES', featured: false },
    { title: 'Le club prépare son prochain grand rendez-vous', category: 'VIE_DU_CLUB', featured: true },
  ]
  let ni = 0
  for (const n of newsDefs) {
    const cover = poolImg(ni, 1400)
    await prisma.newsArticle.create({
      data: {
        slug: slugify(n.title),
        title: n.title,
        excerpt: `${n.title} — toute l’actualité d’AKWABA FC, décryptée par la rédaction du club.`,
        category: n.category,
        coverImage: cover,
        blocks: [
          { type: 'text', text: `${n.title}. AKWABA FC continue de porter haut les couleurs du club à travers cette actualité qui mobilise l’ensemble de la famille AKWABA.` },
          { type: 'quote', text: 'Une passion qui nous rassemble, une ambition qui nous guide.', author: 'Direction du club' },
          { type: 'image', url: poolImg(ni + 3, 1200), caption: 'AKWABA FC en action' },
          { type: 'text', text: "Retrouvez l'intégralité de nos actualités et suivez chaque étape de la saison 2026/2027 sur toutes nos plateformes." },
        ],
        tags: [n.category.toLowerCase(), 'akwaba-fc', 'saison-2026-2027'],
        author: 'Rédaction AKWABA FC',
        featured: n.featured,
        publishedAt: new Date(now.getTime() - ni * 2 * 86400000),
        teamId: n.category === 'FEMININES' ? teams.women.id : n.category === 'RESERVE' ? teams.reserve.id : n.category === 'U18' ? teams.u18.id : n.category === 'EQUIPE_PREMIERE' ? teams.men.id : undefined,
      },
    })
    ni++
  }

  // -------------------------------------------------------------------------
  // Club TV
  // -------------------------------------------------------------------------
  console.log('Création des vidéos Club TV…')
  const videoDefs = [
    { title: 'Inside — Une journée au cœur du club', category: 'INSIDE', duration: 755, isLive: false },
    { title: 'Les meilleurs moments du dernier match', category: 'HIGHLIGHTS', duration: 272, isLive: false },
    { title: 'Paroles de vestiaire', category: 'INTERVIEWS', duration: 496, isLive: false },
    { title: 'AKWABA FC vs Racing Club — EN DIRECT', category: 'MATCHS', duration: 0, isLive: true },
    { title: 'Conférence de presse d’avant-match', category: 'CONFERENCES', duration: 612, isLive: false },
    { title: 'Séance d’entraînement de la semaine', category: 'TRAINING', duration: 340, isLive: false },
    { title: 'Academy TV : la relève AKWABA FC', category: 'ACADEMY_TV', duration: 480, isLive: false },
    { title: 'Féminine TV : immersion avant match', category: 'FEMININE_TV', duration: 390, isLive: false },
    { title: 'Documentaire : 20 ans d’histoire', category: 'DOCUMENTAIRES', duration: 1520, isLive: false },
    { title: 'Le Magazine du club — Épisode 12', category: 'MAGAZINE', duration: 980, isLive: false },
    { title: 'Highlights Féminines : victoire éclatante', category: 'HIGHLIGHTS', duration: 260, isLive: false },
    { title: 'Interview du nouveau capitaine', category: 'INTERVIEWS', duration: 410, isLive: false },
  ]
  let vi = 0
  for (const v of videoDefs) {
    await prisma.video.create({
      data: {
        slug: slugify(v.title),
        title: v.title,
        description: `${v.title} — contenu exclusif AKWABA Club TV.`,
        category: v.category,
        thumbnailUrl: poolImg(vi + 1, 1000),
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        durationSeconds: v.duration,
        isLive: v.isLive,
        publishedAt: new Date(now.getTime() - vi * 86400000),
      },
    })
    vi++
  }

  // -------------------------------------------------------------------------
  // Galerie
  // -------------------------------------------------------------------------
  console.log('Création de la galerie…')
  const galleryCats = ['MATCHS', 'ENTRAINEMENTS', 'FEMININES', 'RESERVE', 'U18', 'ACADEMY', 'SUPPORTERS', 'EVENEMENTS']
  for (let i = 0; i < 24; i++) {
    await prisma.galleryImage.create({
      data: {
        url: poolImg(i, 1000),
        caption: `AKWABA FC — ${pick(galleryCats, i)}`,
        category: pick(galleryCats, i),
        publishedAt: new Date(now.getTime() - i * 43200000),
      },
    })
  }

  // -------------------------------------------------------------------------
  // Supporters
  // -------------------------------------------------------------------------
  console.log('Création de la communauté supporters…')
  await prisma.supporterGroup.createMany({
    data: [
      { name: 'Ultras Amitié', description: 'Le groupe historique du kop nord, présent depuis la fondation du club.', logoUrl: avatar('Ultras Amitié'), since: '2005', membersLabel: '1 200 membres' },
      { name: 'Akwaba Family', description: 'La communauté familiale des supporters, pour tous les âges.', logoUrl: avatar('Akwaba Family'), since: '2012', membersLabel: '3 400 membres' },
      { name: 'Diaspora AFC', description: 'Les supporters d’AKWABA FC à travers le monde.', logoUrl: avatar('Diaspora AFC'), since: '2018', membersLabel: '900 membres' },
    ],
  })
  await prisma.supporterEvent.createMany({
    data: [
      { title: 'Tifo géant avant le derby', description: 'Rendez-vous 2h avant le coup d’envoi pour préparer le tifo.', date: new Date(now.getTime() + 9 * 86400000), location: "Stade de l'Amitié" },
      { title: 'Soirée supporters', description: 'Rencontre avec les joueurs et animations.', date: new Date(now.getTime() + 20 * 86400000), location: 'Club House AKWABA FC' },
      { title: 'Concours meilleur chant', description: 'Les groupes de supporters s’affrontent musicalement.', date: new Date(now.getTime() + 30 * 86400000), location: "Stade de l'Amitié" },
    ],
  })

  // -------------------------------------------------------------------------
  // Billetterie
  // -------------------------------------------------------------------------
  console.log('Création de la billetterie…')
  const upcomingMenMatches = await prisma.match.findMany({ where: { teamId: teams.men.id, status: 'SCHEDULED' }, take: 3 })
  for (const m of upcomingMenMatches) {
    await prisma.ticketOffer.createMany({
      data: [
        { matchId: m.id, tier: 'TRIBUNE_A', price: 2000, capacity: 4000, remaining: 2600 },
        { matchId: m.id, tier: 'TRIBUNE_B', price: 1500, capacity: 5000, remaining: 3100 },
        { matchId: m.id, tier: 'VIP', price: 10000, capacity: 300, remaining: 62 },
        { matchId: m.id, tier: 'FAMILLE', price: 4500, capacity: 800, remaining: 410 },
      ],
    })
  }

  // -------------------------------------------------------------------------
  // Boutique
  // -------------------------------------------------------------------------
  console.log('Création de la boutique…')
  const shopDefs = [
    { name: 'Maillot domicile 2026/2027', category: 'MAILLOTS', price: 25000 },
    { name: 'Maillot extérieur 2026/2027', category: 'MAILLOTS', price: 25000 },
    { name: 'Maillot gardien 2026/2027', category: 'MAILLOTS', price: 27000 },
    { name: 'Short officiel domicile', category: 'SHORTS', price: 9000 },
    { name: 'Survêtement d’entraînement', category: 'SURVETEMENTS', price: 32000 },
    { name: 'Coupe-vent AKWABA FC', category: 'SURVETEMENTS', price: 28000 },
    { name: 'Écharpe officielle', category: 'ECHARPES', price: 6000 },
    { name: 'Écharpe édition supporters', category: 'ECHARPES', price: 6500 },
    { name: 'Casquette brodée', category: 'CASQUETTES', price: 7500 },
    { name: 'Bonnet AKWABA FC', category: 'CASQUETTES', price: 6000 },
    { name: 'Sac de sport', category: 'ACCESSOIRES', price: 15000 },
    { name: 'Ballon officiel', category: 'ACCESSOIRES', price: 12000 },
    { name: 'Drapeau supporters', category: 'SUPPORTERS', price: 5000 },
    { name: 'Kit tifo mini-drapeaux', category: 'SUPPORTERS', price: 3500 },
  ]
  let shi = 0
  for (const p of shopDefs) {
    await prisma.shopProduct.create({
      data: {
        slug: slugify(p.name),
        name: p.name,
        category: p.category,
        price: p.price,
        imageUrl: poolImg(shi + 5, 900),
        description: `${p.name} — collection officielle AKWABA FC, saison 2026/2027.`,
        sizes: p.category === 'MAILLOTS' || p.category === 'SURVETEMENTS' || p.category === 'SHORTS' ? ['XS', 'S', 'M', 'L', 'XL', 'XXL'] : ['Unique'],
        inStock: shi % 9 !== 0,
      },
    })
    shi++
  }

  // -------------------------------------------------------------------------
  // Partenaires
  // -------------------------------------------------------------------------
  console.log('Création des partenaires…')
  const partnerDefs = [
    { name: 'Ivoire Télécom', category: 'PRINCIPAL' },
    { name: 'Banque Atlantique CI', category: 'OFFICIEL' },
    { name: 'Abidjan Énergie', category: 'OFFICIEL' },
    { name: 'Lagune Assurances', category: 'SPONSOR' },
    { name: 'Sport & Style', category: 'SPONSOR' },
    { name: 'Nova Boissons', category: 'SPONSOR' },
    { name: "Ministère des Sports", category: 'INSTITUTIONNEL' },
    { name: 'Mairie d’Abidjan', category: 'INSTITUTIONNEL' },
    { name: 'Fédération Ivoirienne de Football', category: 'INSTITUTIONNEL' },
  ]
  let pi = 0
  for (const p of partnerDefs) {
    await prisma.partner.create({
      data: {
        slug: slugify(p.name),
        name: p.name,
        category: p.category,
        logoUrl: logoAvatar(p.name),
        description: `${p.name} accompagne AKWABA FC en tant que ${p.category === 'PRINCIPAL' ? 'partenaire principal' : p.category === 'OFFICIEL' ? 'partenaire officiel' : p.category === 'SPONSOR' ? 'sponsor' : 'partenaire institutionnel'}.`,
        websiteUrl: 'https://example.com',
        order: pi,
      },
    })
    pi++
  }

  // -------------------------------------------------------------------------
  // Espace presse
  // -------------------------------------------------------------------------
  console.log('Création de l’espace presse…')
  await prisma.pressItem.createMany({
    data: [
      { type: 'COMMUNIQUE', title: 'AKWABA FC annonce un nouveau partenaire principal', publishedAt: new Date(now.getTime() - 2 * 86400000) },
      { type: 'CONFERENCE', title: 'Conférence de presse d’avant-saison', publishedAt: new Date(now.getTime() - 5 * 86400000) },
      { type: 'INTERVIEW', title: 'Le directeur sportif présente les ambitions du club', publishedAt: new Date(now.getTime() - 8 * 86400000) },
      { type: 'PHOTO', title: 'Photos officielles — Présentation d’effectif 2026/2027', publishedAt: new Date(now.getTime() - 10 * 86400000) },
      { type: 'LOGO', title: 'Kit graphique — Logos officiels AKWABA FC', publishedAt: new Date(now.getTime() - 30 * 86400000) },
      { type: 'DOSSIER', title: 'Dossier de presse — Saison 2026/2027', publishedAt: new Date(now.getTime() - 15 * 86400000) },
    ],
  })
  await prisma.pressContact.createMany({
    data: [
      { name: 'Aïcha Bamba', role: 'Responsable communication', email: 'presse@akwabafc.ci', phone: '+225 07 00 00 00 01' },
      { name: 'Sylvain Gogoua', role: 'Attaché de presse', email: 'media@akwabafc.ci', phone: '+225 07 00 00 00 02' },
    ],
  })
  await prisma.mediaEvent.createMany({
    data: [
      { title: 'Conférence de presse d’avant-match', date: new Date(now.getTime() + 8 * 86400000) },
      { title: 'Point presse mensuel', date: new Date(now.getTime() + 18 * 86400000) },
      { title: 'Journée médias — Academy', date: new Date(now.getTime() + 25 * 86400000) },
    ],
  })

  // -------------------------------------------------------------------------
  // Palmarès
  // -------------------------------------------------------------------------
  console.log('Création du palmarès…')
  await prisma.honourTitle.createMany({
    data: [
      { title: 'Champion national', season: '2023/2024', competition: 'Ligue 1', order: 0 },
      { title: 'Vainqueur de la Coupe Nationale', season: '2021/2022', competition: 'Coupe Nationale', order: 1 },
      { title: 'Champion national', season: '2019/2020', competition: 'Ligue 1', order: 2 },
      { title: 'Finaliste de la Coupe Nationale', season: '2017/2018', competition: 'Coupe Nationale', order: 3 },
      { title: 'Champion national', season: '2014/2015', competition: 'Ligue 1', order: 4 },
      { title: 'Fondation du club', season: '2005', competition: 'AKWABA FC', order: 5 },
    ],
  })

  // -------------------------------------------------------------------------
  // Pages CMS
  // -------------------------------------------------------------------------
  console.log('Création des pages CMS…')
  const cmsDefs = [
    { slug: 'histoire', title: 'Notre histoire', subtitle: 'Depuis 2005, une aventure humaine et sportive', blocks: [
      { type: 'paragraph', text: "Fondé en 2005 à Abidjan, AKWABA FC est né de la volonté d'un groupe de passionnés de donner au football ivoirien un club exigeant, ouvert et tourné vers la formation." },
      { type: 'paragraph', text: "Depuis, le club n'a cessé de grandir : montée en Ligue 1, ouverture du Centre de Formation, création de la section féminine et développement d'infrastructures modernes autour du Stade de l'Amitié." },
      { type: 'stat', label: 'Année de fondation', value: '2005' },
      { type: 'stat', label: 'Titres nationaux', value: '3' },
    ] },
    { slug: 'valeurs', title: 'Nos valeurs', subtitle: 'Ce qui nous rassemble, sur et en dehors du terrain', blocks: [
      { type: 'paragraph', text: "AKWABA — l'hospitalité — est plus qu'un nom : c'est une philosophie. Le club place l'accueil, le respect et l'exigence sportive au cœur de chacune de ses actions." },
      { type: 'stat', label: 'Ambition', value: 'Excellence sportive' },
      { type: 'stat', label: 'Formation', value: 'Priorité à la jeunesse' },
      { type: 'stat', label: 'Communauté', value: 'Un club, une famille' },
    ] },
    { slug: 'palmares', title: 'Notre palmarès', subtitle: 'Une histoire de titres et de fierté', blocks: [
      { type: 'paragraph', text: "Retrouvez ci-dessous la frise interactive des principaux titres et moments forts de l'histoire d'AKWABA FC." },
    ] },
    { slug: 'stade', title: 'Notre stade', subtitle: "Stade de l'Amitié · Abidjan", blocks: [
      { type: 'paragraph', text: "Le Stade de l'Amitié accueille les rencontres à domicile d'AKWABA FC depuis 2009. D'une capacité de 12 000 places, il a été rénové en 2023 pour offrir une expérience moderne aux supporters." },
      { type: 'stat', label: 'Capacité', value: '12 000 places' },
      { type: 'stat', label: 'Ouverture', value: '2009' },
      { type: 'stat', label: 'Dernière rénovation', value: '2023' },
    ] },
    { slug: 'gouvernance', title: 'Notre gouvernance', subtitle: 'Une direction engagée pour le club', blocks: [
      { type: 'paragraph', text: "AKWABA FC est administré par un conseil de direction garant de la vision sportive, économique et sociale du club. Retrouvez l'organigramme complet sur la page Staff & Direction." },
    ] },
  ]
  for (const p of cmsDefs) {
    await prisma.cmsPage.create({ data: p })
  }

  // -------------------------------------------------------------------------
  // Recrutement / Academy
  // -------------------------------------------------------------------------
  console.log('Création des candidatures de démonstration…')
  await prisma.recruitmentApplication.createMany({
    data: [
      { category: 'EDUCATEUR', fullName: 'Marc Digbeu', email: 'marc.digbeu@example.com', phone: '+225 07 12 34 56 78', message: 'Éducateur diplômé CAF C, disponible pour la catégorie U15.' },
      { category: 'BENEVOLE', fullName: 'Clarisse Amoin', email: 'clarisse.amoin@example.com', phone: '+225 05 98 76 54 32', message: 'Disponible les week-ends pour l’organisation des matchs.' },
    ],
  })
  await prisma.academyApplication.createMany({
    data: [
      { firstName: 'Junior', lastName: 'Kouakou', birthDate: new Date('2012-04-12'), nationality: "Côte d'Ivoire", position: 'MID', preferredFoot: 'DROIT', height: 152, category: 'U13', parentName: 'Alain Kouakou', parentEmail: 'alain.kouakou@example.com', parentPhone: '+225 01 23 45 67 89', parentalConsent: true, message: 'Passionné depuis son plus jeune âge, il rêve d’intégrer l’Academy.' },
      { firstName: 'Aya', lastName: 'Brou', birthDate: new Date('2009-09-03'), nationality: "Côte d'Ivoire", position: 'FWD', preferredFoot: 'GAUCHE', height: 165, category: 'U17', parentName: 'Sandrine Brou', parentEmail: 'sandrine.brou@example.com', parentPhone: '+225 07 65 43 21 09', parentalConsent: true },
    ],
  })

  // -------------------------------------------------------------------------
  // Newsletter, notifications, statistiques
  // -------------------------------------------------------------------------
  console.log('Création des notifications et statistiques…')
  await prisma.newsletterSubscriber.createMany({
    data: [{ email: 'supporter1@example.com' }, { email: 'supporter2@example.com' }],
  })
  await prisma.notification.createMany({
    data: [
      { icon: '⚽', title: 'Coup d’envoi imminent', body: 'AKWABA FC - Racing Club débute dans 30 minutes.' },
      { icon: '🔴', title: 'Match en direct', body: 'Le match est en direct sur AKWABA Club TV.' },
      { icon: '📰', title: 'Nouvelle actualité', body: 'AKWABA FC lance sa nouvelle saison avec ambition.' },
      { icon: '🎥', title: 'Nouvelle vidéo disponible', body: 'Inside — Une journée au cœur du club est en ligne.' },
      { icon: '🎟️', title: 'Billetterie ouverte', body: 'Les billets pour le prochain match sont disponibles.' },
    ],
  })
  const pageViewRows = Array.from({ length: 2845 % 400 === 0 ? 400 : 187 }).map((_, i) => ({
    path: pick(['/', '/news', '/matches', '/club-tv', '/teams/men'], i),
    date: new Date(now.getTime() - Math.floor(Math.random() * 6 * 3600000)),
  }))
  await prisma.pageView.createMany({ data: pageViewRows })

  console.log('Seed terminé avec succès.')
  console.log(`Connexion admin — email: ${superAdminEmail} / mot de passe: ${superAdminPassword}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
