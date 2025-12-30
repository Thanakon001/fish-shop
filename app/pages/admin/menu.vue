<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">จัดการสินค้า</h1>
        <p class="text-gray-500 text-sm mt-1">เพิ่ม แก้ไข และลบรายการปลา/อาหารทะเล</p>
      </div>
      <button 
        class="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 shadow-lg shadow-sky-200 transition-all duration-300 flex items-center gap-2" 
        @click="openModal()"
      >
        <Plus class="w-5 h-5" />
        เพิ่มสินค้าใหม่
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- Search -->
      <div class="relative flex-1 max-w-sm">
        <Search class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาปลา/อาหารทะเล..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
        />
      </div>
      <!-- Category Filter -->
      <select
        v-model="filterCategory"
        class="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
      >
        <option value="">ทุกหมวดหมู่</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="flex gap-4 mb-6">
      <div class="bg-white rounded-xl border border-sky-100 px-5 py-4 shadow-sm">
        <span class="text-gray-500 text-sm">สินค้าทั้งหมด</span>
        <span class="text-2xl font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent ml-3">{{ menu.length }}</span>
      </div>
      <div class="bg-white rounded-xl border border-sky-100 px-5 py-4 shadow-sm">
        <span class="text-gray-500 text-sm">แสดง</span>
        <span class="text-2xl font-bold text-sky-600 ml-3">{{ filteredMenu.length }}</span>
      </div>
    </div>

    <!-- Menu Table -->
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg shadow-sky-50">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-sky-50">
            <tr>
              <th class="text-gray-600 font-medium text-left px-6 py-4">รูป</th>
              <th class="text-gray-600 font-medium text-left px-6 py-4">ชื่อสินค้า</th>
              <th class="text-gray-600 font-medium text-left px-6 py-4">หมวดหมู่</th>
              <th class="text-gray-600 font-medium text-right px-6 py-4">ราคา/กก.</th>
              <th class="text-gray-600 font-medium text-center px-6 py-4">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in filteredMenu" :key="item.id" class="hover:bg-sky-50/50 transition-colors">
              <td class="px-6 py-4">
                <img :src="item.imageUrl" :alt="item.name" class="w-14 h-14 rounded-xl object-cover ring-2 ring-sky-100" @error="handleImageError" />
              </td>
              <td class="px-6 py-4 font-medium text-gray-800">{{ item.name }}</td>
              <td class="px-6 py-4">
                <span class="text-sm text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg">{{ item.category }}</span>
              </td>
              <td class="px-6 py-4 text-right font-semibold text-sky-600">{{ formatPrice(item.pricePerKg) }}/กก.</td>
              <td class="px-6 py-4">
                <div class="flex justify-center gap-2">
                  <button 
                    class="w-9 h-9 rounded-lg bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors flex items-center justify-center" 
                    @click="openModal(item)"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button 
                    class="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center" 
                    @click="confirmDelete(item)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredMenu.length === 0" class="text-center py-16">
        <Fish class="w-16 h-16 text-sky-200 mx-auto mb-4" />
        <p class="text-gray-400">ไม่พบรายการสินค้า</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <dialog ref="modal" class="modal">
      <div class="modal-box bg-white border border-gray-100 max-w-md rounded-2xl shadow-2xl">
        <h3 class="font-bold text-xl text-gray-800 mb-6">
          {{ isEditing ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}
        </h3>

        <form @submit.prevent="saveItem" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">ชื่อสินค้า</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="เช่น ปลานิล" 
              class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all" 
              required 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">ราคา (บาท/กก.)</label>
            <input 
              v-model.number="form.pricePerKg" 
              type="number" 
              min="0" 
              placeholder="0" 
              class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all" 
              required 
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">หมวดหมู่</label>
            <select 
              v-model="form.category" 
              class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all" 
              required
            >
              <option value="" disabled>เลือกหมวดหมู่</option>
              <option v-for="cat in defaultCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-2">URL รูปภาพ</label>
            <input 
              v-model="form.imageUrl" 
              type="url" 
              placeholder="https://..." 
              class="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all" 
            />
          </div>

          <div v-if="form.imageUrl" class="flex justify-center">
            <img :src="form.imageUrl" alt="Preview" class="w-28 h-28 object-cover rounded-xl ring-2 ring-sky-100" @error="handleImageError" />
          </div>

          <div class="flex gap-3 pt-4">
            <button 
              type="button" 
              class="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" 
              @click="closeModal"
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              class="flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 transition-all"
            >
              {{ isEditing ? 'บันทึก' : 'เพิ่ม' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop bg-gray-900/50 backdrop-blur-sm"><button>close</button></form>
    </dialog>

    <!-- Delete Modal -->
    <dialog ref="deleteModal" class="modal">
      <div class="modal-box bg-white border border-red-100 max-w-xs rounded-2xl text-center shadow-2xl">
        <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle class="w-8 h-8 text-red-500" />
        </div>
        <h3 class="font-bold text-xl text-gray-800 mb-2">ยืนยันการลบ?</h3>
        <p class="text-gray-500 text-sm">{{ itemToDelete?.name }}</p>
        <div class="flex gap-3 mt-6">
          <button 
            class="flex-1 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" 
            @click="closeDeleteModal"
          >
            ยกเลิก
          </button>
          <button 
            class="flex-1 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-400 transition-colors" 
            @click="doDelete"
          >
            ลบ
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop bg-gray-900/50 backdrop-blur-sm"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus, Pencil, Trash2, Search, AlertTriangle, Fish } from 'lucide-vue-next'
import type { MenuItem } from '~/composables/useMenu'

const { menu, categories, loadMenu, addItem, updateItem, deleteItem } = useMenu()
const { formatPrice } = useBills()

const modal = ref<HTMLDialogElement>()
const deleteModal = ref<HTMLDialogElement>()
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const itemToDelete = ref<MenuItem | null>(null)

const searchQuery = ref('')
const filterCategory = ref('')

const defaultCategories = ['ปลาน้ำจืด', 'ปลาทะเล', 'กุ้ง', 'หอย', 'ปลาหมึก', 'ปู']

const form = ref({ name: '', pricePerKg: 0, category: '', imageUrl: '' })

onMounted(() => { loadMenu() })

const filteredMenu = computed(() => {
  return menu.value.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchCategory = !filterCategory.value || item.category === filterCategory.value
    return matchSearch && matchCategory
  })
})

const openModal = (item?: MenuItem) => {
  if (item) {
    isEditing.value = true
    editingId.value = item.id
    form.value = { name: item.name, pricePerKg: item.pricePerKg, category: item.category, imageUrl: item.imageUrl }
  } else {
    isEditing.value = false
    editingId.value = null
    form.value = { name: '', pricePerKg: 0, category: '', imageUrl: '' }
  }
  modal.value?.showModal()
}

const closeModal = () => { modal.value?.close() }

const saveItem = () => {
  if (!form.value.name || !form.value.pricePerKg || !form.value.category) return
  const itemData = {
    name: form.value.name,
    pricePerKg: form.value.pricePerKg,
    category: form.value.category,
    imageUrl: form.value.imageUrl || 'https://via.placeholder.com/400x300/E0F2FE/0284C7?text=🐟'
  }
  if (isEditing.value && editingId.value) {
    updateItem(editingId.value, itemData)
  } else {
    addItem(itemData)
  }
  closeModal()
}

const confirmDelete = (item: MenuItem) => {
  itemToDelete.value = item
  deleteModal.value?.showModal()
}
const closeDeleteModal = () => { deleteModal.value?.close(); itemToDelete.value = null }
const doDelete = () => { if (itemToDelete.value) { deleteItem(itemToDelete.value.id); closeDeleteModal() } }

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/400x300/E0F2FE/0284C7?text=🐟'
}
</script>

