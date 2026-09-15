'use client'

import { useActionState } from 'react'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/ui/motion'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select, Label, Checkbox } from '@/components/ui/input'
import { submitAcademyApplicationAction, type ActionState } from '@/lib/actions/public-actions'
import { ACADEMY_CATEGORIES, POSITIONS, POSITION_LABELS, type Position } from '@/lib/constants'
import { img } from '@/lib/images'

export default function BecomePlayerPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(submitAcademyApplicationAction, {})

  return (
    <SiteChrome>
      <PageHeader kicker="Centre de Formation" title="Devenir" accentTitle="joueur" description="Déposez la candidature de votre enfant pour rejoindre l'Academy AKWABA FC." image={img('youngTalents', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          {state.success ? (
            <Reveal className="border-t-2 border-accent bg-card p-8 text-center">
              <p className="text-lg font-bold text-foreground">{state.success}</p>
            </Reveal>
          ) : (
            <Reveal>
              <form action={formAction} className="space-y-8">
                <div>
                  <h2 className="mb-5 font-display text-xl font-bold uppercase text-primary">Informations sur le candidat</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                    <div>
                      <Label htmlFor="birthDate">Date de naissance</Label>
                      <Input id="birthDate" name="birthDate" type="date" required />
                    </div>
                    <div>
                      <Label htmlFor="nationality">Nationalité</Label>
                      <Input id="nationality" name="nationality" required defaultValue="Côte d'Ivoire" />
                    </div>
                    <div>
                      <Label htmlFor="category">Catégorie</Label>
                      <Select id="category" name="category" required defaultValue="">
                        <option value="" disabled>Sélectionner…</option>
                        {ACADEMY_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="position">Poste</Label>
                      <Select id="position" name="position" required defaultValue="">
                        <option value="" disabled>Sélectionner…</option>
                        {POSITIONS.map((p) => (
                          <option key={p} value={p}>{POSITION_LABELS[p as Position]}</option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="preferredFoot">Pied préféré</Label>
                      <Select id="preferredFoot" name="preferredFoot" defaultValue="">
                        <option value="" disabled>Sélectionner…</option>
                        <option value="GAUCHE">Gauche</option>
                        <option value="DROIT">Droit</option>
                        <option value="AMBIDEXTRE">Ambidextre</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="height">Taille (cm)</Label>
                      <Input id="height" name="height" type="number" min={100} max={220} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="videoUrl">Lien vidéo (optionnel)</Label>
                      <Input id="videoUrl" name="videoUrl" type="url" placeholder="https://…" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-8">
                  <h2 className="mb-5 font-display text-xl font-bold uppercase text-primary">Coordonnées du parent / tuteur</h2>
                  <p className="mb-5 text-xs text-muted-foreground">Le candidat étant mineur, les coordonnées d'un parent ou tuteur légal ainsi que son consentement explicite sont obligatoires.</p>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="parentName">Nom complet du parent / tuteur</Label>
                      <Input id="parentName" name="parentName" required />
                    </div>
                    <div>
                      <Label htmlFor="parentEmail">E-mail du parent / tuteur</Label>
                      <Input id="parentEmail" name="parentEmail" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="parentPhone">Téléphone du parent / tuteur</Label>
                      <Input id="parentPhone" name="parentPhone" type="tel" required />
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="message">Message (optionnel)</Label>
                      <Textarea id="message" name="message" rows={4} />
                    </div>
                  </div>
                  <div className="mt-5 flex items-start gap-3 border border-border bg-secondary p-4">
                    <Checkbox id="parentalConsent" name="parentalConsent" required className="mt-0.5" />
                    <Label htmlFor="parentalConsent" className="mb-0 normal-case tracking-normal text-foreground">
                      En tant que parent ou tuteur légal, j'autorise AKWABA FC à traiter les données de mon enfant dans le cadre de cette candidature, conformément à sa politique de protection des données des mineurs.
                    </Label>
                  </div>
                </div>

                {state.error && (
                  <p role="alert" className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive">
                    {state.error}
                  </p>
                )}

                <Button type="submit" variant="accent" disabled={pending} size="lg">
                  {pending ? 'Envoi…' : 'Envoyer ma candidature'}
                </Button>
              </form>
            </Reveal>
          )}
        </div>
      </section>
    </SiteChrome>
  )
}
