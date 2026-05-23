<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { toastService } from '@admin/lib/toastService'
import { purchaseService, type Purchase, type PurchaseLog } from '../services/purchaseService'

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const purchase = ref<Purchase | null>(null)
const logs = ref<PurchaseLog[]>([])

const logColumns = [
  { key: 'status_changed_at', label: 'Idopont' },
  { key: 'purchase_status', label: 'Statusz' },
  { key: 'user', label: 'Felhasznalo' },
  { key: 'comment', label: 'Megjegyzes' },
]

const itemColumns = [
  { key: 'product', label: 'Termek' },
  { key: 'quantity', label: 'Mennyiseg' },
  { key: 'price', label: 'Ar' },
  { key: 'comment', label: 'Megjegyzes' },
]

const fetchPurchase = async () => {
  loading.value = true
  try {
    const id = route.params.id as string
    const response = await purchaseService.getById(id)
    purchase.value = response.data.data
    logs.value = response.data.logs
  } catch (err: any) {
    toastService.error(err.message || 'Hiba tortent a beszerzes betoltese kozben.')
  } finally {
    loading.value = false
  }
}

const closePurchase = async () => {
  if (!purchase.value?.id) {
    return
  }

  try {
    await purchaseService.close(purchase.value.id)
    toastService.success('Beszerzes sikeresen lezarva.')
    fetchPurchase()
  } catch (err: any) {
    toastService.error(err.message || 'Hiba tortent a lezaras kozben.')
  }
}

onMounted(() => {
  fetchPurchase()
})
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-tight">Beszerzes #{{ purchase?.id }}</h1>
        <div class="flex gap-2">
          <Button @click="router.push({ name: 'purchase.edit', params: { id: purchase?.id } })">
            Szerkesztes
          </Button>
          <Button @click="closePurchase">Lezaras</Button>
        </div>
      </div>

      <div v-if="loading" class="py-8 text-center text-muted-foreground">Betoltes...</div>

      <template v-else-if="purchase">
        <Card>
          <CardHeader>
            <CardTitle>Alapadatok</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-4 md:grid-cols-3">
            <div><strong>Partner:</strong> {{ purchase.customer?.name || '-' }}</div>
            <div><strong>Statusz:</strong> {{ purchase.purchase_status?.name || '-' }}</div>
            <div><strong>Raktar:</strong> {{ purchase.warehouse?.name || '-' }}</div>
            <div><strong>Osszeg:</strong> {{ purchase.total_price ?? '-' }} {{ purchase.currency?.code || '' }}</div>
            <div><strong>Beszerzes:</strong> {{ purchase.purchase_date || '-' }}</div>
            <div><strong>Varhato beerkezes:</strong> {{ purchase.expected_delivery_date || '-' }}</div>
            <div class="md:col-span-3"><strong>Megjegyzes:</strong> {{ purchase.comment || '-' }}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tetelek</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              :columns="itemColumns"
              :rows="(purchase.purchase_items || []).map((item) => ({
                ...item,
                product: item.product?.name || '-',
                quantity: item.product?.product_unit?.name ? `${item.quantity} ${item.product.product_unit.name}` : item.quantity,
                price: item.price ?? '-',
                comment: item.comment || '-',
              }))"
              :loading="false"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statusz elozmenyek</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable :columns="logColumns" :rows="logs" :loading="false" />
          </CardContent>
        </Card>
      </template>
    </div>
  </AdminLayout>
</template>


