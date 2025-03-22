<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Total Income</h3>
        <p class="mt-2 text-3xl font-semibold text-green-600 dark:text-green-400">
          ${{ totalIncome.toFixed(2) }}
        </p>
      </div>
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Total Expenses</h3>
        <p class="mt-2 text-3xl font-semibold text-red-600 dark:text-red-400">
          ${{ totalExpenses.toFixed(2) }}
        </p>
      </div>
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">Net Balance</h3>
        <p
          class="mt-2 text-3xl font-semibold"
          :class="[
            totalIncome + totalExpenses >= 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          ]"
        >
          ${{ (totalIncome + totalExpenses).toFixed(2) }}
        </p>
      </div>
    </div>

    <!-- Category Chart -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Transactions by Category</h2>
      <div class="h-[300px]">
        <Bar
          :data="categoryData"
          :options="barChartOptions"
        />
      </div>
    </div>

    <!-- Date Chart -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-200">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Transactions by Date</h2>
      <div class="h-[300px]">
        <Line
          :data="dateData"
          :options="lineChartOptions"
        />
      </div>
    </div>

    <!-- Client Summary -->
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Client Summary
      </h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Client
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Transactions
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="client in clientData" :key="client._id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ client._id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ client.count }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                ${{ client.total.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Pie, Line, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  ChartOptions,
} from 'chart.js';
import type { Metrics } from '@/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const props = defineProps<{
  metrics: Metrics;
}>();

const totalIncome = computed(() => 
  props.metrics.byCategory
    .filter(c => c._id === 'income')
    .reduce((sum, c) => sum + c.total, 0)
);

const totalExpenses = computed(() => 
  props.metrics.byCategory
    .filter(c => c._id === 'expense')
    .reduce((sum, c) => sum + c.total, 0)
);

const categoryData = computed(() => ({
  labels: props.metrics.byCategory.map(item => item._id),
  datasets: [
    {
      label: 'Total Amount',
      data: props.metrics.byCategory.map(item => item.total),
      backgroundColor: [
        'rgba(59, 130, 246, 0.5)',
        'rgba(16, 185, 129, 0.5)',
        'rgba(245, 158, 11, 0.5)',
        'rgba(239, 68, 68, 0.5)',
        'rgba(139, 92, 246, 0.5)',
        'rgba(236, 72, 153, 0.5)',
        'rgba(20, 184, 166, 0.5)',
        'rgba(249, 115, 22, 0.5)',
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(239, 68, 68)',
        'rgb(139, 92, 246)',
        'rgb(236, 72, 153)',
        'rgb(20, 184, 166)',
        'rgb(249, 115, 22)',
      ],
      borderWidth: 1,
    },
  ],
}));

const dateData = computed(() => ({
  labels: props.metrics.byDate.map(item => new Date(item._id).toLocaleDateString()),
  datasets: [
    {
      label: 'Total Amount',
      data: props.metrics.byDate.map(item => item.total),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.4,
      fill: true,
    },
  ],
}));

const clientData = computed(() => props.metrics.byClient);

const barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'rgb(156, 163, 175)',
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(156, 163, 175, 0.1)',
      },
      ticks: {
        color: 'rgb(156, 163, 175)',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgb(156, 163, 175)',
      },
    },
  },
};

const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: 'rgb(156, 163, 175)',
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(156, 163, 175, 0.1)',
      },
      ticks: {
        color: 'rgb(156, 163, 175)',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: 'rgb(156, 163, 175)',
      },
    },
  },
};
</script> 