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
import Select from '@admin/components/ui/Select.vue'
import Textarea from '@admin/components/ui/Textarea.vue'
import { toastService } from '@admin/lib/toastService'
import { purchaseStatusService, type PurchaseStatusFormData } from '../services/purchaseStatusService'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const fetching = ref(true)
const errors = ref<Record<string, string>>({})
const formData = ref<PurchaseStatusFormData>({
  name: '',
  state: 0,
  description: '',
})

const fetchData = async () => {
  try {
    const response = await purchaseStatusService.getById(route.params.id as string)
    formData.value = {
      name: response.data.data.name,
      state: response.data.data.state,
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
    await purchaseStatusService.update(route.params.id as string, formData.value)
    toastService.success('Statusz sikeresen frissitve.')
    router.push({ name: 'purchase-status.index' })
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
  <AdminLayout>
    <div class="space-y-6">
      <h1 class="text-3xl font-bold tracking-tight">Beszerzesi statusz szerkesztese</h1>

      <div v-if="fetching" class="py-8 text-center text-muted-foreground">Betoltes...</div>

      <Card v-else>
        <CardHeader>
          <CardTitle>Statusz adatai</CardTitle>
          <CardDescription>Modositsd a statusz adatait.</CardDescription>
        </CardHeader>
        <CardContent>
          <form class="space-y-6" @submit.prevent="submit">
            <div class="space-y-2">
              <Label for="name">Nev *</Label>
              <Input id="name" v-model="formData.name" required />
              <FieldError v-if="errors.name" :message="errors.name" />
            </div>

            <div class="space-y-2">
              <Label for="state">Allapot *</Label>
              <Select id="state" v-model.number="formData.state" required>
                <option :value="0">Kezdeti</option>
                <option :value="1">Folyamatban</option>
                <option :value="2">Lezart</option>
                <option :value="3">Torolt</option>
              </Select>
              <FieldError v-if="errors.state" :message="errors.state" />
            </div>

            <div class="space-y-2">
              <Label for="description">Leiras</Label>
              <Textarea id="description" v-model="formData.description" rows="4" />
            </div>

            <FormButtons
              :loading="loading"
              submit-text="Mentes"
              cancel-text="Vissza"
              @submit="submit"
              @cancel="router.push({ name: 'purchase-status.index' })"
            />
          </form>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

