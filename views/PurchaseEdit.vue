<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import Button from '@admin/components/ui/button/Button.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import Icon from '@admin/components/ui/Icon.vue'
import Input from '@admin/components/ui/Input.vue'
import InputField from '@admin/components/ui/InputField.vue'
import Label from '@admin/components/ui/Label.vue'
import Select from '@admin/components/ui/Select.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import { toastService } from '@admin/lib/toastService'
import PurchasePriceInput from '../components/PurchasePriceInput.vue'
import { CustomerSelect } from '@customer'
import { CurrencySelect } from '@currency'
import { ProductSelect } from '@product'
import { purchaseService, type PurchaseFormData, type PurchaseFormOptions } from '../services/purchaseService'
import { customerApi } from '@customer/services/customerApi'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const fetching = ref(true)
const options = ref<PurchaseFormOptions>({
  customers: [],
  currencies: [],
  warehouses: [],
  purchase_statuses: [],
  products: [],
  purchase_extra_item_types: [],
})
const errors = ref<Record<string, string>>({})
const formData = ref<PurchaseFormData>({
  purchase_status_id: 0,
  customer_id: 0,
  warehouse_id: 0,
  currency_id: 0,
  comment: '',
  url: '',
  purchase_date: '',
  expected_delivery_date: '',
  delivery_date: '',
  total_price: null,
  purchase_items: [],
  purchase_extra_items: [],
})

const fetchFormData = async () => {
  try {
    const id = route.params.id as string
    const response = await purchaseService.getEditData(id)

    options.value = response.data
    formData.value = {
      purchase_status_id: response.data.data.purchase_status_id,
      customer_id: response.data.data.customer_id,
      warehouse_id: response.data.data.warehouse_id,
      currency_id: response.data.data.currency_id,
      comment: response.data.data.comment || '',
      url: response.data.data.url || '',
      purchase_date: response.data.data.purchase_date || '',
      expected_delivery_date: response.data.data.expected_delivery_date || '',
      delivery_date: response.data.data.delivery_date || '',
      total_price: response.data.data.total_price ?? null,
      purchase_items: (response.data.data.purchase_items || []).map((item) => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price ?? null,
        comment: item.comment ?? '',
      })),
      purchase_extra_items: (response.data.data.purchase_extra_items || []).map((item) => ({
        id: item.id,
        purchase_extra_item_type_id: item.purchase_extra_item_type_id,
        price: item.price ?? null,
        comment: item.comment ?? '',
      })),
    }

    if (formData.value.purchase_items.length === 0) {
      formData.value.purchase_items.push({ product_id: 0, quantity: 1, price: null, comment: '' })
    }
  } catch (err: any) {
    toastService.error(err.message || 'Hiba tortent az adatok betoltese kozben.')
  } finally {
    fetching.value = false
  }
}

const addItem = () => {
  formData.value.purchase_items.push({ product_id: 0, quantity: 1, price: null, comment: '' })
}

const removeItem = (index: number) => {
  if (formData.value.purchase_items.length <= 1) {
    return
  }

  formData.value.purchase_items.splice(index, 1)
}

const getProductUnitName = (productId: number): string => {
  if (!productId) {
    return ''
  }

  return options.value.products.find((product) => product.id === productId)?.product_unit?.name ?? ''
}

const addExtraItem = () => {
  if (!formData.value.purchase_extra_items) {
    formData.value.purchase_extra_items = []
  }
  formData.value.purchase_extra_items.push({ purchase_extra_item_type_id: 0, price: null, comment: '' })
}

const removeExtraItem = (index: number) => {
  if (formData.value.purchase_extra_items && formData.value.purchase_extra_items.length > 0) {
    formData.value.purchase_extra_items.splice(index, 1)
  }
}

const submit = async () => {
  loading.value = true
  errors.value = {}

  try {
    const id = route.params.id as string
    await purchaseService.update(id, formData.value)
    toastService.success('Beszerzes sikeresen frissitve.')
    router.push({ name: 'purchase.show', params: { id } })
  } catch (err: any) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      toastService.error(err.message || 'Hiba tortent a mentes kozben.')
    }
  } finally {
    loading.value = false
  }
}

watch(() => formData.value.customer_id, async (customerId) => {
  if (!customerId || customerId === 0) {
    return
  }

  try {
    const response = await customerApi.show(customerId)
    if (response.data.currency_id) {
      formData.value.currency_id = response.data.currency_id
    }
  } catch (err) {
    console.error('Hiba a partner adatainak betoltese kozben:', err)
  }
})

onMounted(() => {
  fetchFormData()
})
</script>

<template>
  <AdminLayout page-title="Beszerzes szerkesztese">
    <div class="space-y-6">
      <div v-if="fetching" class="py-8 text-center text-muted-foreground">Betoltes...</div>

      <Card v-else>
        <CardHeader>
          <CardTitle>Beszerzes adatai</CardTitle>
          <CardDescription>Modositsd a beszerzes adatait.</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-6" @submit.prevent="submit">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="customer_id">Partner *</Label>
                <CustomerSelect id="customer_id" v-model="formData.customer_id" />
                <FieldError :errors="errors.customer_id" />
              </div>

              <div class="space-y-2">
                <Label for="purchase_status_id">Statusz *</Label>
                <Select id="purchase_status_id" v-model.number="formData.purchase_status_id" required>
                  <option :value="0">Valassz statuszt</option>
                  <option v-for="status in options.purchase_statuses" :key="status.id" :value="status.id">{{ status.name }}</option>
                </Select>
                <FieldError :errors="errors.purchase_status_id" />
              </div>

              <div class="space-y-2">
                <Label for="warehouse_id">Raktar *</Label>
                <Select id="warehouse_id" v-model.number="formData.warehouse_id" required>
                  <option :value="0">Valassz raktart</option>
                  <option v-for="warehouse in options.warehouses" :key="warehouse.id" :value="warehouse.id">{{ warehouse.name }}</option>
                </Select>
                <FieldError :errors="errors.warehouse_id" />
              </div>

              <div class="space-y-2">
                <Label for="currency_id">Penznem *</Label>
                <CurrencySelect
                  id="currency_id"
                  v-model="formData.currency_id"
                  :options="options.currencies"
                  :empty-value="0"
                  placeholder="Valassz penznemet"
                  required
                />
                <FieldError :errors="errors.currency_id" />
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
              <InputField id="purchase_date" label="Beszerzes datuma" v-model="formData.purchase_date" type="date" :errors="errors.purchase_date" />
              <InputField id="expected_delivery_date" label="Varhato beerkezes" v-model="formData.expected_delivery_date" type="date" :errors="errors.expected_delivery_date" />
              <InputField id="delivery_date" label="Beerkezes datuma" v-model="formData.delivery_date" type="date" :errors="errors.delivery_date" />
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <Label for="total_price">Vegosszeg</Label>
                <PurchasePriceInput
                  id="total_price"
                  v-model="formData.total_price"
                  :currency-id="formData.currency_id"
                  :currencies="options.currencies"
                />
                <FieldError :errors="errors.total_price" />
              </div>
              <InputField id="url" label="URL" v-model="formData.url" type="url" placeholder="https://" :errors="errors.url" />
            </div>

            <div class="space-y-2">
              <Label for="comment">Megjegyzes</Label>
              <Textarea id="comment" v-model="formData.comment" rows="3" />
              <FieldError :errors="errors.comment" />
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Tetelek</h2>
                <Button type="button" variant="outline" size="sm" @click="addItem">
                  <Icon name="plus" :size="16" />
                  Tetel hozzaadasa
                </Button>
              </div>

              <FieldError :errors="errors.items" />

              <div v-for="(item, index) in formData.purchase_items" :key="index" class="relative grid gap-4 rounded-md border p-4 pt-10 md:grid-cols-4">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  class="absolute top-3 right-3"
                  @click="removeItem(index)"
                >
                  <Icon name="delete" :size="16" />
                </Button>

                <div class="space-y-2 md:col-span-2">
                  <Label :for="`item_product_${index}`">Termek *</Label>
                  <ProductSelect
                    :id="`item_product_${index}`"
                    v-model="item.product_id"
                    :options="options.products"
                    :empty-value="0"
                    placeholder="Valassz termeket"
                    required
                  />
                  <FieldError :errors="errors[`purchase_items.${index}.product_id`]" />
                </div>
                <div class="space-y-2">
                  <Label :for="`item_quantity_${index}`">Mennyiseg *</Label>
                  <div class="flex items-center gap-2">
                    <Input :id="`item_quantity_${index}`" v-model.number="item.quantity" type="number" min="0.0001" step="0.0001" required />
                    <span class="shrink-0 text-sm text-muted-foreground">{{ getProductUnitName(item.product_id) || '-' }}</span>
                  </div>
                  <FieldError :errors="errors[`purchase_items.${index}.quantity`]" />
                </div>
                <div class="space-y-2">
                  <Label :for="`item_price_${index}`">Ár</Label>
                  <PurchasePriceInput
                    :id="`item_price_${index}`"
                    v-model="item.price"
                    :currency-id="formData.currency_id"
                    :currencies="options.currencies"
                  />
                  <FieldError :errors="errors[`purchase_items.${index}.price`]" />
                </div>
                <div class="md:col-span-3">
                  <InputField :id="`item_comment_${index}`" label="Megjegyzes" v-model="item.comment" :errors="errors[`purchase_items.${index}.comment`]" />
                </div>
              </div>
            </div>

            <div v-if="options.purchase_extra_item_types && options.purchase_extra_item_types.length > 0" class="space-y-4 border-t pt-6">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold">Extra tetelek</h2>
                <Button type="button" variant="outline" size="sm" @click="addExtraItem">
                  <Icon name="plus" :size="16" />
                  Extra tetel hozzaadasa
                </Button>
              </div>

              <div v-for="(item, index) in formData.purchase_extra_items" :key="`extra_${index}`" class="relative grid gap-4 rounded-md border p-4 pt-10 md:grid-cols-3">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  class="absolute top-3 right-3"
                  @click="removeExtraItem(index)"
                >
                  <Icon name="delete" :size="16" />
                </Button>

                <div class="space-y-2 md:col-span-2">
                  <Label :for="`extra_item_type_${index}`">Tetel tipusa *</Label>
                  <Select :id="`extra_item_type_${index}`" v-model.number="item.purchase_extra_item_type_id" required>
                    <option :value="0">Valassz extra tetelt</option>
                    <option v-for="type in options.purchase_extra_item_types" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </Select>
                  <FieldError :errors="errors[`purchase_extra_items.${index}.purchase_extra_item_type_id`]" />
                </div>
                <div class="space-y-2">
                  <Label :for="`extra_item_price_${index}`">Ar</Label>
                  <PurchasePriceInput
                    :id="`extra_item_price_${index}`"
                    v-model="item.price"
                    :currency-id="formData.currency_id"
                    :currencies="options.currencies"
                  />
                  <FieldError :errors="errors[`purchase_extra_items.${index}.price`]" />
                </div>
                <div class="md:col-span-3">
                  <InputField :id="`extra_item_comment_${index}`" label="Megjegyzes" v-model="item.comment" :errors="errors[`purchase_extra_items.${index}.comment`]" />
                </div>
              </div>
            </div>

            <FormButtons
              :loading="loading"
              submit-text="Mentes"
              cancel-text="Vissza"
              @submit="submit"
              @cancel="router.push({ name: 'purchase.show', params: { id: route.params.id } })"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>
