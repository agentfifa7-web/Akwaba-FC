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

export function avatar(name: string, size = 512) {
  const bg = ['071A2F', '0D2540', '10192A']
  const color = 'D4AF37'
  const seed = name.length % bg.length
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg[seed]}&color=${color}&size=${size}&bold=true&font-size=0.38`
}

export function logoAvatar(name: string, size = 256) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F4F6F8&color=071A2F&size=${size}&bold=true&font-size=0.33&length=3`
}
