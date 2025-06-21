<!-- src/components/library/BookTable.vue -->
<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <h3 class="text-xl font-bold mb-6 text-gray-800">Book List</h3>

    <!-- Filter Buttons -->
    <div class="flex flex-wrap gap-3 mb-4">
      <button
        @click="selectedGenre = 'All'"
        :class="buttonClass('All')"
        class="px-4 py-2 rounded-full"
      >
        All
      </button>
      <button
        v-for="genre in genres"
        :key="genre"
        @click="selectedGenre = genre"
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

    <!-- Table -->
    <div class="overflow-x-auto">
      <table
        class="min-w-full table-auto border rounded-md overflow-hidden text-sm"
      >
        <thead class="bg-gray-100 text-left text-gray-700">
          <tr>
            <th class="px-4 py-2 border-b">Title</th>
            <th class="px-4 py-2 border-b">Image</th>
            <th class="px-4 py-2 border-b">Author</th>
            <th class="px-4 py-2 border-b">Year</th>
            <th class="px-4 py-2 border-b">Genre</th>
            <th class="px-4 py-2 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="book in paginatedBooks"
            :key="book.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border-b">{{ book.title }}</td>
            <td class="px-4 py-2 border-b">
              <img
                :src="book.image || fallbackImage"
                alt="Book cover"
                class="w-16 h-24 object-cover rounded shadow"
              />
            </td>
            <td class="px-4 py-2 border-b">{{ book.author }}</td>
            <td class="px-4 py-2 border-b">{{ book.published_year }}</td>
            <td class="px-4 py-2 border-b">{{ book.genre }}</td>
            <td class="px-4 py-2 border-b">
              <div class="flex justify-center gap-3">
                <button
                  class="text-green-600 hover:underline text-sm"
                  @click="reviewBook(book)"
                >
                  Review
                </button>
                <button
                  class="text-blue-600 hover:underline text-sm"
                  @click="editBook(book)"
                >
                  Edit
                </button>
                <button
                  class="text-red-500 hover:underline text-sm"
                  @click="deleteBook(book)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div class="flex justify-center mt-6 gap-1 text-sm">
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="currentPage = 1"
        >
          &laquo;
        </button>
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          &lsaquo;
        </button>
        <button
          v-for="page in paginationRange"
          :key="page"
          @click="currentPage = page"
          class="px-3 py-1 border rounded"
          :class="{
            'bg-rose-500 text-white': currentPage === page,
            'bg-white text-gray-700': currentPage !== page,
          }"
        >
          {{ page }}
        </button>
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          &rsaquo;
        </button>
        <button
          class="px-3 py-1 border rounded disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click="currentPage = totalPages"
        >
          &raquo;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import Swal from "sweetalert2";

interface Book {
  id: number;
  title: string;
  author: string;
  published_year: number | null;
  genre: string | null;
  created_at: string;
  updated_at: string;
  image?: string;
}

// prop เพื่อ trigger การ reload หลังสร้างหนังสือใหม่
const props = defineProps<{ refreshKey: number }>();

const books = ref<Book[]>([]);
const fallbackImage =
  "https://marketplace.canva.com/EAFPHUaBrFc/1/0/1003w/canva-black-and-white-modern-alone-story-book-cover-QHBKwQnsgzs.jpg";
const selectedGenre = ref("All");
const searchQuery = ref("");

// pagination state
const currentPage = ref(1);
const itemsPerPage = 5;

// ฟังก์ชันดึงข้อมูลทั้งหมด
async function fetchBooks() {
  try {
    const res = await axios.get<{ status: string; data: Book[] }>(
      "http://localhost:5000/api/books"
    );
    books.value = res.data.data;
  } catch (err) {
    console.error("โหลดข้อมูลหนังสือไม่สำเร็จ:", err);
  }
}

onMounted(fetchBooks);
// เมื่อ refreshKey เปลี่ยน → reload
watch(() => props.refreshKey, fetchBooks);

// สร้าง list genres
const genres = computed<string[]>(() => [
  ...new Set(books.value.map((b) => b.genre).filter((g): g is string => !!g)),
]);

// กรองตาม genre & search
const filteredBooks = computed(() =>
  books.value.filter((b) => {
    const okGenre =
      selectedGenre.value === "All" || b.genre === selectedGenre.value;
    const okSearch = b.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    return okGenre && okSearch;
  })
);

// คำนวณ totalPages, paginated slice และ range
const totalPages = computed(() =>
  Math.ceil(filteredBooks.value.length / itemsPerPage)
);
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredBooks.value.slice(start, start + itemsPerPage);
});
const paginationRange = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const size = 5;
  let start = Math.max(1, current - Math.floor(size / 2));
  let end = Math.min(total, start + size - 1);
  if (end - start < size - 1) {
    start = Math.max(1, end - size + 1);
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// รีเซ็ตหน้าแรกเมื่อกรองใหม่
watch([searchQuery, selectedGenre], () => {
  currentPage.value = 1;
});

// ปรับ style ปุ่ม filter
function buttonClass(genre: string) {
  return selectedGenre.value === genre
    ? "bg-rose-500 text-white"
    : "bg-gray-200 text-gray-700";
}

// Review modal: อ่านข้อมูลจาก object ปัจจุบัน
function reviewBook(book: Book) {
  Swal.fire({
    title: `<strong>${book.title}</strong>`,
    html: `
      <div style="text-align:left;">
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Year:</strong> ${book.published_year}</p>
        <p><strong>Created:</strong> ${book.created_at}</p>
        <p><strong>Updated:</strong> ${book.updated_at}</p>
      </div>
    `,
    imageUrl: book.image || fallbackImage,
    imageHeight: 300,
    confirmButtonText: "Close",
  });
}

// Edit modal: แปลง year → number และอัปเดต object ทันที
function editBook(book: Book) {
  Swal.fire({
    title: `<strong>Edit Book</strong>`,
    html: `
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${createInputRow("Title", "title", book.title)}
        ${createInputRow("Author", "author", book.author)}
        ${createInputRow(
          "Published Year",
          "year",
          String(book.published_year ?? ""),
          "number"
        )}
        ${createSelectRow("Genre", "genre", book.genre)}
      </div>
    `,
    width: 550,
    showCancelButton: true,
    confirmButtonText: "Save",
    focusConfirm: false,
    preConfirm: async () => {
      const title = (
        document.getElementById("title") as HTMLInputElement
      ).value.trim();
      const author = (
        document.getElementById("author") as HTMLInputElement
      ).value.trim();
      const yearStr = (
        document.getElementById("year") as HTMLInputElement
      ).value.trim();
      const genre = (document.getElementById("genre") as HTMLSelectElement)
        .value;

      // ตรวจสอบว่ากรอกครบทุกช่อง
      if (!title || !author || !yearStr || !genre) {
        Swal.showValidationMessage("กรุณากรอกทุกช่องให้ครบ");
        return false;
      }

      // เช็คว่า year เป็นตัวเลขบวก
      const published_year = parseInt(yearStr, 10);
      if (isNaN(published_year) || published_year <= 0) {
        Swal.showValidationMessage("ปีที่พิมพ์ต้องเป็นตัวเลขบวกเท่านั้น");
        return false;
      }

      // เริ่มอัพเดต
      try {
        await axios.put(`http://localhost:5000/api/books/${book.id}`, {
          title,
          author,
          published_year,
          genre,
        });
        await fetchBooks();
        Swal.fire("Updated!", "Book has been updated.", "success");
      } catch {
        Swal.showValidationMessage("Failed to update book.");
        return false;
      }
    },
  });
}

// Delete modal
function deleteBook(book: Book) {
  Swal.fire({
    title: `ลบหนังสือ "${book.title}"?`,
    text: "คุณไม่สามารถกู้คืนข้อมูลหลังจากลบได้",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ลบเลย",
    cancelButtonText: "ยกเลิก",
  }).then(async (res) => {
    if (res.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${book.id}`);
        books.value = books.value.filter((b) => b.id !== book.id);
        Swal.fire("ลบสำเร็จ!", `"${book.title}" ถูกลบแล้ว`, "success");
      } catch {
        Swal.fire("Error", "ไม่สามารถลบหนังสือได้", "error");
      }
    }
  });
}

// helpers สร้าง input/select row
function createInputRow(
  label: string,
  id: string,
  value: string,
  type = "text"
) {
  return `
    <div style='display:flex; align-items:center;'>
      <label for='${id}' style='width:140px; font-weight:600; text-align:right; margin-right:12px; white-space:nowrap;'>
        ${label}:
      </label>
      <input
        id='${id}'
        type='${type}'
        value='${value}'
        required
        class='swal2-input'
        style='flex:1;'
      />
    </div>
  `;
}

function createSelectRow(label: string, id: string, selected: string | null) {
  const opts = ["History", "Fiction", "Science", "Thriller"]
    .map(
      (o) =>
        `<option value='${o}' ${o === selected ? "selected" : ""}>${o}</option>`
    )
    .join("");
  return `
    <div style='display:flex; align-items:center;'>
      <label for='${id}' style='width:140px; font-weight:600; text-align:right; margin-right:12px; white-space:nowrap;'>
        ${label}:
      </label>
      <select
        id='${id}'
        class='swal2-input'
        required
        style='flex:1;'
      >
        ${opts}
      </select>
    </div>
  `;
}
</script>
