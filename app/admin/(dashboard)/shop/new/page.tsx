import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { createShopProductAction } from '@/lib/actions/admin-actions'
import { SHOP_CATEGORIES, SHOP_CATEGORY_LABELS, type ShopCategory } from '@/lib/constants'

const fields: FormFieldDef[] = [
  { name: 'name', label: 'Nom du produit', type: 'text', required: true, span: 2 },
  { name: 'category', label: 'Catégorie', type: 'select', required: true, options: SHOP_CATEGORIES.map((c) => ({ value: c, label: SHOP_CATEGORY_LABELS[c as ShopCategory] })) },
  { name: 'price', label: 'Prix (FCFA)', type: 'number', required: true },
  { name: 'imageUrl', label: 'Image (URL)', type: 'url', required: true, span: 2 },
  { name: 'sizes', label: 'Tailles (séparées par des virgules)', type: 'text', placeholder: 'S, M, L, XL', span: 2 },
  { name: 'description', label: 'Description', type: 'textarea', span: 2 },
  { name: 'inStock', label: 'En stock', type: 'checkbox' },
]

export default function NewShopProductPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Nouveau produit</h1>
      <AdminForm fields={fields} action={createShopProductAction} cancelHref="/admin/shop" defaultValues={{ inStock: true }} />
    </div>
  )
}
