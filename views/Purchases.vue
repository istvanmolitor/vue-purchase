<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import DataTablePagination from '@admin/components/ui/dataTable/DataTablePagination.vue'
import DataTableSearch from '@admin/components/ui/dataTable/DataTableSearch.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import { toastService } from '@admin/lib/toastService'
import { purchaseService, type Purchase } from '../services/purchaseService'

const router = useRouter()
const purchases = ref<Purchase[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)
const search = ref('')
const sort = ref('id')
const direction = ref<'asc' | 'desc'>('desc')

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'customer', label: 'Partner' },
  { key: 'status', label: 'Statusz' },
  { key: 'total_price', label: 'Vegosszeg' },
  { key: 'expected_delivery_date', label: 'Varhato erkezes' },
  { key: 'actions', label: 'Muveletek' },
]

const rows = computed(() => purchases.value.map((purchase) => ({
  ...purchase,
  customer: purchase.customer?.name ?? '-',
  status: purchase.purchase_status?.name ?? '-',
  total_price: purchase.total_price != null
    ? `${purchase.total_price} ${purchase.currency?.code ?? ''}`.trim()
    : '-',
})))

const fetchPurchases = async (page = 1) => {
  loading.value = true
  error.value = null

  try {
    const response = await purchaseService.getAll({
      page,
      search: search.value || undefined,
      sort: sort.value,
      direction: direction.value,
    })

    purchases.value = response.data.data
    currentPage.value = response.data.meta.current_page
    lastPage.value = response.data.meta.last_page
    total.value = response.data.meta.total
  } catch (err: any) {
    error.value = err.message || 'Hiba tortent a beszerzesek betoltese kozben.'
    toastService.error(error.value)
  } finally {
    loading.value = false
  }
}

const handleSort = (column: string) => {
  if (sort.value === column) {
    direction.value = direction.value === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value = column
    direction.value = 'asc'
  }

  fetchPurchases(1)
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
    fetchPurchases(currentPage.value)
  } catch (err: any) {
    toastService.error(err.message || 'Hiba tortent a torles kozben.')
  }
}

onMounted(() => {
  fetchPurchases()
})
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">Beszerzesek</h1>
        <Button class="gap-2" @click="router.push({ name: 'purchase.create' })">
          <Plus class="h-4 w-4" />
          Uj beszerzes
        </Button>
      </div>

      <Card>
        <CardHeader class="pb-3">
          <CardTitle>Beszerzesek kezelese</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <DataTableSearch
            v-model="search"
            placeholder="Kereses URL vagy megjegyzes alapjan..."
            @search="fetchPurchases()"
          />

          <div v-if="error" class="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {{ error }}
          </div>

          <DataTable
            :columns="columns"
            :rows="rows"
            :loading="loading"
            @sort="handleSort"
            @row-click="(row) => router.push({ name: 'purchase.show', params: { id: row.id } })"
          >
            <template #cell-actions="{ row }">
              <div class="flex gap-2">
                <EditButton @click="router.push({ name: 'purchase.edit', params: { id: row.id } })" />
                <DeleteButton @click="handleDelete(row.id)" />
              </div>
            </template>
          </DataTable>

          <DataTablePagination
            :current-page="currentPage"
            :last-page="lastPage"
            :total="total"
            @page-change="fetchPurchases"
          />
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>


