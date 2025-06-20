<!-- src/pages/library/index.vue -->
<template>
  <div class="space-y-10">
    <div class="flex flex-col md:flex-row gap-6">
      <WelcomeCard @book-created="onBookCreated" />
    </div>
    <BookTable :refreshKey="refreshKey" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import WelcomeCard from '@/components/library/WelcomeCard.vue'
import BookTable from '@/components/library/BookTable.vue'

const refreshKey = ref(0)
function onBookCreated() {
  refreshKey.value++ 
}
</script>
