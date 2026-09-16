import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { ClubSideNav } from '@/components/site/club-side-nav'
import { Reveal } from '@/components/ui/motion'
import { getHonours, getStaff } from '@/lib/data'
import { img } from '@/lib/images'

export const metadata = { title: 'Le club' }
export const dynamic = 'force-dynamic'

const quickLinks = [
  { title: 'Notre histoire', href: '/club/histoire', desc: 'De la fondation en 2005 à aujourd’hui.' },
  { title: 'Nos valeurs', href: '/club/valeurs', desc: 'L’hospitalité, l’exigence, la famille.' },
  { title: 'Notre palmarès', href: '/club/palmares', desc: 'Une frise interactive de nos titres.' },
  { title: 'Notre stade', href: '/club/stade', desc: "Stade de l'Amitié · Abidjan." },
  { title: 'Gouvernance', href: '/club/gouvernance', desc: 'Direction et organisation du club.' },
  { title: 'Staff & direction', href: '/club/staff', desc: 'Toutes les équipes derrière AKWABA FC.' },
]

export default async function ClubPage() {
  const [honours, direction] = await Promise.all([getHonours(), getStaff('DIRECTION')])

  return (
    <SiteChrome>
      <PageHeader kicker="AKWABA FC" title="Le" accentTitle="club" description="Une histoire, une identité, une ambition partagée par toute une famille." image={img('clubIdentity', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-12 lg:flex-row">
          <ClubSideNav />
          <div className="flex-1 space-y-14">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {quickLinks.map((link, i) => (
                <Reveal key={link.href} delay={i * 0.05}>
                  <Link href={link.href} className="card-elevated card-elevated-hover block h-full p-6">
                    <h3 className="font-display text-xl font-bold uppercase text-foreground">{link.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{link.desc}</p>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal className="border-t border-border pt-10">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">En bref</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="font-display text-4xl font-black text-accent-foreground">{honours.length}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Titres majeurs</p>
                </div>
                <div>
                  <p className="font-display text-4xl font-black text-accent-foreground">2005</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Fondation</p>
                </div>
                <div>
                  <p className="font-display text-4xl font-black text-accent-foreground">12 000</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Places au stade</p>
                </div>
                <div>
                  <p className="font-display text-4xl font-black text-accent-foreground">4</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Équipes du club</p>
                </div>
              </div>
            </Reveal>

            <Reveal className="border-t border-border pt-10">
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">La direction du club</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {direction.map((member) => (
                  <Link key={member.id} href={`/staff/${member.slug}`} className="group text-center">
                    <img src={member.photoUrl ?? ''} alt={member.name} className="mx-auto aspect-square w-24 rounded-full object-cover shadow-sm transition-transform duration-500 group-hover:scale-105" />
                    <p className="mt-3 text-sm font-bold text-foreground group-hover:text-accent-foreground">{member.name}</p>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{member.role}</p>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
