import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'

export const metadata = { title: 'Mentions légales' }

export default function MentionsLegalesPage() {
  return (
    <SiteChrome>
      <PageHeader kicker="Informations légales" title="Mentions" accentTitle="légales" />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl space-y-6 text-sm leading-6 text-foreground/80">
          <p>AKWABA FC — Association sportive, Stade de l'Amitié, Abidjan, Côte d'Ivoire.</p>
          <p>Directeur de la publication : Direction générale d'AKWABA FC.</p>
          <p>Ce site est édité et administré par AKWABA FC via sa plateforme numérique officielle. Toute reproduction, même partielle, est soumise à autorisation préalable du club.</p>
          <p>Pour toute question relative aux présentes mentions légales ou à la protection des données, contactez-nous via la page Contact.</p>
        </div>
      </section>
    </SiteChrome>
  )
}
