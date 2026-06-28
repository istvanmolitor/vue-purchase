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

const rows = computed(() => purchases.value.map((purchase) => ({
  ...purchase,
  customer: purchase.customer?.name ?? '-',
  status: purchase.purchase_status?.name ?? '-',
  total_price: purchase.total_price != null
    ? `${purchase.total_price} ${purchase.currency?.code ?? ''}`.trim()
    : '-',
  expected_delivery_date: purchase.expected_delivery_date ?? '-',
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

  if (!confirm('Biztosan torolni szeretned ezt a beszerzest?')) {
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
      <h1 class="text-3xl font-bold tracking-tight">Beszerzesek</h1>

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
            search-placeholder="Kereses URL vagy megjegyzes alapjan..."
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
            <template #row-actions="{ row }">
              <div class="flex gap-2">
                <ShowButton @click="router.push({ name: 'purchase.show', params: { id: (row as Purchase).id } })" />
                <EditButton @click="router.push({ name: 'purchase.edit', params: { id: (row as Purchase).id } })" />
                <DeleteButton @click="handleDelete((row as Purchase).id)" />
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

