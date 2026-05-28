<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import Select from '@admin/components/ui/Select.vue'
import { toastService } from '@admin/lib/toastService'
import type { PurchaseRequirement } from '../services/purchaseRequirementService'
import { purchaseRequirementService } from '../services/purchaseRequirementService'

interface Warehouse {
  id: number
  name: string
}

const loading = ref(false)
const requirements = ref<PurchaseRequirement[]>([])
const warehouses = ref<Warehouse[]>([])
const selectedWarehouseId = ref<number | ''>('')

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('hu-HU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

const calculatePercentage = (current: number, minimum: number): number => {
  if (minimum === 0) return 100
  const percentage = (current / minimum) * 100
  return Math.min(Math.max(percentage, 0), 100)
}

const loadRequirements = async () => {
  try {
    loading.value = true
    const warehouseId = selectedWarehouseId.value === '' ? undefined : selectedWarehouseId.value
    const response = await purchaseRequirementService.getRequirements(warehouseId)
    requirements.value = response.data.data
    warehouses.value = response.data.warehouses
  } catch (error) {
    toastService.error('Hiba tortent a szukseges beszerzesek betoltese kozben.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRequirements()
})

watch(() => selectedWarehouseId.value, () => {
  loadRequirements()
})
</script>

<template>
  <AdminLayout page-title="Szukseges beszerzesek">
    <div class="space-y-6">
      <h1 class="text-3xl font-bold tracking-tight">Szukseges beszerzesek</h1>

      <Card>
        <CardHeader class="gap-4 md:flex md:flex-row md:items-center md:justify-between">
          <CardTitle>Termeklista minimum keszletszint alatt</CardTitle>
          <div class="w-full md:w-72">
            <Select v-model="selectedWarehouseId">
              <option value="">Osszes raktar</option>
              <option v-for="warehouse in warehouses" :key="warehouse.id" :value="warehouse.id">
                {{ warehouse.name }}
              </option>
            </Select>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="loading" class="py-8 text-center text-sm text-muted-foreground">Betoltes...</div>

          <div v-else-if="requirements.length === 0" class="rounded-md border border-green-300 bg-green-50 p-4 text-green-800">
            Nincs olyan termek, amelybol rendelni kell.
          </div>

          <div v-else class="space-y-3">
            <div class="rounded-md border border-blue-300 bg-blue-50 p-3 text-sm text-blue-900">
              <span class="font-semibold">{{ requirements.length }}</span> termeknel szukseges uj beszerzes.
            </div>

            <div class="grid gap-3">
              <div
                v-for="product in requirements"
                :key="product.id"
                class="rounded-md border bg-card p-4 text-card-foreground"
              >
                <div class="flex gap-4">
                  <div class="shrink-0">
                    <img
                      v-if="product.image_url"
                      :src="product.image_url"
                      :alt="product.sku"
                      class="h-16 w-16 rounded border object-cover"
                    >
                    <div v-else class="flex h-16 w-16 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">
                      Nincs kep
                    </div>
                  </div>

                  <div class="grow space-y-3">
                    <div class="flex items-start justify-between gap-3">
                      <div>
                        <p class="font-semibold">{{ product.sku }}</p>
                        <p v-if="product.product_unit" class="text-sm text-muted-foreground">Mertekegyseg: {{ product.product_unit }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-xs text-muted-foreground">Rendelendo</p>
                        <p class="text-xl font-bold text-red-600">{{ formatNumber(product.need_to_order) }}</p>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 md:grid-cols-5">
                      <div class="rounded border bg-muted/40 p-2 text-xs">
                        <p class="text-muted-foreground">Keszlet</p>
                        <p class="text-sm font-semibold">{{ formatNumber(product.current_quantity) }}</p>
                      </div>
                      <div class="rounded border bg-green-50 p-2 text-xs">
                        <p class="text-green-700">Beerkezo</p>
                        <p class="text-sm font-semibold text-green-700">+{{ formatNumber(product.incoming_purchases) }}</p>
                      </div>
                      <div class="rounded border bg-orange-50 p-2 text-xs">
                        <p class="text-orange-700">Megrendeles</p>
                        <p class="text-sm font-semibold text-orange-700">-{{ formatNumber(product.pending_orders) }}</p>
                      </div>
                      <div class="rounded border bg-blue-50 p-2 text-xs">
                        <p class="text-blue-700">Elerheto</p>
                        <p class="text-sm font-semibold text-blue-700">{{ formatNumber(product.available_quantity) }}</p>
                      </div>
                      <div class="rounded border bg-purple-50 p-2 text-xs">
                        <p class="text-purple-700">Minimum</p>
                        <p class="text-sm font-semibold text-purple-700">{{ formatNumber(product.min_quantity) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>




