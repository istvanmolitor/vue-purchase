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
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import DataTablePagination from '@admin/components/ui/dataTable/DataTablePagination.vue'
import DataTableSearch from '@admin/components/ui/dataTable/DataTableSearch.vue'
import DeleteButton from '@admin/components/ui/button/DeleteButton.vue'
import EditButton from '@admin/components/ui/button/EditButton.vue'
import { toastService } from '@admin/lib/toastService'
import { purchaseStatusService } from '../services/purchaseStatusService'
import type { PurchaseStatus } from '../services/purchaseService'

const router = useRouter()
const statuses = ref<PurchaseStatus[]>([])
const loading = ref(false)
const search = ref('')
const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nev' },
  { key: 'state', label: 'Allapot' },
  { key: 'description', label: 'Leiras' },
  { key: 'actions', label: 'Muveletek' },
]

const fetchStatuses = async (page = 1) => {
  loading.value = true
  try {
    const response = await purchaseStatusService.getAll({
      page,
      search: search.value || undefined,
    })

    statuses.value = response.data.data
    currentPage.value = response.data.meta.current_page
    lastPage.value = response.data.meta.last_page
    total.value = response.data.meta.total
  } catch (err: any) {
    toastService.error(err.message || 'Hiba tortent a statuszok betoltese kozben.')
  } finally {
    loading.value = false
  }
}

const deleteStatus = async (id?: number) => {
  if (!id || !confirm('Biztosan torolni szeretned ezt a statuszt?')) {
    return
  }

  try {
    await purchaseStatusService.delete(id)
    toastService.success('Statusz sikeresen torolve.')
    fetchStatuses(currentPage.value)
  } catch (err: any) {
    toastService.error(err.message || 'Hiba tortent a torles kozben.')
  }
}

onMounted(() => {
  fetchStatuses()
})
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">Beszerzesi statuszok</h1>
        <Button class="gap-2" @click="router.push({ name: 'purchase-status.create' })">
          <Plus class="h-4 w-4" />
          Uj statusz
        </Button>
      </div>

      <Card>
        <CardHeader class="pb-3">
          <CardTitle>Statuszok kezelese</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <DataTableSearch v-model="search" placeholder="Kereses nev vagy leiras alapjan..." @search="fetchStatuses()" />

          <DataTable :columns="columns" :rows="statuses" :loading="loading">
            <template #cell-actions="{ row }">
              <div class="flex gap-2">
                <EditButton @click="router.push({ name: 'purchase-status.edit', params: { id: row.id } })" />
                <DeleteButton @click="deleteStatus(row.id)" />
              </div>
            </template>
          </DataTable>

          <DataTablePagination
            :current-page="currentPage"
            :last-page="lastPage"
            :total="total"
            @page-change="fetchStatuses"
          />
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

