import { createApiClient } from '@user/services/apiClient'
import type { PaginatedResponse, SingleResponse } from './purchaseService'

const api = createApiClient()

export interface PurchaseExtraItemTypeFormData {
  name: string
  description?: string
}

export interface PurchaseExtraItemType {
  id: number
  name: string
  description?: string | null
}

export const purchaseExtraItemTypeService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<PurchaseExtraItemType>>('/api/admin/purchase/purchase-extra-item-types', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<PurchaseExtraItemType>>(`/api/admin/purchase/purchase-extra-item-types/${id}`)
  },
  create(data: PurchaseExtraItemTypeFormData) {
    return api.post<SingleResponse<PurchaseExtraItemType>>('/api/admin/purchase/purchase-extra-item-types', data)
  },
  update(id: number | string, data: PurchaseExtraItemTypeFormData) {
    return api.put<SingleResponse<PurchaseExtraItemType>>(`/api/admin/purchase/purchase-extra-item-types/${id}`, data)
  },
  delete(id: number | string) {
    return api.delete(`/api/admin/purchase/purchase-extra-item-types/${id}`)
  },
}



