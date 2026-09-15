'use client'

import { useActionState } from 'react'
import { SiteChrome } from '@/components/site/site-chrome'
import { PageHeader } from '@/components/site/page-header'
import { Reveal } from '@/components/ui/motion'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Label } from '@/components/ui/input'
import { submitContactAction, type ActionState } from '@/lib/actions/public-actions'
import { img } from '@/lib/images'
import { MapPin, Mail, Phone } from 'lucide-react'

export default function ContactPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(submitContactAction, {})

  return (
    <SiteChrome>
      <PageHeader kicker="Écrivez-nous" title="Contact" description="Une question, une demande, un projet ? L'équipe AKWABA FC vous répond." image={img('stadium', 1800)} />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Reveal className="space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent-foreground" />
              <div>
                <p className="text-sm font-bold">Stade de l'Amitié</p>
                <p className="text-sm text-muted-foreground">Abidjan, Côte d'Ivoire</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="mt-1 h-5 w-5 shrink-0 text-accent-foreground" />
              <div>
                <p className="text-sm font-bold">contact@akwabafc.ci</p>
                <p className="text-sm text-muted-foreground">Réponse sous 48h ouvrées</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="mt-1 h-5 w-5 shrink-0 text-accent-foreground" />
              <div>
                <p className="text-sm font-bold">+225 07 00 00 00 00</p>
                <p className="text-sm text-muted-foreground">Du lundi au vendredi, 9h – 17h</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            {state.success ? (
              <div className="border-t-2 border-accent bg-card p-8 text-center">
                <p className="text-lg font-bold">{state.success}</p>
              </div>
            ) : (
              <form action={formAction} className="space-y-5 border border-border bg-card p-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input id="fullName" name="fullName" required />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Sujet</Label>
                  <Input id="subject" name="subject" required />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" rows={6} required />
                </div>
                {state.error && <p className="text-xs font-semibold text-destructive">{state.error}</p>}
                <Button type="submit" disabled={pending} size="lg">
                  {pending ? 'Envoi…' : 'Envoyer le message'}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </SiteChrome>
  )
}
