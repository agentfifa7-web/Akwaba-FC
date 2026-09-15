import Link from 'next/link'
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon, XIcon } from '@/components/ui/social-icons'

const columns = [
  {
    title: 'Le club',
    links: [
      { label: 'Notre histoire', href: '/club/histoire' },
      { label: 'Notre palmarès', href: '/club/palmares' },
      { label: 'Notre stade', href: '/club/stade' },
      { label: 'Staff & direction', href: '/club/staff' },
      { label: 'Rejoindre le club', href: '/recruitment' },
    ],
  },
  {
    title: 'Compétition',
    links: [
      { label: 'Match Center', href: '/matches' },
      { label: 'Classements', href: '/standings' },
      { label: 'Académie', href: '/academy' },
      { label: 'Devenir joueur', href: '/academy/devenir-joueur' },
    ],
  },
  {
    title: 'Club',
    links: [
      { label: 'Actualités', href: '/news' },
      { label: 'Club TV', href: '/club-tv' },
      { label: 'Galerie', href: '/gallery' },
      { label: 'Espace presse', href: '/media' },
    ],
  },
  {
    title: 'Supporters',
    links: [
      { label: 'Communauté', href: '/supporters' },
      { label: 'Billetterie', href: '/tickets' },
      { label: 'Boutique officielle', href: '/shop' },
      { label: 'Partenaires', href: '/partners' },
    ],
  },
]

const socials = [
  { icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
  { icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  { icon: TikTokIcon, href: 'https://tiktok.com', label: 'TikTok' },
  { icon: YouTubeIcon, href: 'https://youtube.com', label: 'YouTube' },
  { icon: XIcon, href: 'https://x.com', label: 'X' },
]

export function Footer() {
  return (
    <footer className="bg-[#05080D] px-5 pb-24 pt-16 text-white sm:px-8 lg:px-12 lg:pb-14">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-accent font-display text-[11px] font-bold text-accent">
                AFC
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em]">AKWABA FC</span>
            </div>
            <p className="max-w-xs text-sm leading-6 text-white/50">
              La passion nous unit.
              <br />
              La victoire nous rassemble.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/60 transition-colors hover:border-accent hover:text-accent"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.22em] text-accent">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[12px] text-white/60 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 pt-8 text-[10px] uppercase tracking-widest text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AKWABA FC — Tous droits réservés</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/media">Espace presse</Link>
            <Link href="/admin/login">Espace administration</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
