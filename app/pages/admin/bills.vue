<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">ประวัติบิล</h1>
      <p class="text-gray-500 text-sm">รายการบิลและยอดขายทั้งหมด</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-gray-500 text-sm">ยอดวันนี้</p>
        <p class="text-xl font-bold text-green-600">{{ formatPrice(dailyTotal) }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-gray-500 text-sm">บิลวันนี้</p>
        <p class="text-xl font-bold text-amber-600">{{ todayBillCount }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-gray-500 text-sm">บิลทั้งหมด</p>
        <p class="text-xl font-bold text-amber-600">{{ bills.length }}</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 p-4">
        <p class="text-gray-500 text-sm">รายได้รวม</p>
        <p class="text-xl font-bold text-green-600">{{ formatPrice(totalRevenue) }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-3 mb-6">
      <!-- Date Filter -->
      <div class="flex items-center gap-2 bg-white rounded-full border border-gray-200 px-3">
        <Calendar class="w-4 h-4 text-gray-400" />
        <input
          v-model="filterDate"
          type="date"
          class="py-2.5 px-1 bg-transparent border-0 focus:ring-0 outline-none text-sm"
        />
      </div>
      <!-- Price Range -->
      <select v-model="filterPriceRange" class="px-3 py-2.5 border border-gray-200 rounded-full focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none bg-white text-sm">
        <option value="">ทุกราคา</option>
        <option value="0-100">฿0 - ฿100</option>
        <option value="100-300">฿100 - ฿300</option>
        <option value="300-500">฿300 - ฿500</option>
        <option value="500+">฿500+</option>
      </select>
      <!-- Clear Filters -->
      <button v-if="filterDate || filterPriceRange" class="text-sm text-gray-500 hover:text-amber-600 px-3" @click="clearFilters">
        <X class="w-4 h-4 inline" />
        ล้างตัวกรอง
      </button>
    </div>

    <!-- Bills Table -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="bg-gray-50">
            <tr>
              <th class="text-gray-600 font-medium">วันที่/เวลา</th>
              <th class="text-gray-600 font-medium text-center">รายการ</th>
              <th class="text-gray-600 font-medium text-right">ยอดรวม</th>
              <th class="text-gray-600 font-medium text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="bill in filteredBills" :key="bill.id" class="hover:bg-amber-50/50">
              <td>
                <div class="text-sm font-medium text-gray-800">{{ formatDateShort(bill.timestamp) }}</div>
                <div class="text-xs text-gray-400">{{ formatTime(bill.timestamp) }}</div>
              </td>
              <td class="text-center">
                <span class="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">{{ bill.items.length }} รายการ</span>
              </td>
              <td class="text-right font-bold text-green-600">{{ formatPrice(bill.totalPrice) }}</td>
              <td>
                <div class="flex justify-center gap-1">
                  <button class="btn btn-ghost btn-sm btn-circle text-blue-500" @click="showBillDetail(bill)">
                    <Eye class="w-4 h-4" />
                  </button>
                  <button class="btn btn-ghost btn-sm btn-circle text-red-500" @click="confirmDelete(bill)">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredBills.length === 0" class="text-center py-12">
        <p class="text-gray-400">ไม่พบรายการบิล</p>
        <NuxtLink v-if="bills.length === 0" to="/" class="btn btn-primary btn-sm rounded-full mt-3">
          ไปหน้าขาย
        </NuxtLink>
      </div>
    </div>

    <!-- Detail Modal -->
    <dialog ref="detailModal" class="modal">
      <div class="modal-box bg-white max-w-md rounded-2xl">
        <h3 class="font-bold text-lg text-gray-800 mb-4">รายละเอียดบิล</h3>

        <div v-if="selectedBill" class="space-y-4">
          <div class="bg-gray-50 rounded-xl p-3 text-sm">
            <div class="flex justify-between"><span class="text-gray-500">วันที่</span><span>{{ formatDateShort(selectedBill.timestamp) }}</span></div>
            <div class="flex justify-between mt-1"><span class="text-gray-500">เวลา</span><span>{{ formatTime(selectedBill.timestamp) }}</span></div>
          </div>

          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div v-for="item in selectedBill.items" :key="item.id" class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <img :src="item.imageUrl" :alt="item.name" class="w-8 h-8 rounded object-cover" @error="handleImageError" />
                <span>{{ item.name }} x{{ item.quantity }}</span>
              </div>
              <span class="font-medium">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="border-t pt-3 flex justify-between items-center">
            <span class="text-gray-600">รวม</span>
            <span class="text-xl font-bold text-green-600">{{ formatPrice(selectedBill.totalPrice) }}</span>
          </div>
        </div>

        <div class="mt-4">
          <button class="btn btn-ghost w-full rounded-full" @click="closeDetailModal">ปิด</button>
        </div>
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
        <p class="text-gray-500 text-sm">บิลนี้จะถูกลบอย่างถาวร</p>
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
import { Calendar, Eye, Trash2, AlertTriangle, X } from 'lucide-vue-next'
import type { Bill } from '~/composables/useBills'

const { bills, dailyTotal, todayBillCount, loadBills, deleteBill, formatPrice, formatDate } = useBills()

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
      if (filterPriceRange.value === '100-300' && (price < 100 || price > 300)) return false
      if (filterPriceRange.value === '300-500' && (price < 300 || price > 500)) return false
      if (filterPriceRange.value === '500+' && price < 500) return false
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

const handleImageError = (e: Event) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/FEF3C7/D97706?text=🍗' }
</script>
