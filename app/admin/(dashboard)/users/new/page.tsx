import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { createUserAction } from '@/lib/actions/admin-actions'
import { ROLES, ROLE_LABELS, type Role } from '@/lib/constants'

const fields: FormFieldDef[] = [
  { name: 'name', label: 'Nom complet', type: 'text', required: true },
  { name: 'email', label: 'Adresse e-mail', type: 'email', required: true },
  { name: 'role', label: 'Rôle', type: 'select', required: true, options: ROLES.map((r) => ({ value: r, label: ROLE_LABELS[r as Role] })) },
  { name: 'password', label: 'Mot de passe temporaire', type: 'text', required: true, help: '6 caractères minimum. À communiquer à la personne concernée.' },
]

export default function NewUserPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Nouvel utilisateur</h1>
      <AdminForm fields={fields} action={createUserAction} cancelHref="/admin/users" />
    </div>
  )
}
