import { ref, watch, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Product, CartItem } from '../types/product'
import { products } from '../data/products'

const STORAGE_KEY = 'cart-items'
const PROMO_STORAGE_KEY = 'cart-promo'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadItems())
  const appliedPromo = ref<string | null>(loadPromo())

  function loadItems(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed: { id: number; quantity: number }[] = JSON.parse(raw)
      return parsed
        .map((entry) => {
          const product = products.find((p) => p.id === entry.id)
          return product ? { product, quantity: entry.quantity } : null
        })
        .filter((item): item is CartItem => item !== null)
    } catch {
      return []
    }
  }

  function loadPromo(): string | null {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY)
    } catch {
      return null
    }
  }

  watch(items, (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val.map((i) => ({ id: i.product.id, quantity: i.quantity }))))
  }, { deep: true })

  watch(appliedPromo, (val) => {
    if (val) {
      localStorage.setItem(PROMO_STORAGE_KEY, val)
    } else {
      localStorage.removeItem(PROMO_STORAGE_KEY)
    }
  })

  function addItem(product: Product) {
    const existing = items.value.find((i) => i.product.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ product, quantity: 1 })
    }
  }

  function removeItem(productId: number) {
    items.value = items.value.filter((i) => i.product.id !== productId)
  }

  function increment(productId: number) {
    const item = items.value.find((i) => i.product.id === productId)
    if (item) item.quantity++
  }

  function decrement(productId: number) {
    const item = items.value.find((i) => i.product.id === productId)
    if (!item) return
    if (item.quantity > 1) {
      item.quantity--
    } else {
      removeItem(productId)
    }
  }

  function clearCart() {
    items.value = []
    appliedPromo.value = null
  }

  function applyPromo(code: string): boolean {
    const normalized = code.trim().toUpperCase()
    if (normalized === 'WEB') {
      appliedPromo.value = 'WEB'
      return true
    }
    return false
  }

  const totalCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

  const discountPercent = computed(() => (appliedPromo.value === 'WEB' ? 10 : 0))

  const originalTotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  )

  const total = computed(() =>
    Math.round(originalTotal.value * (1 - discountPercent.value / 100))
  )

  const discountedPrice = (price: number) =>
    Math.round(price * (1 - discountPercent.value / 100))

  return {
    items,
    appliedPromo,
    addItem,
    removeItem,
    increment,
    decrement,
    clearCart,
    applyPromo,
    totalCount,
    originalTotal,
    total,
    discountPercent,
    discountedPrice,
  }
})
