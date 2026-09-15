import { prisma } from '@/lib/prisma'
import { AdminTable } from '@/components/admin/admin-table'
import { deleteShopProductAction } from '@/lib/actions/admin-actions'
import { SHOP_CATEGORY_LABELS, type ShopCategory } from '@/lib/constants'
import { formatCFA, formatDateShort } from '@/lib/format'
import { OrderStatusSelect } from '@/components/admin/order-status-select'
import { updateShopOrderStatusAction } from '@/lib/actions/admin-actions'

export const dynamic = 'force-dynamic'

export default async function AdminShopPage() {
  const [products, orders] = await Promise.all([
    prisma.shopProduct.findMany({ orderBy: { name: 'asc' } }),
    prisma.shopOrder.findMany({ orderBy: { createdAt: 'desc' }, take: 30 }),
  ])

  return (
    <div className="space-y-12">
      <AdminTable
        title="Boutique"
        description="Gérez le catalogue de produits officiels AKWABA FC."
        newHref="/admin/shop/new"
        columns={[
          { key: 'image', label: 'Photo', render: (r) => <img src={r.imageUrl} alt="" className="h-12 w-12 object-cover" /> },
          { key: 'name', label: 'Produit' },
          { key: 'category', label: 'Catégorie', render: (r) => SHOP_CATEGORY_LABELS[r.category as ShopCategory] ?? r.category },
          { key: 'price', label: 'Prix', render: (r) => formatCFA(r.price) },
          { key: 'inStock', label: 'Stock', render: (r) => (r.inStock ? 'Disponible' : 'Rupture') },
        ]}
        rows={products}
        editHref={(r) => `/admin/shop/${r.id}`}
        deleteAction={deleteShopProductAction}
      />

      <div>
        <h2 className="mb-4 font-display text-xl font-bold uppercase text-foreground">Commandes récentes</h2>
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">
                    <p className="font-semibold">{order.fullName}</p>
                    <p className="text-[11px] text-muted-foreground">{order.email}</p>
                  </td>
                  <td className="px-4 py-3">{formatCFA(order.total)}</td>
                  <td className="px-4 py-3">{formatDateShort(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect id={order.id} status={order.status} action={updateShopOrderStatusAction} />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Aucune commande pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
