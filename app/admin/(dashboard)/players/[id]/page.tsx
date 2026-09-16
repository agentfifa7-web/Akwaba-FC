import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { DeleteButton } from '@/components/admin/delete-button'
import {
  updatePlayerAction,
  addPlayerMediaAction,
  deletePlayerMediaAction,
  addPlayerProgressAction,
  deletePlayerProgressAction,
} from '@/lib/actions/admin-actions'
import {
  POSITIONS,
  POSITION_LABELS,
  TEAM_SLUGS,
  TEAM_LABELS,
  PLAYER_MEDIA_TYPES,
  PROGRESS_ENTRY_TYPE_LABELS,
  type Position,
  type TeamSlug,
} from '@/lib/constants'
import { format } from 'date-fns'
import { formatDateFr } from '@/lib/format'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

const fields: FormFieldDef[] = [
  { name: 'firstName', label: 'Prénom', type: 'text', required: true },
  { name: 'lastName', label: 'Nom', type: 'text', required: true },
  { name: 'teamSlug', label: 'Équipe', type: 'select', required: true, options: TEAM_SLUGS.map((t) => ({ value: t, label: TEAM_LABELS[t as TeamSlug] })) },
  { name: 'number', label: 'Numéro', type: 'number', required: true },
  { name: 'position', label: 'Poste', type: 'select', required: true, options: POSITIONS.map((p) => ({ value: p, label: POSITION_LABELS[p as Position] })) },
  { name: 'birthDate', label: 'Date de naissance', type: 'date', required: true },
  { name: 'nationality', label: 'Nationalité', type: 'text', required: true },
  { name: 'height', label: 'Taille (cm)', type: 'number' },
  {
    name: 'preferredFoot',
    label: 'Pied préféré',
    type: 'select',
    options: [
      { value: 'GAUCHE', label: 'Gauche' },
      { value: 'DROIT', label: 'Droit' },
      { value: 'AMBIDEXTRE', label: 'Ambidextre' },
    ],
  },
  { name: 'photoUrl', label: 'Photo (URL)', type: 'url', span: 2 },
  { name: 'highlightVideoUrl', label: 'Vidéo highlight (URL, optionnel — utilisée en fond de la fiche joueur)', type: 'url', span: 2 },
  { name: 'bio', label: 'Biographie', type: 'textarea', span: 2 },
  { name: 'captain', label: 'Capitaine', type: 'checkbox' },
  { name: 'active', label: 'Actif dans l’effectif', type: 'checkbox' },
  { name: 'appearances', label: 'Apparitions (recalculé auto. via feuilles de match)', type: 'number' },
  { name: 'goals', label: 'Buts', type: 'number' },
  { name: 'assists', label: 'Passes décisives', type: 'number' },
  { name: 'minutes', label: 'Minutes jouées', type: 'number' },
  { name: 'yellowCards', label: 'Cartons jaunes', type: 'number' },
  { name: 'redCards', label: 'Cartons rouges', type: 'number' },
  { name: 'pace', label: 'Vitesse (0-100)', type: 'number', help: 'Attributs radar affichés sur la fiche joueur.' },
  { name: 'shooting', label: 'Tir (0-100)', type: 'number' },
  { name: 'passing', label: 'Passe (0-100)', type: 'number' },
  { name: 'dribbling', label: 'Dribble (0-100)', type: 'number' },
  { name: 'defending', label: 'Défense (0-100)', type: 'number' },
  { name: 'physical', label: 'Physique (0-100)', type: 'number' },
]

export default async function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [player, media, progress] = await Promise.all([
    prisma.player.findUnique({ where: { id }, include: { team: true } }),
    prisma.playerMedia.findMany({ where: { playerId: id }, orderBy: { order: 'asc' } }),
    prisma.playerProgressEntry.findMany({ where: { playerId: id }, orderBy: { date: 'desc' } }),
  ])
  if (!player) notFound()

  const attrs = (player.attributes as Record<string, number> | null) ?? {}
  const addMedia = addPlayerMediaAction.bind(null, id)
  const addProgress = addPlayerProgressAction.bind(null, id)

  return (
    <div className="space-y-12">
      <div>
        <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
          Modifier {player.firstName} {player.lastName}
        </h1>
        <AdminForm
          fields={fields}
          action={updatePlayerAction.bind(null, id)}
          cancelHref="/admin/players"
          defaultValues={{
            ...player,
            teamSlug: player.team.slug,
            birthDate: format(player.birthDate, 'yyyy-MM-dd'),
            pace: attrs.pace ?? 60,
            shooting: attrs.shooting ?? 60,
            passing: attrs.passing ?? 60,
            dribbling: attrs.dribbling ?? 60,
            defending: attrs.defending ?? 60,
            physical: attrs.physical ?? 60,
          }}
        />
      </div>

      <div>
        <h2 className="mb-2 font-display text-xl font-bold uppercase text-foreground">Photos & vidéos</h2>
        <p className="mb-5 text-xs text-muted-foreground">
          3 à 5 photos et quelques vidéos (liens YouTube/Vimeo ou fichier .mp4) affichées sur la fiche publique du joueur.
        </p>
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          {media.map((m) => (
            <div key={m.id} className="flex items-center gap-3 card-elevated p-3">
              {m.type === 'PHOTO' ? (
                <img src={m.url} alt={m.caption ?? ''} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-[10px] font-bold uppercase text-muted-foreground">
                  Vidéo
                </span>
              )}
              <span className="flex-1 truncate text-xs text-muted-foreground">{m.caption || m.url}</span>
              <DeleteButton id={m.id} action={deletePlayerMediaAction} />
            </div>
          ))}
          {media.length === 0 && <p className="text-sm text-muted-foreground sm:col-span-2">Aucun média pour le moment.</p>}
        </div>
        <form action={addMedia} className="flex flex-wrap items-end gap-3 border-t border-border pt-5">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</label>
            <select name="type" required className="min-h-11 border border-border bg-background px-3 text-sm">
              {PLAYER_MEDIA_TYPES.map((t) => (
                <option key={t} value={t}>{t === 'PHOTO' ? 'Photo' : 'Vidéo'}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">URL</label>
            <input name="url" type="url" required className="min-h-11 w-full border border-border bg-background px-3 text-sm" placeholder="https://…" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Légende (optionnel)</label>
            <input name="caption" className="min-h-11 w-full border border-border bg-background px-3 text-sm" />
          </div>
          <button type="submit" className="rounded-full flex items-center gap-2 bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-2 font-display text-xl font-bold uppercase text-foreground">Courbe de progression</h2>
        <p className="mb-5 text-xs text-muted-foreground">
          Les points « Match » sont générés automatiquement depuis les feuilles de match. Ajoutez ici les évaluations
          d&apos;entraînement.
        </p>
        <div className="mb-5 space-y-2">
          {progress.map((p) => (
            <div key={p.id} className="flex items-center gap-4 card-elevated p-3">
              <span className="w-24 shrink-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{formatDateFr(p.date, 'd MMM yyyy')}</span>
              <span className="w-20 shrink-0 rounded-full bg-secondary px-2.5 py-1 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {PROGRESS_ENTRY_TYPE_LABELS[p.type as 'MATCH' | 'TRAINING']}
              </span>
              <span className="font-display text-lg font-bold text-accent-foreground">{p.rating.toFixed(1)}/10</span>
              {p.note && <span className="flex-1 truncate text-xs text-muted-foreground">{p.note}</span>}
              {p.type === 'TRAINING' && <DeleteButton id={p.id} action={deletePlayerProgressAction} />}
            </div>
          ))}
          {progress.length === 0 && <p className="text-sm text-muted-foreground">Aucun point de progression pour le moment.</p>}
        </div>
        <form action={addProgress} className="flex flex-wrap items-end gap-3 border-t border-border pt-5">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date</label>
            <input name="date" type="date" required defaultValue={format(new Date(), 'yyyy-MM-dd')} className="min-h-11 border border-border bg-background px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Note /10</label>
            <input name="rating" type="number" min={0} max={10} step={0.1} required className="min-h-11 w-24 border border-border bg-background px-3 text-sm" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Note libre (optionnel)</label>
            <input name="note" className="min-h-11 w-full border border-border bg-background px-3 text-sm" placeholder="Ex : très bon entraînement, travail technique…" />
          </div>
          <button type="submit" className="rounded-full flex items-center gap-2 bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </form>
      </div>
    </div>
  )
}
