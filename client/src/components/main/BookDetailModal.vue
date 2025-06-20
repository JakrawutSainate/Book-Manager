<template>
  <div
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <button
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
        @click="$emit('close')"
      >
        &times;
      </button>
      <!-- ชื่อหนังสือ -->
      <h3 class="text-xl font-bold mb-4 text-gray-800">{{ book.title }}</h3>
      <!-- รูปภาพหน้าปก -->
      <div class="mb-4 flex justify-center">
        <img
          :src="
            book.image ||
            'https://marketplace.canva.com/EAFPHUaBrFc/1/0/1003w/canva-black-and-white-modern-alone-story-book-cover-QHBKwQnsgzs.jpg'
          "
          alt="Book cover"
          class="w-40 h-60 object-cover rounded border mx-auto mb-4"
        />
      </div>
      <div class="space-y-2 text-sm text-gray-700">
        <p><strong>ID:</strong> {{ book.id }}</p>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Published Year:</strong> {{ book.published_year ?? "–" }}</p>
        <p><strong>Genre:</strong> {{ book.genre ?? "–" }}</p>
        <p><strong>Created At:</strong> {{ book.created_at }}</p>
        <p><strong>Updated At:</strong> {{ book.updated_at }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  book: any;
}>();

defineEmits(["close"]);
</script>
