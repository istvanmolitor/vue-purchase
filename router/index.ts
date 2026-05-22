import type { RouteRecordRaw } from 'vue-router'

const purchaseRoutes: RouteRecordRaw[] = [
  {
    path: '/admin/purchase',
    name: 'purchase.index',
    component: () => import('../views/Purchases.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/purchase/create',
    name: 'purchase.create',
    component: () => import('../views/PurchaseCreate.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/purchase/:id',
    name: 'purchase.show',
    component: () => import('../views/PurchaseShow.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/purchase/:id/edit',
    name: 'purchase.edit',
    component: () => import('../views/PurchaseEdit.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/purchase-status',
    name: 'purchase-status.index',
    component: () => import('../views/PurchaseStatuses.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/purchase-status/create',
    name: 'purchase-status.create',
    component: () => import('../views/PurchaseStatusCreate.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/purchase-status/:id/edit',
    name: 'purchase-status.edit',
    component: () => import('../views/PurchaseStatusEdit.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/purchase-extra-item',
    name: 'purchase-extra-item.index',
    component: () => import('../views/PurchaseExtraItems.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/purchase-extra-item/create',
    name: 'purchase-extra-item.create',
    component: () => import('../views/PurchaseExtraItemCreate.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/purchase-extra-item/:id/edit',
    name: 'purchase-extra-item.edit',
    component: () => import('../views/PurchaseExtraItemEdit.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
]

export default purchaseRoutes

