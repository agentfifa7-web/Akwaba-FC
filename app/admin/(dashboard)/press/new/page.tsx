import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { createPressItemAction } from '@/lib/actions/admin-actions'
import { PRESS_ITEM_TYPES, PRESS_ITEM_TYPE_LABELS, type PressItemType } from '@/lib/constants'

const fields: FormFieldDef[] = [
  { name: 'title', label: 'Titre', type: 'text', required: true, span: 2 },
  { name: 'type', label: 'Type', type: 'select', required: true, options: PRESS_ITEM_TYPES.map((t) => ({ value: t, label: PRESS_ITEM_TYPE_LABELS[t as PressItemType] })) },
  { name: 'fileUrl', label: 'Lien du document / fichier (optionnel)', type: 'url', span: 2 },
  { name: 'description', label: 'Description', type: 'textarea', span: 2 },
]

export default function NewPressItemPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Nouvel élément presse</h1>
      <AdminForm fields={fields} action={createPressItemAction} cancelHref="/admin/press" />
    </div>
  )
}
