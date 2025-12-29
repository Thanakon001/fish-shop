<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">จัดการเมนู</h1>
        <p class="text-gray-500 text-sm">เพิ่ม แก้ไข และลบรายการอาหาร</p>
      </div>
      <button class="btn btn-primary rounded-full gap-2" @click="openModal()">
        <Plus class="w-4 h-4" />
        เพิ่มเมนูใหม่
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-3 mb-6">
      <!-- Search -->
      <div class="relative flex-1 max-w-sm">
        <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ค้นหาเมนู..."
          class="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none"
        />
      </div>
      <!-- Category Filter -->
      <select
        v-model="filterCategory"
        class="px-3 py-2.5 border border-gray-200 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none bg-white"
      >
        <option value="">ทุกหมวดหมู่</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="flex gap-4 mb-6">
      <div class="bg-white rounded-xl border border-gray-100 px-4 py-3">
        <span class="text-gray-500 text-sm">เมนูทั้งหมด</span>
        <span class="text-xl font-bold text-amber-600 ml-2">{{ menu.length }}</span>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 px-4 py-3">
        <span class="text-gray-500 text-sm">แสดง</span>
        <span class="text-xl font-bold text-amber-600 ml-2">{{ filteredMenu.length }}</span>
      </div>
    </div>

    <!-- Menu Table -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-gray-600 font-medium">รูป</th>
              <th class="text-gray-600 font-medium">ชื่อเมนู</th>
              <th class="text-gray-600 font-medium">หมวดหมู่</th>
              <th class="text-gray-600 font-medium text-right">ราคา</th>
              <th class="text-gray-600 font-medium text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredMenu" :key="item.id" class="hover:bg-amber-50/50">
              <td>
                <img :src="item.imageUrl" :alt="item.name" class="w-12 h-12 rounded-lg object-cover" @error="handleImageError" />
              </td>
              <td class="font-medium text-gray-800">{{ item.name }}</td>
              <td>
                <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ item.category }}</span>
              </td>
              <td class="text-right font-semibold text-amber-600">{{ formatPrice(item.price) }}</td>
              <td>
                <div class="flex justify-center gap-1">
                  <button class="btn btn-ghost btn-sm btn-circle text-blue-500" @click="openModal(item)">
                    <Pencil class="w-4 h-4" />
                  </button>
                  <button class="btn btn-ghost btn-sm btn-circle text-red-500" @click="confirmDelete(item)">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredMenu.length === 0" class="text-center py-12">
        <p class="text-gray-400">ไม่พบรายการเมนู</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <dialog ref="modal" class="modal">
      <div class="modal-box bg-white max-w-md rounded-2xl">
        <h3 class="font-bold text-lg text-gray-800 mb-4">
          {{ isEditing ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่' }}
        </h3>

        <form @submit.prevent="saveItem" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">ชื่อเมนู</label>
            <input v-model="form.name" type="text" placeholder="เช่น ส้มตำไทย" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">ราคา (บาท)</label>
            <input v-model.number="form.price" type="number" min="0" placeholder="0" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">หมวดหมู่</label>
            <select v-model="form.category" class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none bg-white" required>
              <option value="" disabled>เลือกหมวดหมู่</option>
              <option v-for="cat in defaultCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">URL รูปภาพ</label>
            <input v-model="form.imageUrl" type="url" placeholder="https://..." class="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none" />
          </div>

          <div v-if="form.imageUrl" class="flex justify-center">
            <img :src="form.imageUrl" alt="Preview" class="w-24 h-24 object-cover rounded-xl" @error="handleImageError" />
          </div>

          <div class="flex gap-2 pt-4">
            <button type="button" class="btn btn-ghost flex-1 rounded-full" @click="closeModal">ยกเลิก</button>
            <button type="submit" class="btn btn-primary flex-1 rounded-full">
              {{ isEditing ? 'บันทึก' : 'เพิ่ม' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>

    <!-- Delete Modal -->
    <dialog ref="deleteModal" class="modal">
      <div class="modal-box bg-white max-w-xs rounded-2xl text-center">
        <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle class="w-7 h-7 text-red-500" />
        </div>
        <h3 class="font-bold text-lg text-gray-800 mb-1">ยืนยันการลบ?</h3>
        <p class="text-gray-500 text-sm">{{ itemToDelete?.name }}</p>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-ghost flex-1 rounded-full" @click="closeDeleteModal">ยกเลิก</button>
          <button class="btn btn-error flex-1 rounded-full" @click="doDelete">ลบ</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus, Pencil, Trash2, Search, AlertTriangle } from 'lucide-vue-next'
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

const defaultCategories = ['ยำ/ส้มตำ', 'ของย่าง', 'ลาบ/น้ำตก', 'ต้ม/แกง', 'ข้าว', 'เครื่องเคียง', 'เครื่องดื่ม']

const form = ref({ name: '', price: 0, category: '', imageUrl: '' })

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
    form.value = { name: item.name, price: item.price, category: item.category, imageUrl: item.imageUrl }
  } else {
    isEditing.value = false
    editingId.value = null
    form.value = { name: '', price: 0, category: '', imageUrl: '' }
  }
  modal.value?.showModal()
}

const closeModal = () => { modal.value?.close() }

const saveItem = () => {
  if (!form.value.name || !form.value.price || !form.value.category) return
  const itemData = {
    name: form.value.name,
    price: form.value.price,
    category: form.value.category,
    imageUrl: form.value.imageUrl || 'https://via.placeholder.com/400x300/FEF3C7/D97706?text=🍗'
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
  img.src = 'https://via.placeholder.com/400x300/FEF3C7/D97706?text=🍗'
}
</script>
