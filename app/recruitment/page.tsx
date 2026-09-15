'use client'

import { useActionState } from 'react'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/ui/motion'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select, Label } from '@/components/ui/input'
import { submitRecruitmentAction, type ActionState } from '@/lib/actions/public-actions'
import { RECRUITMENT_CATEGORIES, RECRUITMENT_CATEGORY_LABELS, type RecruitmentCategory } from '@/lib/constants'
import { img } from '@/lib/images'

export default function RecruitmentPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(submitRecruitmentAction, {})

  return (
    <SiteChrome>
      <PageHeader kicker="Carrières" title="Rejoindre" accentTitle="le club" description="Joueurs, éducateurs, staff, administration, bénévoles : AKWABA FC recrute toute l'année." image={img('sport10', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[.25em] text-muted-foreground">Pourquoi nous rejoindre ?</p>
            <p className="mt-4 text-sm leading-6 text-foreground/80">
              AKWABA FC est un club en croissance, porté par une ambition sportive forte et un projet humain exigeant. Que vous soyez joueur, éducateur, membre du staff,
              professionnel de l'administration ou bénévole passionné, il y a une place pour vous dans la famille AKWABA.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {RECRUITMENT_CATEGORIES.map((c) => (
                <li key={c} className="border-l-2 border-accent pl-4">
                  {RECRUITMENT_CATEGORY_LABELS[c as RecruitmentCategory]}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            {state.success ? (
              <div className="border-t-2 border-accent bg-card p-8 text-center">
                <p className="text-lg font-bold">{state.success}</p>
              </div>
            ) : (
              <form action={formAction} className="space-y-5 border border-border bg-card p-7">
                <div>
                  <Label htmlFor="category">Domaine</Label>
                  <Select id="category" name="category" required defaultValue="">
                    <option value="" disabled>Sélectionner…</option>
                    {RECRUITMENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{RECRUITMENT_CATEGORY_LABELS[c as RecruitmentCategory]}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input id="fullName" name="fullName" required />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cvUrl">Lien CV / portfolio (optionnel)</Label>
                  <Input id="cvUrl" name="cvUrl" type="url" placeholder="https://…" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" rows={5} placeholder="Présentez-vous en quelques lignes…" />
                </div>
                {state.error && <p className="text-xs font-semibold text-destructive">{state.error}</p>}
                <Button type="submit" disabled={pending} size="lg">
                  {pending ? 'Envoi…' : 'Envoyer ma candidature'}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </SiteChrome>
  )
}
