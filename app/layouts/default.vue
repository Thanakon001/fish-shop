<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-14">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <span class="text-2xl">🍗</span>
            <span class="font-bold text-gray-800">อีสานกินแหลก</span>
          </NuxtLink>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-1">
            <NuxtLink 
              to="/" 
              class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              :class="route.path === '/' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-100'"
            >
              <ShoppingCart class="w-4 h-4 inline mr-1" />
              หน้าขาย
            </NuxtLink>
            <NuxtLink 
              to="/admin/menu" 
              class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              :class="route.path === '/admin/menu' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-100'"
            >
              <MenuSquare class="w-4 h-4 inline mr-1" />
              เมนู
            </NuxtLink>
            <NuxtLink 
              to="/admin/bills" 
              class="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              :class="route.path === '/admin/bills' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:bg-gray-100'"
            >
              <Receipt class="w-4 h-4 inline mr-1" />
              บิล
            </NuxtLink>
          </div>

          <!-- Mobile Menu -->
          <div class="dropdown dropdown-end md:hidden">
            <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
              <Menu class="w-5 h-5" />
            </label>
            <ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-lg bg-white rounded-xl w-48 mt-2 border border-gray-100">
              <li><NuxtLink to="/" class="text-gray-700"><ShoppingCart class="w-4 h-4" />หน้าขาย</NuxtLink></li>
              <li><NuxtLink to="/admin/menu" class="text-gray-700"><MenuSquare class="w-4 h-4" />เมนู</NuxtLink></li>
              <li><NuxtLink to="/admin/bills" class="text-gray-700"><Receipt class="w-4 h-4" />บิล</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="container mx-auto p-4">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ShoppingCart, MenuSquare, Receipt, Menu } from 'lucide-vue-next'

const route = useRoute()
</script>

<style>
body {
  font-family: 'Sarabun', sans-serif;
}
</style>
