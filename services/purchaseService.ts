import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface PurchaseOption {
  id: number
  name: string
  code?: string
  symbol?: string
  currency_id?: number | null
  is_symbol_first?: boolean
  state?: number
  description?: string | null
}

export interface PurchaseItem {
  id?: number
  product_id: number
  quantity: number
  price?: number | null
  comment?: string | null
  product?: {
    id: number
    name: string
  }
}

export interface Purchase {
  id?: number
  purchase_status_id: number
  url?: string | null
  customer_id: number
  warehouse_id: number
  comment?: string | null
  purchase_date?: string | null
  expected_delivery_date?: string | null
  delivery_date?: string | null
  total_price?: number | null
  currency_id: number
  purchase_items: PurchaseItem[]
  customer?: PurchaseOption
  currency?: PurchaseOption
  warehouse?: PurchaseOption
  purchase_status?: PurchaseStatus
  created_at?: string
  updated_at?: string
}

export interface PurchaseStatus {
  id: number
  name: string
  state: number
  description?: string | null
}

export interface PurchaseExtraItemType {
  id: number
  name: string
  description?: string | null
}

export interface PurchaseLog {
  id: number
  purchase_status: string | null
  user: string | null
  comment: string | null
  status_changed_at: string | null
}

export interface PurchaseFormData {
  purchase_status_id: number
  url?: string
  customer_id: number
  warehouse_id: number
  comment?: string
  purchase_date?: string
  expected_delivery_date?: string
  delivery_date?: string
  total_price?: number | null
  currency_id: number
  purchase_items: PurchaseItem[]
}

export interface PurchaseFormOptions {
  customers: PurchaseOption[]
  currencies: PurchaseOption[]
  warehouses: PurchaseOption[]
  purchase_statuses: PurchaseStatus[]
  products: PurchaseOption[]
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  filters?: {
    search?: string
    sort?: string
    direction?: string
  }
}

export interface SingleResponse<T> {
  data: T
}

export const purchaseService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<Purchase>>('/api/admin/purchase/purchases', { params })
  },
  getById(id: number | string) {
    return api.get<{ data: Purchase; logs: PurchaseLog[] }>(`/api/admin/purchase/purchases/${id}`)
  },
  getCreateData() {
    return api.get<PurchaseFormOptions>('/api/admin/purchase/purchases/create')
  },
  getEditData(id: number | string) {
    return api.get<{ data: Purchase; logs: PurchaseLog[] } & PurchaseFormOptions>(`/api/admin/purchase/purchases/${id}/edit`)
  },
  create(purchase: PurchaseFormData) {
    return api.post<SingleResponse<Purchase>>('/api/admin/purchase/purchases', purchase)
  },
  update(id: number | string, purchase: PurchaseFormData) {
    return api.put<SingleResponse<Purchase>>(`/api/admin/purchase/purchases/${id}`, purchase)
  },
  delete(id: number | string) {
    return api.delete(`/api/admin/purchase/purchases/${id}`)
  },
  close(id: number | string, delivery_date?: string) {
    return api.post<SingleResponse<Purchase>>(`/api/admin/purchase/purchases/${id}/close`, {
      delivery_date,
    })
  },
  updateStatus(id: number | string, purchase_status_id: number, comment?: string) {
    return api.post<SingleResponse<Purchase>>(`/api/admin/purchase/purchases/${id}/status`, {
      purchase_status_id,
      comment,
    })
  },
}

