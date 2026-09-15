import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminForm, type FormFieldDef } from '@/components/admin/admin-form'
import { updateShopProductAction } from '@/lib/actions/admin-actions'
import { SHOP_CATEGORIES, SHOP_CATEGORY_LABELS, type ShopCategory } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const fields: FormFieldDef[] = [
  { name: 'name', label: 'Nom du produit', type: 'text', required: true, span: 2 },
  { name: 'category', label: 'Catégorie', type: 'select', required: true, options: SHOP_CATEGORIES.map((c) => ({ value: c, label: SHOP_CATEGORY_LABELS[c as ShopCategory] })) },
  { name: 'price', label: 'Prix (FCFA)', type: 'number', required: true },
  { name: 'imageUrl', label: 'Image (URL)', type: 'url', required: true, span: 2 },
  { name: 'sizes', label: 'Tailles (séparées par des virgules)', type: 'text', span: 2 },
  { name: 'description', label: 'Description', type: 'textarea', span: 2 },
  { name: 'inStock', label: 'En stock', type: 'checkbox' },
]

export default async function EditShopProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.shopProduct.findUnique({ where: { id } })
  if (!product) notFound()
  const sizes = Array.isArray(product.sizes) ? (product.sizes as string[]).join(', ') : ''

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">Modifier {product.name}</h1>
      <AdminForm fields={fields} action={updateShopProductAction.bind(null, id)} cancelHref="/admin/shop" defaultValues={{ ...product, sizes }} />
    </div>
  )
}
