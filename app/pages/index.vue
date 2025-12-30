<template>
  <div class="min-h-[calc(100vh-160px)]">
    <!-- Main Content - Split Layout -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Left: Menu Grid -->
      <div class="flex-1">
        <!-- Category Filter -->
        <div class="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            class="px-5 py-2 text-sm font-medium whitespace-nowrap rounded-xl transition-all duration-300"
            :class="selectedCategory === null 
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200' 
              : 'bg-white text-gray-600 hover:bg-sky-50 hover:text-sky-600 border border-gray-200'"
            @click="selectedCategory = null"
          >
            ทั้งหมด
          </button>
          <button
            v-for="cat in categories"
            :key="cat"
            class="px-5 py-2 text-sm font-medium whitespace-nowrap rounded-xl transition-all duration-300"
            :class="selectedCategory === cat 
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200' 
              : 'bg-white text-gray-600 hover:bg-sky-50 hover:text-sky-600 border border-gray-200'"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Menu Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          <div
            v-for="item in filteredMenu"
            :key="item.id"
            class="bg-white rounded-2xl border border-gray-100 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300 cursor-pointer overflow-hidden group"
            @click="openWeightModal(item)"
          >
            <div class="aspect-square overflow-hidden relative">
              <img
                :src="item.imageUrl"
                :alt="item.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                @error="handleImageError"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent"></div>
              <div class="absolute bottom-0 left-0 right-0 p-3">
                <span class="text-white text-sm font-bold">{{ formatPrice(item.pricePerKg) }}/กก.</span>
              </div>
            </div>
            <div class="p-3">
              <h3 class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</h3>
              <p class="text-sky-600 text-xs mt-1">{{ item.category }}</p>
            </div>
          </div>
        </div>

        <div v-if="filteredMenu.length === 0" class="text-center py-16">
          <Fish class="w-16 h-16 text-sky-200 mx-auto mb-4" />
          <p class="text-gray-400">ไม่พบรายการปลา/อาหารทะเล</p>
        </div>
      </div>

      <!-- Right: Cart Panel -->
      <div class="lg:w-80">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-sky-100/30 sticky top-24">
          <!-- Cart Header -->
          <div class="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 class="font-semibold text-gray-800 flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                <Scale class="w-4 h-4 text-sky-600" />
              </div>
              ตะกร้า ({{ itemCount }} รายการ)
            </h2>
            <button
              v-if="cart.length > 0"
              class="text-sm text-red-500 hover:text-red-600 transition-colors"
              @click="clearCart"
            >
              ล้าง
            </button>
          </div>

          <!-- Cart Items -->
          <div class="p-4">
            <div v-if="cart.length > 0" class="space-y-3 max-h-72 overflow-y-auto">
              <div
                v-for="item in cart"
                :key="item.id"
                class="flex items-center gap-3 p-2 rounded-xl bg-gray-50 hover:bg-sky-50/50 transition-colors"
              >
                <img
                  :src="item.imageUrl"
                  :alt="item.name"
                  class="w-12 h-12 rounded-lg object-cover ring-2 ring-sky-100"
                  @error="handleImageError"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-800 truncate">{{ item.name }}</h4>
                  <p class="text-sky-600 text-sm">{{ formatWeight(item.weight) }} × {{ formatPrice(item.pricePerKg) }}</p>
                </div>
                <div class="flex items-center gap-1 bg-white rounded-full px-1 border border-gray-200">
                  <button
                    class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-sky-600 transition-colors"
                    @click="decrementWeight(item.id)"
                  >
                    <Minus class="w-3 h-3" />
                  </button>
                  <span class="w-10 text-center text-sm font-medium text-gray-800">{{ item.weight }}</span>
                  <button
                    class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-sky-600 transition-colors"
                    @click="incrementWeight(item.id)"
                  >
                    <Plus class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty Cart -->
            <div v-else class="text-center py-10">
              <div class="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-4">
                <Fish class="w-8 h-8 text-sky-300" />
              </div>
              <p class="text-gray-500 text-sm">ตะกร้าว่างเปล่า</p>
              <p class="text-gray-400 text-xs mt-1">คลิกปลาเพื่อเพิ่มลงตะกร้า</p>
            </div>
          </div>

          <!-- Cart Footer -->
          <div v-if="cart.length > 0" class="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
            <div class="flex justify-between items-center mb-2 text-sm">
              <span class="text-gray-500">น้ำหนักรวม</span>
              <span class="font-medium text-gray-700">{{ formatWeight(totalWeight) }}</span>
            </div>
            <div class="flex justify-between items-center mb-4">
              <span class="text-gray-600">รวมทั้งหมด</span>
              <span class="text-2xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                {{ formatPrice(total) }}
              </span>
            </div>
            <button
              class="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 shadow-lg shadow-sky-200 transition-all duration-300 flex items-center justify-center gap-2"
              @click="confirmPayment"
            >
              <CheckCircle class="w-5 h-5" />
              บันทึกรายการ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Weight Input Modal -->
    <dialog ref="weightModal" class="modal">
      <div class="modal-box bg-white border border-gray-100 max-w-xs rounded-2xl text-center shadow-2xl">
        <div v-if="selectedItem" class="space-y-5">
          <div class="relative">
            <img
              :src="selectedItem.imageUrl"
              :alt="selectedItem.name"
              class="w-28 h-28 rounded-2xl object-cover mx-auto ring-4 ring-sky-100"
              @error="handleImageError"
            />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800">{{ selectedItem.name }}</h3>
            <p class="text-sky-600 font-semibold mt-1">{{ formatPrice(selectedItem.pricePerKg) }}/กก.</p>
          </div>
          
          <div class="bg-sky-50 rounded-xl p-4">
            <label class="block text-sm font-medium text-gray-600 mb-3">ใส่น้ำหนัก (กก.)</label>
            <div class="flex items-center justify-center gap-3">
              <button 
                class="w-10 h-10 rounded-xl bg-gray-200 text-gray-600 hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center"
                @click="inputWeight = Math.max(0, Number((inputWeight - 0.5).toFixed(2)))"
              >
                <Minus class="w-5 h-5" />
              </button>
              <input 
                v-model.number="inputWeight"
                type="number" 
                step="0.1"
                min="0.1"
                class="w-24 text-center text-3xl font-bold bg-transparent text-gray-800 border-b-2 border-sky-500 focus:outline-none"
              />
              <button 
                class="w-10 h-10 rounded-xl bg-gray-200 text-gray-600 hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center"
                @click="inputWeight = Number((inputWeight + 0.5).toFixed(2))"
              >
                <Plus class="w-5 h-5" />
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-3">
              ราคา: <span class="font-bold text-sky-600">{{ formatPrice(selectedItem.pricePerKg * inputWeight) }}</span>
            </p>
          </div>

          <div class="flex gap-3 pt-2">
            <button 
              class="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" 
              @click="closeWeightModal"
            >
              ยกเลิก
            </button>
            <button 
              class="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 transition-all flex items-center justify-center gap-2" 
              @click="addItemToCart"
              :disabled="inputWeight <= 0"
            >
              <Plus class="w-4 h-4" />
              เพิ่ม
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop bg-gray-900/50 backdrop-blur-sm"><button>close</button></form>
    </dialog>

    <!-- Success Modal -->
    <dialog v-if="showSuccess" class="modal modal-open">
      <div class="modal-box bg-white border border-sky-100 max-w-xs rounded-2xl text-center shadow-2xl" @click.stop>
        <div class="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle class="w-10 h-10 text-sky-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-800 mb-2">บันทึกสำเร็จ!</h3>
        <p class="text-gray-500 text-sm">รายการถูกบันทึกเรียบร้อย</p>
        <button 
          class="mt-6 px-8 py-2.5 rounded-xl font-medium text-white bg-sky-500 hover:bg-sky-400 transition-colors" 
          @click="showSuccess = false"
        >
          ตกลง
        </button>
      </div>
      <div class="modal-backdrop bg-gray-900/50 backdrop-blur-sm" @click="showSuccess = false"></div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import {
  Fish,
  Scale,
  Plus,
  Minus,
  CheckCircle
} from 'lucide-vue-next'
import type { MenuItem } from '~/composables/useMenu'

const { menu, categories, loadMenu } = useMenu()
const { cart, total, totalWeight, itemCount, addToCart, incrementWeight, decrementWeight, clearCart } = useCart()
const { loadBills, createBill, formatPrice, formatWeight } = useBills()

const selectedCategory = ref<string | null>(null)
const showSuccess = ref(false)
const weightModal = ref<HTMLDialogElement>()
const selectedItem = ref<MenuItem | null>(null)
const inputWeight = ref(1)

onMounted(() => {
  loadMenu()
  loadBills()
})

const filteredMenu = computed(() => {
  if (!selectedCategory.value) return menu.value
  return menu.value.filter(item => item.category === selectedCategory.value)
})

const openWeightModal = (item: MenuItem) => {
  selectedItem.value = item
  inputWeight.value = 1
  weightModal.value?.showModal()
}

const closeWeightModal = () => {
  weightModal.value?.close()
  selectedItem.value = null
}

const addItemToCart = () => {
  if (selectedItem.value && inputWeight.value > 0) {
    addToCart(selectedItem.value, inputWeight.value)
    closeWeightModal()
  }
}

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
  img.src = 'https://via.placeholder.com/400x300/E0F2FE/0284C7?text=🐟'
}
</script>
