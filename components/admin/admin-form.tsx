'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select, Label, Checkbox } from '@/components/ui/input'

export type FormFieldDef =
  | { name: string; label: string; type: 'text' | 'url' | 'email' | 'number' | 'date' | 'datetime-local' | 'tel'; required?: boolean; placeholder?: string; help?: string; span?: 1 | 2 }
  | { name: string; label: string; type: 'textarea'; required?: boolean; placeholder?: string; rows?: number; help?: string; span?: 1 | 2 }
  | { name: string; label: string; type: 'select'; options: { value: string; label: string }[]; required?: boolean; help?: string; span?: 1 | 2 }
  | { name: string; label: string; type: 'checkbox'; help?: string; span?: 1 | 2 }

export type ActionState = { error?: string }

export function AdminForm({
  fields,
  action,
  defaultValues = {},
  submitLabel = 'Enregistrer',
  cancelHref,
}: {
  fields: FormFieldDef[]
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: Record<string, unknown>
  submitLabel?: string
  cancelHref: string
}) {
  const [state, formAction, pending] = useActionState(action, {})

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const value = defaultValues[field.name]
          const wrapClass = field.span === 2 ? 'sm:col-span-2' : ''

          if (field.type === 'checkbox') {
            return (
              <div key={field.name} className={`flex items-center gap-3 ${wrapClass}`}>
                <Checkbox name={field.name} id={field.name} defaultChecked={Boolean(value)} />
                <Label htmlFor={field.name} className="mb-0">
                  {field.label}
                </Label>
              </div>
            )
          }

          if (field.type === 'select') {
            return (
              <div key={field.name} className={wrapClass}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Select name={field.name} id={field.name} required={field.required} defaultValue={(value as string) ?? ''}>
                  <option value="" disabled>
                    Sélectionner…
                  </option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
                {field.help && <p className="mt-1 text-[11px] text-muted-foreground">{field.help}</p>}
              </div>
            )
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.name} className={wrapClass}>
                <Label htmlFor={field.name}>{field.label}</Label>
                <Textarea
                  name={field.name}
                  id={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  rows={field.rows ?? 4}
                  defaultValue={(value as string) ?? ''}
                />
                {field.help && <p className="mt-1 text-[11px] text-muted-foreground">{field.help}</p>}
              </div>
            )
          }

          return (
            <div key={field.name} className={wrapClass}>
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                type={field.type}
                name={field.name}
                id={field.name}
                required={field.required}
                placeholder={field.placeholder}
                defaultValue={(value as string) ?? ''}
              />
              {field.help && <p className="mt-1 text-[11px] text-muted-foreground">{field.help}</p>}
            </div>
          )
        })}
      </div>

      {state.error && (
        <p role="alert" className="border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={pending}>
          {pending ? 'Enregistrement…' : submitLabel}
        </Button>
        <Link href={cancelHref} className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
          Annuler
        </Link>
      </div>
    </form>
  )
}
