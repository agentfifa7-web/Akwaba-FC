import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { createNotificationAction } from '@/lib/actions/admin-actions'

const fields: FormFieldDef[] = [
  { name: 'icon', label: 'Icône (emoji)', type: 'text', placeholder: '🔔' },
  { name: 'title', label: 'Titre', type: 'text', required: true, span: 2 },
  { name: 'body', label: 'Message', type: 'textarea', required: true, span: 2 },
  { name: 'url', label: 'Lien (optionnel)', type: 'url', span: 2 },
]

export default function NewNotificationPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Nouvelle notification</h1>
      <AdminForm fields={fields} action={createNotificationAction} cancelHref="/admin/notifications" defaultValues={{ icon: '🔔' }} />
    </div>
  )
}
