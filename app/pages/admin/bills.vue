<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">ประวัติบิล</h1>
      <p class="text-gray-500 text-sm mt-1">รายการบิลและยอดขายทั้งหมด</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-xl border border-green-100 p-5 shadow-sm">
        <p class="text-gray-500 text-sm">ยอดวันนี้</p>
        <p class="text-2xl font-bold text-green-500 mt-1">{{ formatPrice(dailyTotal) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-sky-100 p-5 shadow-sm">
        <p class="text-gray-500 text-sm">น้ำหนักวันนี้</p>
        <p class="text-2xl font-bold text-sky-500 mt-1">{{ formatWeight(dailyWeight) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-purple-100 p-5 shadow-sm">
        <p class="text-gray-500 text-sm">บิลวันนี้</p>
        <p class="text-2xl font-bold text-purple-500 mt-1">{{ todayBillCount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-sky-100 p-5 shadow-sm">
        <p class="text-gray-500 text-sm">รายได้รวม</p>
        <p class="text-2xl font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent mt-1">{{ formatPrice(totalRevenue) }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <!-- Date Filter -->
      <div class="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4">
        <Calendar class="w-5 h-5 text-gray-400" />
        <input
          v-model="filterDate"
          type="date"
          class="py-3 bg-transparent border-0 focus:ring-0 outline-none text-gray-800"
        />
      </div>
      <!-- Price Range -->
      <select 
        v-model="filterPriceRange" 
        class="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition-all"
      >
        <option value="">ทุกราคา</option>
        <option value="0-100">฿0 - ฿100</option>
        <option value="100-500">฿100 - ฿500</option>
        <option value="500-1000">฿500 - ฿1,000</option>
        <option value="1000+">฿1,000+</option>
      </select>
      <!-- Clear Filters -->
      <button 
        v-if="filterDate || filterPriceRange" 
        class="text-sm text-sky-500 hover:text-sky-600 px-4 flex items-center gap-2 transition-colors" 
        @click="clearFilters"
      >
        <X class="w-4 h-4" />
        ล้างตัวกรอง
      </button>
    </div>

    <!-- Bills Table -->
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg shadow-sky-50">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-sky-50">
            <tr>
              <th class="text-gray-600 font-medium text-left px-6 py-4">วันที่/เวลา</th>
              <th class="text-gray-600 font-medium text-center px-6 py-4">รายการ</th>
              <th class="text-gray-600 font-medium text-center px-6 py-4">น้ำหนักรวม</th>
              <th class="text-gray-600 font-medium text-right px-6 py-4">ยอดรวม</th>
              <th class="text-gray-600 font-medium text-center px-6 py-4">จัดการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="bill in filteredBills" :key="bill.id" class="hover:bg-sky-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-800">{{ formatDateShort(bill.timestamp) }}</div>
                <div class="text-xs text-gray-500">{{ formatTime(bill.timestamp) }}</div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="bg-sky-50 text-sky-600 text-sm px-3 py-1.5 rounded-lg">{{ bill.items.length }} รายการ</span>
              </td>
              <td class="px-6 py-4 text-center font-medium text-sky-600">{{ formatWeight(bill.totalWeight) }}</td>
              <td class="px-6 py-4 text-right font-bold text-green-500">{{ formatPrice(bill.totalPrice) }}</td>
              <td class="px-6 py-4">
                <div class="flex justify-center gap-2">
                  <button 
                    class="w-9 h-9 rounded-lg bg-sky-50 text-sky-500 hover:bg-sky-100 transition-colors flex items-center justify-center" 
                    @click="showBillDetail(bill)"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button 
                    class="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center" 
                    @click="confirmDelete(bill)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredBills.length === 0" class="text-center py-16">
        <Receipt class="w-16 h-16 text-sky-200 mx-auto mb-4" />
        <p class="text-gray-400">ไม่พบรายการบิล</p>
        <NuxtLink v-if="bills.length === 0" to="/" class="inline-block mt-4 px-6 py-2.5 rounded-xl font-medium text-white bg-sky-500 hover:bg-sky-400 transition-colors">
          ไปหน้าขาย
        </NuxtLink>
      </div>
    </div>

    <!-- Detail Modal -->
    <dialog ref="detailModal" class="modal">
      <div class="modal-box bg-white border border-gray-100 max-w-md rounded-2xl shadow-2xl">
        <h3 class="font-bold text-xl text-gray-800 mb-5">รายละเอียดบิล</h3>

        <div v-if="selectedBill" class="space-y-5">
          <div class="bg-sky-50 rounded-xl p-4 text-sm space-y-2">
            <div class="flex justify-between"><span class="text-gray-500">วันที่</span><span class="text-gray-800">{{ formatDateShort(selectedBill.timestamp) }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">เวลา</span><span class="text-gray-800">{{ formatTime(selectedBill.timestamp) }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">น้ำหนักรวม</span><span class="text-sky-600 font-medium">{{ formatWeight(selectedBill.totalWeight) }}</span></div>
          </div>

          <div class="space-y-2 max-h-56 overflow-y-auto">
            <div v-for="item in selectedBill.items" :key="item.id" class="flex items-center justify-between text-sm p-2 rounded-lg bg-gray-50">
              <div class="flex items-center gap-3">
                <img :src="item.imageUrl" :alt="item.name" class="w-10 h-10 rounded-lg object-cover ring-2 ring-sky-100" @error="handleImageError" />
                <div>
                  <span class="text-gray-800">{{ item.name }}</span>
                  <span class="text-gray-400 text-xs ml-2">({{ formatWeight(item.weight) }})</span>
                </div>
              </div>
              <span class="font-medium text-sky-600">{{ formatPrice(item.pricePerKg * item.weight) }}</span>
            </div>
          </div>

          <div class="border-t border-gray-100 pt-4 flex justify-between items-center">
            <span class="text-gray-600">รวม</span>
            <span class="text-2xl font-bold text-green-500">{{ formatPrice(selectedBill.totalPrice) }}</span>
          </div>
        </div>

        <div class="mt-6">
          <button 
            class="w-full py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" 
            @click="closeDetailModal"
          >
            ปิด
          </button>
        </div>
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
        <p class="text-gray-500 text-sm">บิลนี้จะถูกลบอย่างถาวร</p>
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
import { Calendar, Eye, Trash2, AlertTriangle, X, Receipt } from 'lucide-vue-next'
import type { Bill } from '~/composables/useBills'

const { bills, dailyTotal, dailyWeight, todayBillCount, loadBills, deleteBill, formatPrice, formatWeight } = useBills()

const detailModal = ref<HTMLDialogElement>()
const deleteModal = ref<HTMLDialogElement>()
const selectedBill = ref<Bill | null>(null)
const billToDelete = ref<Bill | null>(null)

const filterDate = ref('')
const filterPriceRange = ref('')

onMounted(() => { loadBills() })

const totalRevenue = computed(() => bills.value.reduce((sum, bill) => sum + bill.totalPrice, 0))

const filteredBills = computed(() => {
  return bills.value.filter(bill => {
    // Date filter
    if (filterDate.value) {
      const billDate = new Date(bill.timestamp).toISOString().split('T')[0]
      if (billDate !== filterDate.value) return false
    }
    // Price filter
    if (filterPriceRange.value) {
      const price = bill.totalPrice
      if (filterPriceRange.value === '0-100' && (price < 0 || price > 100)) return false
      if (filterPriceRange.value === '100-500' && (price < 100 || price > 500)) return false
      if (filterPriceRange.value === '500-1000' && (price < 500 || price > 1000)) return false
      if (filterPriceRange.value === '1000+' && price < 1000) return false
    }
    return true
  })
})

const clearFilters = () => { filterDate.value = ''; filterPriceRange.value = '' }

const formatDateShort = (timestamp: number) => new Date(timestamp).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })
const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })

const showBillDetail = (bill: Bill) => { selectedBill.value = bill; detailModal.value?.showModal() }
const closeDetailModal = () => { detailModal.value?.close(); selectedBill.value = null }

const confirmDelete = (bill: Bill) => { billToDelete.value = bill; deleteModal.value?.showModal() }
const closeDeleteModal = () => { deleteModal.value?.close(); billToDelete.value = null }
const doDelete = () => { if (billToDelete.value) { deleteBill(billToDelete.value.id); closeDeleteModal() } }

const handleImageError = (e: Event) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/E0F2FE/0284C7?text=🐟' }
</script>

