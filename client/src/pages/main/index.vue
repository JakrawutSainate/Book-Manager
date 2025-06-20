<template>
  <div class="space-y-10">
    <MainHeader
      :books="books"
      :genreCountMap="genreCountMap"
    />

    <BookList
      :books="books"
      :genres="genres"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import axios from "axios"
import MainHeader from "@/components/main/MainHeader.vue"
import BookList from "@/components/main/BookList.vue"

interface Book {
  id: number
  title: string
  author: string
  published_year: number | null
  genre: string | null
  created_at: string
  updated_at: string
  image?: string
}

const books = ref<Book[]>([])

async function fetchBooks() {
  try {
    const res = await axios.get<{ status: string; data: Book[] }>(
      "http://localhost:5000/api/books"
    )
    books.value = res.data.data
  } catch (err) {
    console.error("โหลดหนังสือไม่สำเร็จ:", err)
  }
}

onMounted(fetchBooks)

const genres = computed<string[]>(() => {
  const onlyStrings = books.value
    .map((b) => b.genre)
    .filter((g): g is string => !!g)
  return Array.from(new Set(onlyStrings))
})

const genreCountMap = computed<Record<string, number>>(() =>
  books.value.reduce((acc, book) => {
    const g = book.genre ?? "Unknown"
    acc[g] = (acc[g] || 0) + 1
    return acc
  }, {} as Record<string, number>)
)
</script>
