import { createApiClient } from '@user/services/apiClient'

const api = createApiClient()

export interface PurchaseRequirement {
  id: number
  sku: string
  name: string
  image_url: string | null
  product_unit: string | null
  current_quantity: number
  min_quantity: number
  incoming_purchases: number
  pending_orders: number
  available_quantity: number
  need_to_order: number
}

export interface PurchaseRequirementsResponse {
  data: PurchaseRequirement[]
  total_products: number
  warehouses: Array<{
    id: number
    name: string
  }>
}

export const purchaseRequirementService = {
  getRequirements(warehouseId?: number) {
    const params = warehouseId ? { warehouse_id: warehouseId } : {}
    return api.get<PurchaseRequirementsResponse>('/api/admin/purchase/purchases/requirements/list', { params })
  },
}


