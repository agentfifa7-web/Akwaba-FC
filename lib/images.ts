// Bibliothèque d'images d'illustration (Unsplash) utilisée pour peupler la
// démo. Un vrai club remplacera ces visuels par ses propres photos via le
// CMS (Actualités, Galerie, Vidéos, Joueurs, Staff, Partenaires…).
const IDS = {
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
} as const

export function img(id: keyof typeof IDS, width = 1200, quality = 85) {
  return `https://images.unsplash.com/photo-${IDS[id]}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export const HERO_IMAGES = ['teamPitch', 'clubIdentity', 'training', 'stadium', 'celebration'] as const
export const GALLERY_POOL = Object.keys(IDS) as (keyof typeof IDS)[]

// Dégradés de secours élégants (navy → bleu nuit plus clair, ponctués d'un
// reflet bronze) pour les portraits sans photo — bien plus chic qu'un aplat.
const PORTRAIT_GRADIENTS = [
  ['0a1f3d', '17417a'],
  ['0d2540', '1d3f70'],
  ['10192a', '223d68'],
  ['081b33', '2c4f8c'],
  ['0e2038', '35507e'],
]

export function avatar(name: string, size = 512) {
  const pair = PORTRAIT_GRADIENTS[name.length % PORTRAIT_GRADIENTS.length]
  const params = new URLSearchParams({
    seed: name,
    size: String(size),
    backgroundType: 'gradientLinear',
    backgroundColor: pair.join(','),
    backgroundRotation: '135',
    radius: '0',
    fontWeight: '700',
    fontSize: '36',
    textColor: 'd4af37',
  })
  return `https://api.dicebear.com/9.x/initials/svg?${params.toString()}`
}

export function logoAvatar(name: string, size = 256) {
  const params = new URLSearchParams({
    seed: name,
    size: String(size),
    backgroundType: 'gradientLinear',
    backgroundColor: 'f4f6f8,e4e9ee',
    backgroundRotation: '135',
    radius: '0',
    fontWeight: '700',
    fontSize: '32',
    textColor: '071a2f',
  })
  return `https://api.dicebear.com/9.x/initials/svg?${params.toString()}`
}
