<template>
  <div
    class="flex-1 rounded-xl p-6 bg-gradient-to-r from-rose-500 to-pink-400 text-white shadow-lg"
  >
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold mb-2">Welcome, Jakrawut Sainate</h2>
        <p class="text-sm opacity-90 mb-4 max-w-md">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center bg-white text-rose-500 font-semibold px-4 py-2 rounded-lg shadow hover:bg-rose-50 transition"
        >
          Add New Book
        </button>
      </div>
      <div class="mt-4 md:mt-0">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png"
          class="w-24 h-24 object-contain"
          alt="Book Icon"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";
import axios from "axios";
import { defineEmits } from "vue";

// ประกาศ event ที่จะส่งไปยัง parent
const emit = defineEmits<{
  (e: "book-created"): void;
}>();

async function openCreateModal() {
  const { value: formValues } = await Swal.fire({
    title: "Create New Book",
    html: `
      <div style="display:flex; flex-direction:column; gap:12px; text-align:left;">
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="width:100px; font-weight:600;">Title:</label>
          <input id="swal-title" class="swal2-input" placeholder="Book title" required>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="width:100px; font-weight:600;">Author:</label>
          <input id="swal-author" class="swal2-input" placeholder="Author" required>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="width:100px; font-weight:600;">Year:</label>
          <input id="swal-year" type="number" class="swal2-input" placeholder="e.g. 2021" required>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="width:100px; font-weight:600;">Genre:</label>
          <select id="swal-genre" class="swal2-input" required>
            <option value="" disabled selected>Choose genre</option>
            <option value="History">History</option>
            <option value="Fiction">Fiction</option>
            <option value="Science">Science</option>
            <option value="Thriller">Thriller</option>
          </select>
        </div>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Create",
    preConfirm: () => {
      const title = (
        document.getElementById("swal-title") as HTMLInputElement
      ).value.trim();
      const author = (
        document.getElementById("swal-author") as HTMLInputElement
      ).value.trim();
      const yearStr = (
        document.getElementById("swal-year") as HTMLInputElement
      ).value.trim();
      const genre = (document.getElementById("swal-genre") as HTMLSelectElement)
        .value;

      if (!title || !author || !yearStr || !genre) {
        Swal.showValidationMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return null;
      }

      const published_year = parseInt(yearStr, 10);
      if (isNaN(published_year) || published_year <= 0) {
        Swal.showValidationMessage("ปีที่พิมพ์ต้องเป็นตัวเลขบวกเท่านั้น");
        return null;
      }

      return { title, author, published_year, genre };
    },
  });

  if (formValues) {
    try {
      await axios.post("http://localhost:5000/api/books", formValues);
      Swal.fire("Created!", "New book has been added.", "success");
      emit("book-created");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to create book.", "error");
    }
  }
}
</script>
