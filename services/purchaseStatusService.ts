import { createApiClient } from '@user/services/apiClient'
import type { PaginatedResponse, PurchaseStatus, SingleResponse } from './purchaseService'

const api = createApiClient()

export interface PurchaseStatusFormData {
  name: string
  state: number
  description?: string
}

export const purchaseStatusService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<PurchaseStatus>>('/api/admin/purchase/purchase-statuses', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<PurchaseStatus>>(`/api/admin/purchase/purchase-statuses/${id}`)
  },
  create(data: PurchaseStatusFormData) {
    return api.post<SingleResponse<PurchaseStatus>>('/api/admin/purchase/purchase-statuses', data)
  },
  update(id: number | string, data: PurchaseStatusFormData) {
    return api.put<SingleResponse<PurchaseStatus>>(`/api/admin/purchase/purchase-statuses/${id}`, data)
  },
  delete(id: number | string) {
    return api.delete(`/api/admin/purchase/purchase-statuses/${id}`)
  },
}

