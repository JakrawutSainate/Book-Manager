<template>
  <div class="flex">
    <!-- Sidebar: Desktop only -->
    <aside
      class="hidden md:flex w-64 min-h-screen bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-md flex-col"
    >
      <!-- Header -->
      <div class="px-6 py-6 border-b border-gray-200">
        <h1 class="text-2xl text-center font-bold text-gray-800 tracking-tight">
          Book Management
        </h1>
      </div>

      <!-- Menu Items -->
      <nav
        class="flex flex-col gap-4 px-4 pt-6 pb-10 bg-white border border-gray-100 shadow-inner text-gray-700 text-base font-medium h-full"
      >
        <!-- Navigation Menu -->
        <RouterLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          class="relative group flex items-center justify-center text-center rounded-xl px-5 py-3 transition-all duration-300 overflow-hidden"
          :class="[
            route.path === item.to
              ? 'bg-gray-50 text-black font-semibold'
              : 'hover:bg-gray-50 hover:text-black',
          ]"
        >
          <span class="relative z-10">{{ item.label }}</span>
          <span
            class="absolute bg-indigo-500 transition-all duration-700 ease-in-out"
            :class="[
              route.path === item.to
                ? 'w-full h-full right-0 top-0 bottom-0 rounded-xl opacity-10'
                : 'w-1 h-6 right-2 top-1/2 transform -translate-y-1/2 rounded-full opacity-80 group-hover:w-full group-hover:h-full group-hover:rounded-xl group-hover:opacity-10 group-hover:right-0 group-hover:top-0 group-hover:transform-none',
            ]"
          ></span>
        </RouterLink>

        <!-- Dynamic Sections -->
        <div
          class="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-700 divide-y divide-gray-100 space-y-4"
        >
          <!-- Recently Added -->
          <div class="pt-2 space-y-2">
            <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Recently Added
            </h2>
            <ul class="space-y-1" v-if="recentlyAdded.length">
              <li v-for="book in addedSlice" :key="book.id">{{ book.title }}</li>
              <li v-if="addedOverflow">…</li>
            </ul>
            <div v-else class="text-gray-500 italic">No recently added books</div>
          </div>

          <!-- Recently Updated -->
          <div class="pt-4 space-y-2">
            <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Recently Updated
            </h2>
            <ul class="space-y-1" v-if="recentlyUpdated.length">
              <li v-for="book in updatedSlice" :key="book.id">{{ book.title }}</li>
              <li v-if="updatedOverflow">…</li>
            </ul>
            <div v-else class="text-gray-500 italic">No recently updated books</div>
          </div>

          <!-- Random Pick -->
          <div class="pt-4 space-y-2">
            <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Random Pick
            </h2>
            <div v-if="randomPick" class="space-y-1">
              <div class="text-gray-800 font-medium">“{{ randomPick.title }}”</div>
              <div class="text-xs text-gray-500">by {{ randomPick.author }}</div>
            </div>
            <div v-else class="text-gray-500 italic">No random pick available</div>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Bottom Nav: Mobile only -->
    <div
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-inner flex justify-around items-center py-2 md:hidden z-50"
    >
      <RouterLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center text-xs text-gray-600 hover:text-indigo-500 transition"
        :class="[route.path === item.to ? 'text-indigo-500 font-semibold' : '']"
      >
        <span>{{ item.label }}</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

interface SimpleBook {
  id: number
  title: string
}
interface RandomPick {
  id: number
  title: string
  author: string
}

const route = useRoute()
const menuItems = [
  { to: '/', label: 'Home' },
  { to: '/library', label: 'My Library' },
]

// State for recent books
const recentlyAdded = ref<SimpleBook[]>([])
const recentlyUpdated = ref<SimpleBook[]>([])
const randomPick = ref<RandomPick | null>(null)

// Slices and overflow flags
const addedSlice = computed(() => recentlyAdded.value.slice(0, 3))
const addedOverflow = computed(() => recentlyAdded.value.length > 3)
const updatedSlice = computed(() => recentlyUpdated.value.slice(0, 3))
const updatedOverflow = computed(() => recentlyUpdated.value.length > 3)

// Fetch recent data
async function fetchRecent() {
  try {
    const response = await axios.get<{
      status: string
      data: {
        recentlyAdded: SimpleBook[]
        recentlyUpdated: SimpleBook[]
        randomPick: RandomPick
      }
    }>('http://localhost:5000/api/books/recent')
    const { recentlyAdded: ra, recentlyUpdated: ru, randomPick: rp } = response.data.data
    recentlyAdded.value = ra
    recentlyUpdated.value = ru
    randomPick.value = rp
  } catch (error) {
    console.error('Failed to fetch recent books:', error)
  }
}

let intervalId: number
onMounted(() => {
  fetchRecent()
  intervalId = window.setInterval(fetchRecent, 30_000)
})
onUnmounted(() => {
  clearInterval(intervalId)
})
</script>
