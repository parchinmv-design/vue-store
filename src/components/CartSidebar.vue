<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const cart = useCartStore()

const promoInput = ref('')
const promoError = ref('')
const promoSuccess = ref('')

function tryApplyPromo() {
  promoError.value = ''
  promoSuccess.value = ''
  if (cart.applyPromo(promoInput.value)) {
    promoSuccess.value = 'Промокод применён: скидка 10%'
    promoInput.value = ''
  } else {
    promoError.value = 'Промокод не найден'
  }
}
</script>

<template>
  <div class="overlay" :class="{ hidden: !open }" @click="emit('close')"></div>

  <aside class="cart-sidebar" :class="{ closed: !open }">
    <div class="cart-header">
      <h2>Корзина</h2>
      <button class="btn-close" @click="emit('close')">✕</button>
    </div>

    <div v-if="cart.items.length === 0" class="cart-empty">
      <p>Корзина пуста</p>
    </div>

    <template v-else>
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.product.id" class="cart-item">
          <span class="cart-item-image">{{ item.product.image }}</span>
          <div class="cart-item-info">
            <span class="cart-item-name">{{ item.product.name }}</span>
            <span class="cart-item-price">
              <template v-if="cart.discountPercent > 0">
                <s class="old-price">{{ (item.product.price * item.quantity).toLocaleString('ru-RU') }} ₽</s>
                <span class="new-price">{{ (cart.discountedPrice(item.product.price) * item.quantity).toLocaleString('ru-RU') }} ₽</span>
              </template>
              <template v-else>{{ (item.product.price * item.quantity).toLocaleString('ru-RU') }} ₽</template>
            </span>
          </div>
          <div class="quantity-controls">
            <button class="btn btn-qty" @click="cart.decrement(item.product.id)">−</button>
            <span class="qty">{{ item.quantity }}</span>
            <button class="btn btn-qty" @click="cart.increment(item.product.id)">+</button>
          </div>
          <button class="btn-remove" @click="cart.removeItem(item.product.id)" title="Удалить">🗑</button>
        </div>
      </div>

      <div class="promo-section">
        <div class="promo-row">
          <input
            v-model="promoInput"
            type="text"
            placeholder="Промокод (например, WEB)"
            class="promo-input"
            @keyup.enter="tryApplyPromo"
          />
          <button class="btn btn-primary" @click="tryApplyPromo">Применить</button>
        </div>
        <p v-if="promoError" class="promo-msg error">{{ promoError }}</p>
        <p v-if="promoSuccess" class="promo-msg success">{{ promoSuccess }}</p>
        <p v-if="cart.appliedPromo" class="promo-msg success">
          Активен промокод {{ cart.appliedPromo }} — скидка {{ cart.discountPercent }}%
        </p>
      </div>

      <div class="cart-summary">
        <div class="summary-row">
          <span>Товары:</span>
          <span>{{ cart.totalCount }} шт.</span>
        </div>
        <div v-if="cart.discountPercent > 0" class="summary-row discount">
          <span>Скидка:</span>
          <span>−{{ cart.discountPercent }}%</span>
        </div>
        <div class="summary-row total">
          <span>Итого:</span>
          <span>{{ cart.total.toLocaleString('ru-RU') }} ₽</span>
        </div>
      </div>

      <div class="cart-actions">
        <button class="btn btn-danger" @click="cart.clearCart()">Очистить корзину</button>
        <button class="btn btn-primary btn-checkout">Оформить заказ</button>
      </div>
    </template>
  </aside>
</template>
