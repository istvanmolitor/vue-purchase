<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FieldError from '@admin/components/ui/FieldError.vue'
import FormButtons from '@admin/components/ui/button/FormButtons.vue'
import Input from '@admin/components/ui/Input.vue'
import Label from '@admin/components/ui/Label.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import { toastService } from '@admin/lib/toastService'
import { purchaseExtraItemService, type PurchaseExtraItemFormData } from '../services/purchaseExtraItemService'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const fetching = ref(true)
const errors = ref<Record<string, string>>({})
const formData = ref<PurchaseExtraItemFormData>({
  name: '',
  description: '',
})

const fetchData = async () => {
  try {
    const response = await purchaseExtraItemService.getById(route.params.id as string)
    formData.value = {
      name: response.data.data.name,
      description: response.data.data.description || '',
    }
  } catch (err: any) {
    toastService.error(err.message || 'Hiba tortent az adatok betoltese kozben.')
  } finally {
    fetching.value = false
  }
}

const submit = async () => {
  loading.value = true
  errors.value = {}

  try {
    await purchaseExtraItemService.update(route.params.id as string, formData.value)
    toastService.success('Extra tetel sikeresen frissitve.')
    router.push({ name: 'purchase-extra-item.index' })
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

onMounted(() => {
  fetchData()
})
</script>

<template>
  <AdminLayout page-title="Beszerzesi extra tetel szerkesztese">
    <div class="space-y-6">
      <h1 class="text-3xl font-bold tracking-tight">Beszerzesi extra tetel szerkesztese</h1>

      <div v-if="fetching" class="py-8 text-center text-muted-foreground">Betoltes...</div>

      <Card v-else>
        <CardHeader>
          <CardTitle>Extra tetel adatai</CardTitle>
          <CardDescription>Modositsd az extra tetel adatait.</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-6" @submit.prevent="submit">
            <div class="space-y-2">
              <Label for="name">Nev *</Label>
              <Input id="name" v-model="formData.name" required />
              <FieldError v-if="errors.name" :message="errors.name" />
            </div>

            <div class="space-y-2">
              <Label for="description">Leiras</Label>
              <Textarea id="description" v-model="formData.description" rows="4" />
              <FieldError v-if="errors.description" :message="errors.description" />
            </div>

            <FormButtons
              :loading="loading"
              submit-text="Mentes"
              cancel-text="Vissza"
              @submit="submit"
              @cancel="router.push({ name: 'purchase-extra-item.index' })"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

