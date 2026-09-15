import Link from 'next/link'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { NewsCard } from '@/components/site/news-card'
import { Reveal } from '@/components/ui/motion'
import { getStaff, getNews } from '@/lib/data'
import { img } from '@/lib/images'
import { GraduationCap, School, Search, Users } from 'lucide-react'

export const metadata = { title: 'Centre de Formation' }
export const dynamic = 'force-dynamic'

const categories = [
  { label: 'U13', desc: 'Initiation et formation technique individuelle.' },
  { label: 'U15', desc: 'Développement tactique et préparation athlétique.' },
  { label: 'U17', desc: 'Intensification et détection vers le haut niveau.' },
  { label: 'U18', desc: 'Dernière étape avant l’intégration en Réserve.' },
]

const pillars = [
  { icon: Users, title: 'Formation mixte', desc: 'Un programme ouvert aux garçons et aux filles, du même niveau d’exigence.' },
  { icon: School, title: 'Programme scolaire', desc: 'Un suivi scolaire personnalisé, en partenariat avec des établissements partenaires.' },
  { icon: GraduationCap, title: 'Programme sportif', desc: 'Un plan de formation individualisé, encadré par des éducateurs diplômés.' },
  { icon: Search, title: 'Détection & recrutement', desc: 'Un réseau de détection sur tout le territoire et des sessions d’essais régulières.' },
]

export default async function AcademyPage() {
  const [educators, news] = await Promise.all([getStaff('ACADEMY'), getNews({ category: 'ACADEMY', take: 3 })])

  return (
    <SiteChrome>
      <PageHeader kicker="Formation" title="Centre de" accentTitle="Formation" description="Philosophie, catégories, infrastructures : découvrez l'Academy AKWABA FC, là où se construisent les talents de demain." image={img('youngTalents', 1800)} />

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Reveal className="max-w-3xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Notre philosophie</p>
            <p className="text-base leading-7 text-foreground/80">
              Le Centre de Formation AKWABA FC forme des footballeurs autant que des citoyens. Rigueur, humilité et sens du collectif guident chaque séance,
              avec un objectif clair : préparer nos jeunes talents à évoluer un jour sous le maillot de l'équipe première — et à réussir, sur et en dehors du terrain.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06} className="card-elevated p-6">
                <p.icon className="h-6 w-6 text-accent-foreground" />
                <h3 className="mt-4 font-display text-lg font-bold uppercase">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16">
            <Reveal>
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Nos catégories</p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((c, i) => (
                <Reveal key={c.label} delay={i * 0.06} className="bg-primary p-6 text-white">
                  <p className="font-display text-4xl font-black text-accent">{c.label}</p>
                  <p className="mt-3 text-sm text-white/70">{c.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <Reveal>
              <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Nos éducateurs</p>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {educators.map((member) => (
                <div key={member.id} className="card-elevated p-5 text-center">
                  <img src={member.photoUrl ?? ''} alt={member.name} className="mx-auto aspect-square w-20 rounded-full object-cover" />
                  <p className="mt-3 text-sm font-bold">{member.name}</p>
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          <Reveal className="mt-16 flex flex-col items-start justify-between gap-6 bg-accent p-8 text-primary sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-3xl font-black uppercase">Rejoindre l'Academy</h3>
              <p className="mt-2 max-w-md text-sm">Détection, recrutement, sessions d'essais — déposez la candidature de votre enfant dès aujourd'hui.</p>
            </div>
            <Link href="/academy/devenir-joueur" className="rounded-full shrink-0 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-primary/90">
              Devenir joueur →
            </Link>
          </Reveal>

          {news.length > 0 && (
            <div className="mt-16">
              <Reveal>
                <p className="mb-6 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Actualités de l'Academy</p>
              </Reveal>
              <div className="grid gap-5 sm:grid-cols-3">
                {news.map((article) => (
                  <NewsCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteChrome>
  )
}
