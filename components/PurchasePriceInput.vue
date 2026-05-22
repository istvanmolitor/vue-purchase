<script setup lang="ts">
import { computed } from 'vue'
import Input from '@admin/components/ui/Input.vue'
import type { PurchaseOption } from '../services/purchaseService'

interface Props {
  id?: string
  modelValue?: number | null
  currencyId: number
  currencies?: PurchaseOption[]
  min?: string | number
  step?: string | number
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  modelValue: null,
  currencies: () => [],
  min: 0,
  step: '0.01',
  required: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
}>()

const hasCurrency = computed(() => {
  return props.currencyId > 0
})

const currencySymbol = computed(() => {
  const currency = props.currencies.find((item) => item.id === props.currencyId)

  return currency?.symbol?.trim() || currency?.code?.trim() || 'Ar'
})

const isCurrencyFirst = computed(() => {
  return props.currencies.find((currency) => currency.id === props.currencyId)?.is_symbol_first === true
})

const inputClass = computed(() => {
  return isCurrencyFirst.value ? 'rounded-l-none border-l-0' : 'rounded-r-none border-r-0'
})

const currencyBadgeClass = computed(() => {
  return isCurrencyFirst.value
    ? 'rounded-l-md rounded-r-none border-r-0'
    : 'rounded-r-md rounded-l-none border-l-0'
})

const parsePriceValue = (value: string | number): number | null => {
  if (value === '') {
    return null
  }

  const normalizedValue = String(value)
    .trim()
    .replace(/\s+/g, '')
    .replace(',', '.')

  if (normalizedValue === '') {
    return null
  }

  const parsedValue = Number(normalizedValue)

  return Number.isNaN(parsedValue) ? null : parsedValue
}

const inputValue = computed<string>({
  get() {
    return props.modelValue === null ? '' : String(props.modelValue)
  },
  set(value) {
    emit('update:modelValue', parsePriceValue(value))
  },
})
</script>

<template>
  <div v-if="hasCurrency" class="flex items-center">
    <template v-if="isCurrencyFirst">
      <span :class="['flex h-9 items-center border border-input bg-muted px-3 text-xs text-muted-foreground', currencyBadgeClass]">
        {{ currencySymbol }}
      </span>
      <Input
        :id="id"
        v-model="inputValue"
        type="text"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :min="min"
        :step="step"
        :required="required"
        :class="inputClass"
      />
    </template>
    <template v-else>
      <Input
        :id="id"
        v-model="inputValue"
        type="text"
        inputmode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        :min="min"
        :step="step"
        :required="required"
        :class="inputClass"
      />
      <span :class="['flex h-9 items-center border border-input bg-muted px-3 text-xs text-muted-foreground', currencyBadgeClass]">
        {{ currencySymbol }}
      </span>
    </template>
  </div>
  <div
    v-else
    class="flex h-9 items-center rounded-md border border-dashed border-input px-3 text-xs text-muted-foreground"
  >
    Valassz penznemet az ar megadasahoz.
  </div>
</template>



