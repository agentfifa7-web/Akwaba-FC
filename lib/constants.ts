// Valeurs "enum" partagées par toute la plateforme (base + UI + validation).
// SQLite ne supportant pas les enums Prisma, ces unions sont la source de
// vérité ; lib/validation.ts s'appuie dessus pour valider les écritures.

export const ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'EDITOR',
  'SPORT_MANAGER',
  'ACADEMY_MANAGER',
  'MEDIA_MANAGER',
] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super administrateur',
  ADMIN: 'Administrateur',
  EDITOR: 'Éditeur',
  SPORT_MANAGER: 'Responsable sportif',
  ACADEMY_MANAGER: 'Responsable Academy',
  MEDIA_MANAGER: 'Responsable média',
}

export const TEAM_SLUGS = ['men', 'women', 'reserve', 'u18'] as const
export type TeamSlug = (typeof TEAM_SLUGS)[number]

export const TEAM_LABELS: Record<TeamSlug, string> = {
  men: 'Équipe Première',
  women: 'Équipe Féminine',
  reserve: 'Équipe Réserve',
  u18: 'U18',
}

export const POSITIONS = ['GK', 'DEF', 'MID', 'FWD'] as const
export type Position = (typeof POSITIONS)[number]
export const POSITION_LABELS: Record<Position, string> = {
  GK: 'Gardien',
  DEF: 'Défenseur',
  MID: 'Milieu',
  FWD: 'Attaquant',
}

export const MATCH_STATUSES = ['SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED'] as const
export type MatchStatus = (typeof MATCH_STATUSES)[number]
export const MATCH_STATUS_LABELS: Record<MatchStatus, string> = {
  SCHEDULED: 'À venir',
  LIVE: 'En direct',
  FINISHED: 'Terminé',
  POSTPONED: 'Reporté',
}

export const PLAYER_MEDIA_TYPES = ['PHOTO', 'VIDEO'] as const
export type PlayerMediaType = (typeof PLAYER_MEDIA_TYPES)[number]

export const PROGRESS_ENTRY_TYPES = ['MATCH', 'TRAINING'] as const
export type ProgressEntryType = (typeof PROGRESS_ENTRY_TYPES)[number]
export const PROGRESS_ENTRY_TYPE_LABELS: Record<ProgressEntryType, string> = {
  MATCH: 'Match',
  TRAINING: 'Entraînement',
}

export const PLAYER_ATTRIBUTE_KEYS = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'] as const
export type PlayerAttributeKey = (typeof PLAYER_ATTRIBUTE_KEYS)[number]
export const PLAYER_ATTRIBUTE_LABELS: Record<PlayerAttributeKey, string> = {
  pace: 'Vitesse',
  shooting: 'Tir',
  passing: 'Passe',
  dribbling: 'Dribble',
  defending: 'Défense',
  physical: 'Physique',
}

// Thème de couleur par poste — utilisé sur la fiche de présentation du
// joueur (radar, courbe de progression, badges) pour apporter de la
// couleur tout en restant lisible dans les deux thèmes clair/sombre.
export const POSITION_THEME: Record<Position, { accent: string; soft: string; ring: string }> = {
  GK: { accent: '#f5a524', soft: 'rgba(245,165,36,0.16)', ring: 'rgba(245,165,36,0.4)' },
  DEF: { accent: '#3b82f6', soft: 'rgba(59,130,246,0.16)', ring: 'rgba(59,130,246,0.4)' },
  MID: { accent: '#22c55e', soft: 'rgba(34,197,94,0.16)', ring: 'rgba(34,197,94,0.4)' },
  FWD: { accent: '#ef4444', soft: 'rgba(239,68,68,0.16)', ring: 'rgba(239,68,68,0.4)' },
}

export const MATCH_EVENT_TYPES = ['GOAL', 'YELLOW', 'RED', 'SUB', 'OTHER'] as const
export type MatchEventType = (typeof MATCH_EVENT_TYPES)[number]
export const MATCH_EVENT_ICONS: Record<MatchEventType, string> = {
  GOAL: '⚽',
  YELLOW: '🟨',
  RED: '🟥',
  SUB: '🔄',
  OTHER: 'ℹ️',
}

export const NEWS_CATEGORIES = [
  'EQUIPE_PREMIERE',
  'FEMININES',
  'RESERVE',
  'U18',
  'ACADEMY',
  'MERCATO',
  'INTERVIEWS',
  'COMMUNIQUES',
  'VIE_DU_CLUB',
  'SUPPORTERS',
  'PARTENAIRES',
] as const
export type NewsCategory = (typeof NEWS_CATEGORIES)[number]
export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  EQUIPE_PREMIERE: 'Équipe première',
  FEMININES: 'Féminines',
  RESERVE: 'Réserve',
  U18: 'U18',
  ACADEMY: 'Academy',
  MERCATO: 'Mercato',
  INTERVIEWS: 'Interviews',
  COMMUNIQUES: 'Communiqués',
  VIE_DU_CLUB: 'Vie du club',
  SUPPORTERS: 'Supporters',
  PARTENAIRES: 'Partenaires',
}

export const VIDEO_CATEGORIES = [
  'MATCHS',
  'CONFERENCES',
  'INTERVIEWS',
  'INSIDE',
  'TRAINING',
  'ACADEMY_TV',
  'FEMININE_TV',
  'HIGHLIGHTS',
  'DOCUMENTAIRES',
  'MAGAZINE',
] as const
export type VideoCategory = (typeof VIDEO_CATEGORIES)[number]
export const VIDEO_CATEGORY_LABELS: Record<VideoCategory, string> = {
  MATCHS: 'Matchs',
  CONFERENCES: 'Conférences de presse',
  INTERVIEWS: 'Interviews',
  INSIDE: 'Inside the Club',
  TRAINING: 'Training',
  ACADEMY_TV: 'Academy TV',
  FEMININE_TV: 'Féminine TV',
  HIGHLIGHTS: 'Highlights',
  DOCUMENTAIRES: 'Documentaires',
  MAGAZINE: 'Magazine du club',
}

export const GALLERY_CATEGORIES = [
  'MATCHS',
  'ENTRAINEMENTS',
  'FEMININES',
  'RESERVE',
  'U18',
  'ACADEMY',
  'SUPPORTERS',
  'EVENEMENTS',
] as const
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number]
export const GALLERY_CATEGORY_LABELS: Record<GalleryCategory, string> = {
  MATCHS: 'Matchs',
  ENTRAINEMENTS: 'Entraînements',
  FEMININES: 'Féminines',
  RESERVE: 'Réserve',
  U18: 'U18',
  ACADEMY: 'Academy',
  SUPPORTERS: 'Supporters',
  EVENEMENTS: 'Événements',
}

export const PARTNER_CATEGORIES = ['PRINCIPAL', 'OFFICIEL', 'SPONSOR', 'INSTITUTIONNEL'] as const
export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number]
export const PARTNER_CATEGORY_LABELS: Record<PartnerCategory, string> = {
  PRINCIPAL: 'Partenaire principal',
  OFFICIEL: 'Partenaires officiels',
  SPONSOR: 'Sponsors',
  INSTITUTIONNEL: 'Partenaires institutionnels',
}

export const SHOP_CATEGORIES = [
  'MAILLOTS',
  'SHORTS',
  'SURVETEMENTS',
  'ECHARPES',
  'CASQUETTES',
  'ACCESSOIRES',
  'SUPPORTERS',
] as const
export type ShopCategory = (typeof SHOP_CATEGORIES)[number]
export const SHOP_CATEGORY_LABELS: Record<ShopCategory, string> = {
  MAILLOTS: 'Maillots',
  SHORTS: 'Shorts',
  SURVETEMENTS: 'Survêtements',
  ECHARPES: 'Écharpes',
  CASQUETTES: 'Casquettes',
  ACCESSOIRES: 'Accessoires',
  SUPPORTERS: 'Produits supporters',
}

export const TICKET_TIERS = ['TRIBUNE_A', 'TRIBUNE_B', 'VIP', 'FAMILLE'] as const
export type TicketTier = (typeof TICKET_TIERS)[number]
export const TICKET_TIER_LABELS: Record<TicketTier, string> = {
  TRIBUNE_A: 'Tribune A',
  TRIBUNE_B: 'Tribune B',
  VIP: 'VIP',
  FAMILLE: 'Famille',
}

export const PRESS_ITEM_TYPES = ['COMMUNIQUE', 'CONFERENCE', 'INTERVIEW', 'PHOTO', 'LOGO', 'DOSSIER'] as const
export type PressItemType = (typeof PRESS_ITEM_TYPES)[number]
export const PRESS_ITEM_TYPE_LABELS: Record<PressItemType, string> = {
  COMMUNIQUE: 'Communiqué',
  CONFERENCE: 'Conférence de presse',
  INTERVIEW: 'Interview',
  PHOTO: 'Photos officielles',
  LOGO: 'Logos',
  DOSSIER: 'Dossier de presse',
}

export const RECRUITMENT_CATEGORIES = ['JOUEUR', 'EDUCATEUR', 'STAFF', 'ADMINISTRATION', 'BENEVOLE'] as const
export type RecruitmentCategory = (typeof RECRUITMENT_CATEGORIES)[number]
export const RECRUITMENT_CATEGORY_LABELS: Record<RecruitmentCategory, string> = {
  JOUEUR: 'Joueur',
  EDUCATEUR: 'Éducateur',
  STAFF: 'Staff',
  ADMINISTRATION: 'Administration',
  BENEVOLE: 'Bénévole',
}

export const ACADEMY_CATEGORIES = ['U13', 'U15', 'U17', 'U18'] as const
export type AcademyCategory = (typeof ACADEMY_CATEGORIES)[number]

export const STAFF_DEPARTMENTS = ['DIRECTION', 'MEN', 'WOMEN', 'RESERVE', 'U18', 'ACADEMY', 'MEDIA'] as const
export type StaffDepartment = (typeof STAFF_DEPARTMENTS)[number]
export const STAFF_DEPARTMENT_LABELS: Record<StaffDepartment, string> = {
  DIRECTION: 'Direction',
  MEN: 'Équipe première',
  WOMEN: 'Féminines',
  RESERVE: 'Réserve',
  U18: 'U18',
  ACADEMY: 'Academy',
  MEDIA: 'Média',
}

export const APPLICATION_STATUSES = ['NOUVEAU', 'EN_COURS', 'TRAITE'] as const
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  NOUVEAU: 'Nouveau',
  EN_COURS: 'En cours',
  TRAITE: 'Traité',
}

export const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  CANCELLED: 'Annulée',
}

export const SITE_NAV = [
  { label: 'Le club', href: '/club' },
  { label: 'Équipes', href: '/teams/men' },
  { label: 'Academy', href: '/academy' },
  { label: 'Matchs', href: '/matches' },
  { label: 'Classements', href: '/standings' },
  { label: 'Actualités', href: '/news' },
  { label: 'Club TV', href: '/club-tv' },
  { label: 'Galerie', href: '/gallery' },
  { label: 'Supporters', href: '/supporters' },
  { label: 'Boutique', href: '/shop' },
  { label: 'Partenaires', href: '/partners' },
  { label: 'Contact', href: '/contact' },
] as const
