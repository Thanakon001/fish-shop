<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold bg-gradient-to-r from-sky-500 to-cyan-500 bg-clip-text text-transparent">แดชบอร์ด</h1>
      <p class="text-gray-500 mt-1">ภาพรวมข้อมูลร้านปลาสดใหม่</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Today Sales -->
      <div class="bg-white rounded-2xl border border-green-100 p-6 shadow-lg shadow-green-50 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-green-500" />
          </div>
          <span class="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">วันนี้</span>
        </div>
        <p class="text-gray-500 text-sm mb-1">ยอดขายวันนี้</p>
        <p class="text-3xl font-bold text-green-500">{{ formatPrice(dailyTotal) }}</p>
        <p class="text-xs text-gray-400 mt-2">{{ todayBillCount }} รายการ</p>
      </div>

      <!-- Total Weight Today -->
      <div class="bg-white rounded-2xl border border-sky-100 p-6 shadow-lg shadow-sky-50 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
            <Scale class="w-6 h-6 text-sky-500" />
          </div>
          <span class="text-xs text-sky-500 bg-sky-50 px-2 py-1 rounded-full">วันนี้</span>
        </div>
        <p class="text-gray-500 text-sm mb-1">น้ำหนักขายวันนี้</p>
        <p class="text-3xl font-bold text-sky-500">{{ formatWeight(dailyWeight) }}</p>
        <p class="text-xs text-gray-400 mt-2">กิโลกรัม</p>
      </div>

      <!-- Total Revenue -->
      <div class="bg-white rounded-2xl border border-purple-100 p-6 shadow-lg shadow-purple-50 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <Wallet class="w-6 h-6 text-purple-500" />
          </div>
          <span class="text-xs text-purple-500 bg-purple-50 px-2 py-1 rounded-full">ทั้งหมด</span>
        </div>
        <p class="text-gray-500 text-sm mb-1">รายได้รวมทั้งหมด</p>
        <p class="text-3xl font-bold text-purple-500">{{ formatPrice(totalRevenue) }}</p>
        <p class="text-xs text-gray-400 mt-2">{{ bills.length }} บิล</p>
      </div>

      <!-- Total Products -->
      <div class="bg-white rounded-2xl border border-cyan-100 p-6 shadow-lg shadow-cyan-50 hover:shadow-xl transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
            <Fish class="w-6 h-6 text-cyan-500" />
          </div>
          <span class="text-xs text-cyan-500 bg-cyan-50 px-2 py-1 rounded-full">สินค้า</span>
        </div>
        <p class="text-gray-500 text-sm mb-1">สินค้าทั้งหมด</p>
        <p class="text-3xl font-bold text-cyan-500">{{ menu.length }}</p>
        <p class="text-xs text-gray-400 mt-2">{{ categories.length }} หมวดหมู่</p>
      </div>
    </div>

    <!-- Charts & Tables Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Recent Bills -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <Receipt class="w-5 h-5 text-sky-500" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-800">บิลล่าสุด</h2>
              <p class="text-xs text-gray-400">รายการขายล่าสุด 5 รายการ</p>
            </div>
          </div>
          <NuxtLink to="/admin/bills" class="text-sm text-sky-500 hover:text-sky-600 transition-colors">
            ดูทั้งหมด →
          </NuxtLink>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="bill in recentBills" :key="bill.id" class="p-4 hover:bg-sky-50/50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span class="text-lg">🧾</span>
                </div>
                <div>
                  <p class="font-medium text-gray-800">{{ bill.items.length }} รายการ</p>
                  <p class="text-xs text-gray-400">{{ formatDateShort(bill.timestamp) }} - {{ formatTime(bill.timestamp) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-bold text-green-500">{{ formatPrice(bill.totalPrice) }}</p>
                <p class="text-xs text-gray-400">{{ formatWeight(bill.totalWeight) }}</p>
              </div>
            </div>
          </div>
          <div v-if="recentBills.length === 0" class="p-8 text-center">
            <Receipt class="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p class="text-gray-400 text-sm">ยังไม่มีรายการขาย</p>
          </div>
        </div>
      </div>

      <!-- Top Products -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
              <TrendingUp class="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <h2 class="font-semibold text-gray-800">สินค้าขายดี</h2>
              <p class="text-xs text-gray-400">สินค้าที่ขายบ่อยที่สุด</p>
            </div>
          </div>
        </div>
        <div class="divide-y divide-gray-100">
          <div v-for="(product, index) in topProducts" :key="product.name" class="p-4 hover:bg-cyan-50/50 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                :class="index === 0 ? 'bg-yellow-100 text-yellow-600' : index === 1 ? 'bg-gray-100 text-gray-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-sky-50 text-sky-600'"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-800">{{ product.name }}</p>
                <p class="text-xs text-gray-400">{{ formatWeight(product.totalWeight) }}</p>
              </div>
              <p class="font-semibold text-sky-500">{{ product.count }} ครั้ง</p>
            </div>
          </div>
          <div v-if="topProducts.length === 0" class="p-8 text-center">
            <Fish class="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p class="text-gray-400 text-sm">ยังไม่มีข้อมูล</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Summary -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Package class="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 class="font-semibold text-gray-800">สินค้าตามหมวดหมู่</h2>
            <p class="text-xs text-gray-400">จำนวนสินค้าในแต่ละหมวดหมู่</p>
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div v-for="cat in categoryStats" :key="cat.name" 
            class="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl p-4 text-center hover:shadow-lg transition-shadow cursor-pointer"
          >
            <p class="text-2xl mb-2">{{ getCategoryEmoji(cat.name) }}</p>
            <p class="font-semibold text-gray-800">{{ cat.name }}</p>
            <p class="text-sky-500 text-lg font-bold">{{ cat.count }}</p>
            <p class="text-xs text-gray-400">รายการ</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TrendingUp, Scale, Wallet, Fish, Receipt, Package } from 'lucide-vue-next'

const { menu, categories, loadMenu } = useMenu()
const { bills, dailyTotal, dailyWeight, todayBillCount, loadBills, formatPrice, formatWeight } = useBills()

onMounted(() => {
  loadMenu()
  loadBills()
})

const totalRevenue = computed(() => bills.value.reduce((sum, bill) => sum + bill.totalPrice, 0))

const recentBills = computed(() => {
  return [...bills.value].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)
})

const topProducts = computed(() => {
  const productMap = new Map<string, { name: string; count: number; totalWeight: number }>()
  
  bills.value.forEach(bill => {
    bill.items.forEach(item => {
      const existing = productMap.get(item.name)
      if (existing) {
        existing.count++
        existing.totalWeight += item.weight
      } else {
        productMap.set(item.name, { name: item.name, count: 1, totalWeight: item.weight })
      }
    })
  })
  
  return Array.from(productMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const categoryStats = computed(() => {
  const catMap = new Map<string, number>()
  
  menu.value.forEach(item => {
    catMap.set(item.category, (catMap.get(item.category) || 0) + 1)
  })
  
  return Array.from(catMap.entries()).map(([name, count]) => ({ name, count }))
})

const formatDateShort = (timestamp: number) => new Date(timestamp).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
const formatTime = (timestamp: number) => new Date(timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })

const getCategoryEmoji = (category: string) => {
  const emojiMap: Record<string, string> = {
    'ปลาน้ำจืด': '🐟',
    'ปลาทะเล': '🐠',
    'กุ้ง': '🦐',
    'หอย': '🦪',
    'ปลาหมึก': '🦑',
    'ปู': '🦀'
  }
  return emojiMap[category] || '🐟'
}
</script>
