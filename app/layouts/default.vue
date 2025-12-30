<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 flex">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 h-screen w-64 bg-white border-r border-sky-100 shadow-lg shadow-sky-100/20 z-50 flex flex-col">
      <!-- Logo -->
      <div class="p-6 border-b border-sky-100">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-200 group-hover:shadow-sky-300 transition-all duration-300">
            <span class="text-2xl">🐟</span>
          </div>
          <div>
            <span class="font-bold text-lg bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent block">
              ปลาสดใหม่
            </span>
            <span class="text-xs text-gray-400">Fish Shop POS</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">เมนูหลัก</p>
        
        <NuxtLink 
          to="/dashboard" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
          :class="route.path === '/dashboard' 
            ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200' 
            : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50'"
        >
          <LayoutDashboard class="w-5 h-5" />
          แดชบอร์ด
        </NuxtLink>

        <NuxtLink 
          to="/" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
          :class="route.path === '/' 
            ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200' 
            : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50'"
        >
          <Scale class="w-5 h-5" />
          หน้าขาย
        </NuxtLink>

        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3 mt-6">จัดการ</p>

        <NuxtLink 
          to="/admin/menu" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
          :class="route.path === '/admin/menu' 
            ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200' 
            : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50'"
        >
          <Fish class="w-5 h-5" />
          สินค้า
        </NuxtLink>

        <NuxtLink 
          to="/admin/bills" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
          :class="route.path === '/admin/bills' 
            ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-200' 
            : 'text-gray-600 hover:text-sky-600 hover:bg-sky-50'"
        >
          <Receipt class="w-5 h-5" />
          ประวัติบิล
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-sky-100">
        <div class="bg-sky-50 rounded-xl p-4">
          <p class="text-xs text-gray-500 mb-1">ระบบขายปลา</p>
          <p class="text-sm font-medium text-sky-600">v1.0.0</p>
        </div>
      </div>
    </aside>

    <!-- Mobile Sidebar Toggle -->
    <button 
      class="fixed top-4 left-4 z-50 md:hidden w-10 h-10 rounded-xl bg-white shadow-lg flex items-center justify-center text-sky-600"
      @click="sidebarOpen = !sidebarOpen"
    >
      <Menu class="w-5 h-5" />
    </button>

    <!-- Main Content -->
    <main class="flex-1 ml-64 p-6 min-h-screen">
      <!-- Animated Background Shapes -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none ml-64">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute top-1/2 -left-40 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
        <div class="absolute -bottom-40 right-1/4 w-72 h-72 bg-sky-100/30 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 4s;"></div>
      </div>

      <div class="relative z-10">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Scale, Fish, Receipt, Menu, LayoutDashboard } from 'lucide-vue-next'

const route = useRoute()
const sidebarOpen = ref(false)
</script>

<style>
body {
  font-family: 'Sarabun', sans-serif;
  background-color: #FFFFFF;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #F0F9FF;
}

::-webkit-scrollbar-thumb {
  background: #BAE6FD;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0EA5E9;
}
</style>

