<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <h3 class="text-xl font-bold mb-6 text-gray-800">Book List</h3>

    <!-- Filter -->
    <div class="flex flex-wrap gap-3 mb-4">
      <button
        @click="setGenre('All')"
        :class="buttonClass('All')"
        class="px-4 py-2 rounded-full"
      >
        All
      </button>
      <button
        v-for="genre in genres"
        :key="genre"
        @click="setGenre(genre)"
        :class="buttonClass(genre)"
        class="px-4 py-2 rounded-full"
      >
        {{ genre }}
      </button>
    </div>

    <!-- Search -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search book title..."
      class="w-full border px-4 py-2 rounded-lg mb-6"
    />

    <!-- Book Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5"
    >
      <div
        v-for="book in paginatedBooks"
        :key="book.id"
        class="rounded-lg p-4 flex flex-col items-center bg-white shadow hover:shadow-md transition"
      >
        <div
          class="w-44 aspect-[3/4] overflow-hidden rounded-md border border-gray-200 mb-3 shadow-sm"
        >
          <img
            loading="lazy"
            :src="
              book.image ||
              'https://marketplace.canva.com/EAFPHUaBrFc/1/0/1003w/canva-black-and-white-modern-alone-story-book-cover-QHBKwQnsgzs.jpg'
            "
            alt="Book cover"
            class="w-full h-full object-cover"
          />
        </div>
        <div class="font-semibold text-gray-800 text-center mb-0.5">
          {{ book.title }}
        </div>
        <div class="text-sm text-gray-500 mb-0.5 text-center">
          {{ book.author }}
        </div>
        <!-- แสดงปีที่พิมพ์ แทน price -->
        <div class="text-rose-500 font-bold text-center mb-3">
          {{ book.published_year || "–" }}
        </div>
        <button
          class="w-full text-sm bg-rose-500 text-white py-1.5 rounded-lg hover:bg-rose-600 transition"
          @click="openModal(book)"
        >
          ดูข้อมูลเพิ่มเติม
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex flex-wrap justify-center mt-8 gap-2 text-sm text-gray-700">
      <button
        @click="firstPage"
        :disabled="currentPage === 1"
        class="px-2 py-1 border rounded"
      >
        &laquo;
      </button>
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-2 py-1 border rounded"
      >
        &lsaquo;
      </button>

      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'px-3 py-1 rounded border',
          page === currentPage
            ? 'bg-rose-500 text-white border-rose-500'
            : 'bg-white hover:bg-gray-100',
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-2 py-1 border rounded"
      >
        &rsaquo;
      </button>
      <button
        @click="lastPage"
        :disabled="currentPage === totalPages"
        class="px-2 py-1 border rounded"
      >
        &raquo;
      </button>
    </div>

    <!-- Modal -->
    <BookDetailModal
      v-if="selectedBook"
      :book="selectedBook"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import BookDetailModal from "./BookDetailModal.vue";

// รับ props จาก parent
const props = defineProps<{
  books: Array<{
    id: number;
    title: string;
    author: string;
    published_year: number | null;
    genre: string | null;
    image?: string;
    created_at?: string;
    updated_at?: string;
  }>;
  genres: string[];
}>();

// state
const selectedGenre = ref("All");
const searchQuery = ref("");
const selectedBook = ref<any | null>(null);
const currentPage = ref(1);
const pageSize = 5;

// filter + search
const filteredBooks = computed(() =>
  props.books.filter((book) => {
    const okGenre =
      selectedGenre.value === "All" || book.genre === selectedGenre.value;
    const okSearch = book.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return okGenre && okSearch;
  })
);

// pagination
const totalPages = computed(() =>
  Math.ceil(filteredBooks.value.length / pageSize)
);
const paginatedBooks = computed(() =>
  filteredBooks.value.slice(
    (currentPage.value - 1) * pageSize,
    currentPage.value * pageSize
  )
);

// dynamic range
const visiblePages = computed(() => {
  const pages: number[] = [];
  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 ||
      i === totalPages.value ||
      Math.abs(i - currentPage.value) <= 2
    ) {
      pages.push(i);
    }
  }
  return pages;
});

// reset page เวลา search เปลี่ยน
watch(searchQuery, () => (currentPage.value = 1));

// methods
function setGenre(g: string) {
  selectedGenre.value = g;
  currentPage.value = 1;
}
function buttonClass(g: string) {
  return selectedGenre.value === g
    ? "bg-rose-500 text-white"
    : "bg-gray-200 text-gray-700";
}
function goToPage(p: number) {
  currentPage.value = p;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function firstPage() {
  currentPage.value = 1;
}
function lastPage() {
  currentPage.value = totalPages.value;
}

// modal
function openModal(book: any) {
  selectedBook.value = book;
}
function closeModal() {
  selectedBook.value = null;
}
</script>
