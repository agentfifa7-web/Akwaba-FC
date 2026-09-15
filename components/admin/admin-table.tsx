import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { DeleteButton } from '@/components/admin/delete-button'

export type AdminColumn<T> = {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
}

export function AdminTable<T extends { id: string }>({
  title,
  description,
  newHref,
  newLabel = 'Ajouter',
  columns,
  rows,
  editHref,
  deleteAction,
  emptyLabel = 'Aucun élément pour le moment.',
}: {
  title: string
  description?: string
  newHref?: string
  newLabel?: string
  columns: AdminColumn<T>[]
  rows: T[]
  editHref?: (row: T) => string
  deleteAction?: (id: string) => Promise<void>
  emptyLabel?: string
}) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {newHref && (
          <Link href={newHref}>
            <span className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> {newLabel}
            </span>
          </Link>
        )}
      </div>

      <div className="overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 ${col.className ?? ''}`}>
                  {col.label}
                </th>
              ))}
              {(editHref || deleteAction) && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  {emptyLabel}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-b-0 hover:bg-secondary/60">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 align-middle ${col.className ?? ''}`}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
                {(editHref || deleteAction) && (
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {editHref && (
                        <Link href={editHref(row)} className="text-muted-foreground hover:text-accent-foreground" aria-label="Modifier">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      )}
                      {deleteAction && <DeleteButton id={row.id} action={deleteAction} />}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
