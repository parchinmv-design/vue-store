<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '../types/product'
import { useCartStore } from '../stores/cart'

const props = defineProps<{ product: Product }>()

const cart = useCartStore()

const inCart = computed(() => cart.items.find((i) => i.product.id === props.product.id))

const displayPrice = computed(() => cart.discountedPrice(props.product.price))
</script>

<template>
  <div class="product-card">
    <div class="product-image">{{ product.image }}</div>
    <h3 class="product-name">{{ product.name }}</h3>
    <p class="product-category">{{ product.category }}</p>
    <div class="product-footer">
      <span class="product-price">
        <template v-if="cart.discountPercent > 0">
          <s class="old-price">{{ product.price.toLocaleString('ru-RU') }} ₽</s>
          <span class="new-price">{{ displayPrice.toLocaleString('ru-RU') }} ₽</span>
        </template>
        <template v-else>{{ product.price.toLocaleString('ru-RU') }} ₽</template>
      </span>
      <button
        v-if="!inCart"
        class="btn btn-primary"
        @click="cart.addItem(product)"
      >
        В корзину
      </button>
      <div v-else class="quantity-controls">
        <button class="btn btn-qty" @click="cart.decrement(product.id)">−</button>
        <span class="qty">{{ inCart.quantity }}</span>
        <button class="btn btn-qty" @click="cart.increment(product.id)">+</button>
      </div>
    </div>
  </div>
</template>
