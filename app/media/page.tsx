import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/ui/motion'
import { getPressItems, getPressContacts, getMediaEvents } from '@/lib/data'
import { PRESS_ITEM_TYPES, PRESS_ITEM_TYPE_LABELS, type PressItemType } from '@/lib/constants'
import { formatDateFr } from '@/lib/format'
import { img } from '@/lib/images'
import { FileText } from 'lucide-react'

export const metadata = { title: 'Espace presse' }
export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const [items, contacts, events] = await Promise.all([getPressItems(), getPressContacts(), getMediaEvents()])
  const grouped = PRESS_ITEM_TYPES.map((type) => ({ type, list: items.filter((i) => i.type === type) })).filter((g) => g.list.length > 0)

  return (
    <SiteChrome>
      <PageHeader kicker="Presse" title="Espace" accentTitle="média" description="Communiqués, dossiers de presse, ressources visuelles et contacts pour les professionnels des médias." image={img('sport9', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-10">
            {grouped.map((group) => (
              <div key={group.type}>
                <Reveal>
                  <p className="mb-4 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">{PRESS_ITEM_TYPE_LABELS[group.type as PressItemType]}</p>
                </Reveal>
                <ul className="divide-y divide-border card-elevated">
                  {group.list.map((item) => (
                    <li key={item.id} className="flex items-center gap-4 p-4">
                      <FileText className="h-5 w-5 shrink-0 text-accent-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-bold">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground">{formatDateFr(item.publishedAt)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-10">
            <Reveal className="card-elevated p-6">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Contacts presse</p>
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <p className="text-sm font-bold">{contact.name}</p>
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{contact.role}</p>
                    <a href={`mailto:${contact.email}`} className="mt-2 block text-xs text-accent-foreground">{contact.email}</a>
                    <p className="text-xs text-muted-foreground">{contact.phone}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="card-elevated p-6">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Calendrier médias</p>
              <ul className="space-y-3">
                {events.map((event) => (
                  <li key={event.id} className="flex justify-between gap-3 text-sm">
                    <span>{event.title}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{formatDateFr(event.date, 'd MMM')}</span>
                  </li>
                ))}
                {events.length === 0 && <p className="text-sm text-muted-foreground">Aucun rendez-vous à venir.</p>}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </SiteChrome>
  )
}
