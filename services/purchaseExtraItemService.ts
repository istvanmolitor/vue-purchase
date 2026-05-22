import { createApiClient } from '@user/services/apiClient'
import type { PaginatedResponse, PurchaseExtraItem, SingleResponse } from './purchaseService'

const api = createApiClient()

export interface PurchaseExtraItemFormData {
  name: string
  description?: string
}

export const purchaseExtraItemService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<PurchaseExtraItem>>('/api/admin/purchase/purchase-extra-items', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<PurchaseExtraItem>>(`/api/admin/purchase/purchase-extra-items/${id}`)
  },
  create(data: PurchaseExtraItemFormData) {
    return api.post<SingleResponse<PurchaseExtraItem>>('/api/admin/purchase/purchase-extra-items', data)
  },
  update(id: number | string, data: PurchaseExtraItemFormData) {
    return api.put<SingleResponse<PurchaseExtraItem>>(`/api/admin/purchase/purchase-extra-items/${id}`, data)
  },
  delete(id: number | string) {
    return api.delete(`/api/admin/purchase/purchase-extra-items/${id}`)
  },
}

