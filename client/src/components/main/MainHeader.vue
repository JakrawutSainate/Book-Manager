<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <!-- Welcome Box -->
    <div
      class="order-1 lg:order-none flex-1 rounded-xl p-6 bg-gradient-to-r from-rose-500 to-pink-400 text-white shadow-lg"
    >
      <div
        class="flex flex-col-reverse lg:flex-row items-center justify-between gap-4"
      >
        <div class="text-center lg:text-left">
          <h2 class="text-2xl font-bold mb-2">Welcome, Jakrawut Sainate</h2>
          <p class="text-sm opacity-90 mb-4 max-w-lg">
            Develop a Book Management System with full CRUD functionality within 5 days
          </p>
        </div>

        <div class="mb-4 lg:mb-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png"
            class="w-24 h-24 object-contain"
            alt="Book Icon"
          />
        </div>
      </div>
    </div>

    <!-- Chart Box -->
    <div
      class="order-2 lg:order-none rounded-xl p-6 bg-white shadow-md flex items-start gap-4 max-w-full lg:basis-[33%] lg:max-w-md w-full"
    >
      <div class="flex-1 space-y-2">
        <h4 class="text-lg font-semibold text-gray-800">
          Books: {{ books.length }} total
        </h4>
        <ul class="grid grid-cols-2 gap-x-4 gap-y-1">
          <li
            v-for="(count, genre, index) in genreCountMap"
            :key="genre"
            class="flex items-center gap-2 text-sm text-gray-700"
          >
            <span
              :style="{
                backgroundColor: chartColors[index % chartColors.length],
              }"
              class="w-4 h-4 rounded"
            ></span>
            {{ genre }} ({{ count }})
          </li>
        </ul>
      </div>
      <div class="w-28 h-28 relative shrink-0">
        <canvas
          ref="canvasRef"
          class="absolute top-0 left-0 w-full h-full"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import Chart, { ChartConfiguration } from "chart.js/auto";

const props = defineProps<{
  books: any[];
  genreCountMap: Record<string, number>;
}>();

const chartColors = ref([
  "#f87171",
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
]);

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

async function renderChart() {
  await nextTick();
  if (!canvasRef.value) return;

  const entries = Object.entries(props.genreCountMap) as [string, number][];
  const labels = entries.map(([genre]) => genre);
  const data = entries.map(([, count]) => count);

  const config: ChartConfiguration<"doughnut"> = {
    type: "doughnut",
    data: {
      labels,
      datasets: [{ data, backgroundColor: chartColors.value }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "50%",
      plugins: { legend: { display: false } },
    },
  };

  if (chartInstance) {
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;
    chartInstance.update();
  } else {
    const ctx = canvasRef.value.getContext("2d")!;
    chartInstance = new Chart(ctx, config);
  }
}

watch(() => props.genreCountMap, renderChart, { deep: true, immediate: true });
</script>
