<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import ShowButton from '@admin/components/ui/button/ShowButton.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import { toastService } from '@admin/lib/toastService'
import { purchaseService, type Purchase } from '../services/purchaseService'

const router = useRouter()
const purchases = ref<Purchase[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const sort = ref('id')
const direction = ref<'asc' | 'desc'>('desc')
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
})

const columns = ref<Column[]>([])

const daysUntilDelivery = (dateStr?: string | null): number | null => {
  if (!dateStr) {
    return null
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)

  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

const rows = computed(() => purchases.value.map((purchase) => ({
  ...purchase,
  status: purchase.purchase_status?.name ?? '-',
  total_price: purchase.total_price != null
    ? `${purchase.total_price} ${purchase.currency?.code ?? ''}`.trim()
    : '-',
  purchase_date: purchase.purchase_date ?? '-',
  delivery_days: daysUntilDelivery(purchase.expected_delivery_date),
  items_count: purchase.purchase_items?.length ?? 0,
})))

const fetchPurchases = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
} = {}) => {
  loading.value = true
  error.value = null

  try {
    const response = await purchaseService.getAll({
      page: params.page,
      search: params.search !== undefined ? params.search : (search.value || undefined),
      sort: params.sort ?? sort.value,
      direction: params.direction ?? direction.value,
    })

    purchases.value = response.data.data
    pagination.value = response.data.meta
    columns.value = (response.data.columns ?? []) as Column[]
    search.value = params.search ?? search.value
    sort.value = params.sort ?? sort.value
    direction.value = params.direction ?? direction.value
  } catch (err: any) {
    error.value = err.message || 'Hiba tortent a beszerzesek betoltese kozben.'
    toastService.error(error.value)
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id?: number) => {
  if (!id) {
    return
  }

  try {
    await purchaseService.delete(id)
    toastService.success('Beszerzes sikeresen torolve.')
    await fetchPurchases({ page: pagination.value.current_page })
  } catch (err: any) {
    toastService.error(err.message || 'Hiba tortent a torles kozben.')
  }
}

onMounted(() => {
  fetchPurchases({ page: 1, sort: 'id', direction: 'desc' })
})
</script>

<template>
  <AdminLayout page-title="Beszerzesek">
    <div class="space-y-6">
      <Card>
        <CardHeader class="pb-3">
          <CardTitle>Beszerzesek kezelese</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="error" class="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {{ error }}
          </div>

          <DataTable
            :columns="columns"
            :data="rows"
            :loading="loading"
            :pagination="pagination"
            :searchable="true"
            search-placeholder="Kereses ugyfel neve, URL vagy megjegyzes alapjan..."
            default-sort="id"
            default-direction="desc"
            @fetch="fetchPurchases"
          >
            <template #actions>
              <Button class="gap-2" @click="router.push({ name: 'purchase.create' })">
                <Plus class="h-4 w-4" />
                Új beszerzes
              </Button>
            </template>
            <template #cell-customer="{ row }">
              <RouterLink
                v-if="(row as Purchase).customer"
                :to="{ name: 'customer.customers.edit', params: { id: (row as Purchase).customer!.id } }"
                class="text-sm font-medium text-primary hover:underline"
              >
                {{ (row as Purchase).customer!.name }}
              </RouterLink>
              <span v-else>-</span>
            </template>
            <template #cell-expected_delivery_date="{ row }">
              <span v-if="(row as Purchase & { delivery_days: number | null }).delivery_days === null">-</span>
              <span
                v-else
                :class="[
                  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  (row as Purchase & { delivery_days: number | null }).delivery_days! < 0
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                    : 'text-foreground'
                ]"
              >
                {{ (row as Purchase & { delivery_days: number | null }).delivery_days }} nap
              </span>
            </template>
            <template #row-actions="{ row }">
              <div class="flex gap-2">
                <ShowButton @click="router.push({ name: 'purchase.show', params: { id: (row as Purchase).id } })" />
                <EditButton @click="router.push({ name: 'purchase.edit', params: { id: (row as Purchase).id } })" />
                <DeleteButton @confirm="handleDelete((row as Purchase).id)" />
              </div>
            </template>
            <template #empty>
              Nincs megjelenitheto beszerzes.
            </template>
          </DataTable>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

