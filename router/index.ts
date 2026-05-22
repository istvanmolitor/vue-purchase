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
    path: '/admin/purchase-extra-item-type',
    name: 'purchase-extra-item-type.index',
    component: () => import('../views/PurchaseExtraItemTypes.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/purchase-extra-item-type/create',
    name: 'purchase-extra-item-type.create',
    component: () => import('../views/PurchaseExtraItemTypeCreate.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/purchase-extra-item-type/:id/edit',
    name: 'purchase-extra-item-type.edit',
    component: () => import('../views/PurchaseExtraItemTypeEdit.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
]

export default purchaseRoutes

