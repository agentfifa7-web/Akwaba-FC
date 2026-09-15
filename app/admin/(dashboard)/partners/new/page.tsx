import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { createPartnerAction } from '@/lib/actions/admin-actions'
import { PARTNER_CATEGORIES, PARTNER_CATEGORY_LABELS, type PartnerCategory } from '@/lib/constants'

const fields: FormFieldDef[] = [
  { name: 'name', label: 'Nom', type: 'text', required: true },
  { name: 'category', label: 'Catégorie', type: 'select', required: true, options: PARTNER_CATEGORIES.map((c) => ({ value: c, label: PARTNER_CATEGORY_LABELS[c as PartnerCategory] })) },
  { name: 'logoUrl', label: 'Logo (URL)', type: 'url', required: true, span: 2 },
  { name: 'websiteUrl', label: 'Site web', type: 'url', span: 2 },
  { name: 'description', label: 'Description', type: 'textarea', span: 2 },
]

export default function NewPartnerPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Nouveau partenaire</h1>
      <AdminForm fields={fields} action={createPartnerAction} cancelHref="/admin/partners" />
    </div>
  )
}
