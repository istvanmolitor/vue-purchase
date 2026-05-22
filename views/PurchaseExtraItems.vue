<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import { toastService } from '@admin/lib/toastService'
import { purchaseExtraItemService } from '../services/purchaseExtraItemService'
import type { PurchaseExtraItem } from '../services/purchaseService'

const router = useRouter()
const purchaseExtraItems = ref<PurchaseExtraItem[]>([])
const loading = ref(false)
const search = ref('')
const sort = ref('name')
const direction = ref<'asc' | 'desc'>('asc')
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
})

const columns: Column<PurchaseExtraItem>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Nev', sortable: true },
  { key: 'description', label: 'Leiras', sortable: true },
]

const fetchPurchaseExtraItems = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
} = {}) => {
  loading.value = true

  try {
    const response = await purchaseExtraItemService.getAll({
      page: params.page,
      search: params.search !== undefined ? params.search : (search.value || undefined),
      sort: params.sort ?? sort.value,
      direction: params.direction ?? direction.value,
    })

    purchaseExtraItems.value = response.data.data
    pagination.value = response.data.meta
    search.value = params.search ?? search.value
    sort.value = params.sort ?? sort.value
    direction.value = params.direction ?? direction.value
  } catch (err: any) {
    toastService.error(err.message || 'Hiba tortent az extra tetelek betoltese kozben.')
  } finally {
    loading.value = false
  }
}

const deletePurchaseExtraItem = async (id?: number) => {
  if (!id || !confirm('Biztosan torolni szeretned ezt az extra tetelt?')) {
    return
  }

  try {
    await purchaseExtraItemService.delete(id)
    toastService.success('Extra tetel sikeresen torolve.')
    await fetchPurchaseExtraItems({ page: pagination.value.current_page })
  } catch (err: any) {
    toastService.error(err.message || 'Hiba tortent a torles kozben.')
  }
}

onMounted(() => {
  fetchPurchaseExtraItems({ page: 1, sort: 'name', direction: 'asc' })
})
</script>

<template>
  <AdminLayout page-title="Beszerzesi extra tetelek">
    <div class="space-y-6">
      <h1 class="text-3xl font-bold tracking-tight">Beszerzesi extra tetelek</h1>

      <Card>
        <CardHeader class="pb-3">
          <CardTitle>Extra tetelek kezelese</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <DataTable
            :columns="columns"
            :data="purchaseExtraItems"
            :loading="loading"
            :pagination="pagination"
            :searchable="true"
            search-placeholder="Kereses nev vagy leiras alapjan..."
            default-sort="name"
            default-direction="asc"
            @fetch="fetchPurchaseExtraItems"
          >
            <template #actions>
              <Button class="gap-2" @click="router.push({ name: 'purchase-extra-item.create' })">
                <Plus class="h-4 w-4" />
                Uj extra tetel
              </Button>
            </template>
            <template #row-actions="{ row }">
              <div class="flex gap-2">
                <EditButton @click="router.push({ name: 'purchase-extra-item.edit', params: { id: (row as PurchaseExtraItem).id } })" />
                <DeleteButton @click="deletePurchaseExtraItem((row as PurchaseExtraItem).id)" />
              </div>
            </template>
            <template #empty>
              Nincs megjelenitheto beszerzesi extra tetel.
            </template>
          </DataTable>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

