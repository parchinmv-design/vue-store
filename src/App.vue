<script setup lang="ts">
import { ref, computed } from 'vue'
import { products, categories } from './data/products'
import { useCartStore } from './stores/cart'
import type { SortOrder } from './types/product'
import ProductCard from './components/ProductCard.vue'
import CartSidebar from './components/CartSidebar.vue'

const cart = useCartStore()

const searchQuery = ref('')
const selectedCategory = ref('Все')
const sortOrder = ref<SortOrder>('default')
const isCartOpen = ref(false)

const filteredProducts = computed(() => {
  let result = [...products]

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.trim().toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value !== 'Все') {
    result = result.filter((p) => p.category === selectedCategory.value)
  }

  if (sortOrder.value === 'asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortOrder.value === 'desc') {
    result.sort((a, b) => b.price - a.price)
  }

  return result
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="logo">🛒 Vue Store</h1>

      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск товаров..."
          class="search-input"
        />
      </div>

      <button class="cart-btn" @click="isCartOpen = true">
        🛒 Корзина
        <span v-if="cart.totalCount > 0" class="cart-badge">{{ cart.totalCount }}</span>
      </button>
    </header>

    <div class="toolbar">
      <div class="filters">
        <button
          v-for="cat in categories"
          :key="cat"
          class="filter-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="sort-box">
        <label>Сортировка:</label>
        <select v-model="sortOrder" class="sort-select">
          <option value="default">По умолчанию</option>
          <option value="asc">Сначала дешёвые</option>
          <option value="desc">Сначала дорогие</option>
        </select>
      </div>
    </div>

    <main class="catalog">
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <p>Ничего не найдено</p>
      </div>
      <div class="product-grid">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>
    </main>

    <CartSidebar :open="isCartOpen" @close="isCartOpen = false" />
  </div>
</template>
