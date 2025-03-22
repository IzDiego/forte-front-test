<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Dashboard
    </h1>
    <div class="mb-6 flex gap-4">
      <div class="flex-1">
        <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-white mb-2">Start Date</label>
        <input
          type="date"
          id="startDate"
          v-model="dateRange.startDate"
          class="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div class="flex-1">
        <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-white mb-2">End Date</label>
        <input
          type="date"
          id="endDate"
          v-model="dateRange.endDate"
          class="mt-1 block w-full rounded-md dark:bg-gray-700 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
      <div class="flex items-end">
        <button
          @click="fetchMetrics"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Update
        </button>
      </div>
    </div>
    <dashboard :metrics="metrics" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Dashboard from '@/components/dashboard/Dashboard.vue';
import type { Metrics } from '@/types';
import { metricsService } from '@/services/api';

const dateRange = ref({
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
});

const metrics = ref<Metrics>({
  byCategory: [],
  byDate: [],
  byClient: [],
});

async function fetchMetrics() {
  try {
    const [categoryResponse, dateResponse, clientResponse] = await Promise.all([
      metricsService.getByCategory(),
      metricsService.getByDate(dateRange.value),
      metricsService.getByClient(),
    ]);

    metrics.value = {
      byCategory: categoryResponse.data,
      byDate: dateResponse.data,
      byClient: clientResponse.data,
    };
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
  }
}

onMounted(fetchMetrics);
</script> 