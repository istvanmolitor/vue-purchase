<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import InputField from '@admin/components/ui/InputField.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import { toastService } from '@admin/lib/toastService'
import { purchaseExtraItemTypeService, type PurchaseExtraItemTypeFormData } from '../services/purchaseExtraItemTypeService'

const router = useRouter()
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const formData = ref<PurchaseExtraItemTypeFormData>({
  name: '',
  description: '',
})

const submit = async () => {
  loading.value = true
  errors.value = {}

  try {
    await purchaseExtraItemTypeService.create(formData.value)
    toastService.success('Extra tetel tipus sikeresen letrehozva.')
    router.push({ name: 'purchase-extra-item-type.index' })
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
</script>

<template>
  <AdminLayout page-title="Uj beszerzesi extra tetel tipus">
    <div class="space-y-6">
      <h1 class="text-3xl font-bold tracking-tight">Uj beszerzesi extra tetel tipus</h1>

      <Card>
        <CardHeader>
          <CardTitle>Extra tetel tipus adatai</CardTitle>
          <CardDescription>Add meg az uj extra tetel tipus adatait.</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-6" @submit.prevent="submit">
            <InputField id="name" label="Nev" v-model="formData.name" :required="true" :errors="errors.name" />

            <div class="space-y-2">
              <Label for="description">Leiras</Label>
              <Textarea id="description" v-model="formData.description" rows="4" />
              <FieldError v-if="errors.description" :message="errors.description" />
            </div>

            <FormButtons
              :loading="loading"
              submit-text="Letrehozas"
              cancel-text="Vissza"
              @submit="submit"
              @cancel="router.push({ name: 'purchase-extra-item-type.index' })"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>


