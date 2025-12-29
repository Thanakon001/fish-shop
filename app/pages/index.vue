<template>
  <div class="min-h-[calc(100vh-160px)]">
    <!-- Main Content - Split Layout -->
    <div class="flex flex-col lg:flex-row gap-4">
      <!-- Left: Menu Grid -->
      <div class="flex-1">
        <!-- Category Filter -->
        <div class="flex items-center gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            class="px-4 py-1.5 text-sm font-medium whitespace-nowrap rounded-full transition-all"
            :class="selectedCategory === null 
              ? 'bg-amber-500 text-white shadow-sm' 
              : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'"
            @click="selectedCategory = null"
          >
            ทั้งหมด
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            class="px-4 py-1.5 text-sm font-medium whitespace-nowrap rounded-full transition-all"
            :class="selectedCategory === cat 
              ? 'bg-amber-500 text-white shadow-sm' 
              : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Menu Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          <div
            v-for="item in filteredMenu"
            :key="item.id"
            class="bg-white rounded-xl border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
            @click="addToCart(item)"
          >
            <div class="aspect-square overflow-hidden">
              <img
                :src="item.imageUrl"
                :alt="item.name"
                class="w-full h-full object-cover hover:scale-105 transition-transform"
                @error="handleImageError"
              />
            </div>
            <div class="p-2">
              <h3 class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</h3>
              <p class="text-amber-600 font-bold">{{ formatPrice(item.price) }}</p>
            </div>
          </div>
        </div>

        <div v-if="filteredMenu.length === 0" class="text-center py-12">
          <p class="text-gray-400">ไม่พบรายการอาหาร</p>
        </div>
      </div>

      <!-- Right: Cart Panel -->
      <div class="lg:w-80">
        <div class="bg-white rounded-xl border border-amber-100 sticky top-20">
          <!-- Cart Header -->
          <div class="flex items-center justify-between p-4 border-b border-amber-100">
            <h2 class="font-semibold text-gray-800 flex items-center gap-2">
              <ShoppingBag class="w-5 h-5 text-amber-500" />
              ตะกร้า ({{ itemCount }})
            </h2>
            <button
              v-if="cart.length > 0"
              class="text-sm text-red-500 hover:text-red-600"
              @click="clearCart"
            >
              ล้าง
            </button>
          </div>

          <!-- Cart Items -->
          <div class="p-4">
            <div v-if="cart.length > 0" class="space-y-3 max-h-64 overflow-y-auto">
              <div
                v-for="item in cart"
                :key="item.id"
                class="flex items-center gap-3"
              >
                <img
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="w-12 h-12 rounded-lg object-cover"
                  @error="handleImageError"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</h4>
                  <p class="text-amber-600 text-sm">{{ formatPrice(item.price) }}</p>
                </div>
                <div class="flex items-center gap-1 bg-gray-100 rounded-full px-1">
                  <button
                    class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-amber-600"
                    @click="decrementQuantity(item.id)"
                  >
                    <Minus class="w-3 h-3" />
                  </button>
                  <span class="w-6 text-center text-sm font-medium">{{ item.quantity }}</span>
                  <button
                    class="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-amber-600"
                    @click="incrementQuantity(item.id)"
                  >
                    <Plus class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty Cart -->
            <div v-else class="text-center py-8">
              <ShoppingCart class="w-12 h-12 text-gray-200 mx-auto mb-2" />
              <p class="text-gray-400 text-sm">ตะกร้าว่างเปล่า</p>
            </div>
          </div>

          <!-- Cart Footer -->
          <div v-if="cart.length > 0" class="p-4 border-t border-amber-100">
            <div class="flex justify-between items-center mb-3">
              <span class="text-gray-600">รวม</span>
              <span class="text-xl font-bold text-amber-600">{{ formatPrice(total) }}</span>
            </div>
            <button
              class="btn btn-primary btn-block rounded-full"
              @click="confirmPayment"
            >
              <CheckCircle class="w-4 h-4" />
              บันทึกรายการ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50" @click="showSuccess = false">
      <div class="bg-white rounded-2xl p-6 shadow-xl text-center max-w-xs mx-4" @click.stop>
        <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <CheckCircle class="w-8 h-8 text-green-500" />
        </div>
        <h3 class="text-lg font-bold text-gray-800 mb-1">บันทึกสำเร็จ!</h3>
        <p class="text-gray-500 text-sm">รายการถูกบันทึกเรียบร้อย</p>
        <button class="btn btn-primary btn-sm rounded-full mt-4" @click="showSuccess = false">
          ตกลง
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ShoppingCart,
  ShoppingBag,
  Plus,
  Minus,
  CheckCircle
} from 'lucide-vue-next'

const { menu, categories, loadMenu } = useMenu()
const { cart, total, itemCount, addToCart, removeFromCart, incrementQuantity, decrementQuantity, clearCart } = useCart()
const { loadBills, createBill, formatPrice } = useBills()

const selectedCategory = ref<string | null>(null)
const showSuccess = ref(false)

onMounted(() => {
  loadMenu()
  loadBills()
})

const filteredMenu = computed(() => {
  if (!selectedCategory.value) return menu.value
  return menu.value.filter(item => item.category === selectedCategory.value)
})

const confirmPayment = () => {
  if (cart.value.length === 0) return
  createBill(cart.value, total.value)
  clearCart()
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 2000)
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/400x300/FEF3C7/D97706?text=🍗'
}
</script>
