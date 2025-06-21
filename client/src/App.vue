<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <div class="flex-1 bg-gray-50 text-gray-800 p-4">
      <router-view />
    </div>
  </div>
</template>

<!-- Component ที่ไว้ใช้ทุกหน้า -->
<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
</script>
