<template>
  <div class="space-y-6">
    <div class="card">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Generate Report
      </h2>
      <form @submit.prevent="generateReport" class="space-y-6">
        <!-- Date Range -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              v-model="form.startDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
          <div>
            <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              v-model="form.endDate"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700"
              required
            />
          </div>
        </div>

        <!-- Categories -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categories
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <label
              v-for="category in categories"
              :key="category"
              class="inline-flex items-center"
            >
              <input
                type="checkbox"
                :value="category"
                v-model="form.categories"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {{ category }}
              </span>
            </label>
          </div>
        </div>

        <!-- Clients -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Clients
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <label
              v-for="client in clients"
              :key="client"
              class="inline-flex items-center"
            >
              <input
                type="checkbox"
                :value="client"
                v-model="form.client"
                class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {{ client }}
              </span>
            </label>
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Generating...' : 'Generate Report' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Generated Reports Table -->
    <div class="card">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Generated Reports
      </h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="report in reports" :key="report.filename">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {{ new Date(report.createdAt).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="downloadReport(report)"
                  class="text-primary-600 cursor-pointer hover:text-primary-900 hover:underline hover:text-red-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Report } from '@/types';
import { reportService } from '@/services/api';

const props = defineProps<{
  categories: string[];
  clients: string[];
}>();

const loading = ref(false);
const reports = ref<Report[]>([]);

const form = ref({
  startDate: '',
  endDate: '',
  categories: [] as string[],
  clients: [] as string[],
});

async function generateReport() {
  loading.value = true;
  try {
    const response = await reportService.generate(form.value);
    // Fetch the latest reports after successful generation
    const reportsResponse = await reportService.getAll();
    reports.value = reportsResponse.data;
  } catch (error) {
    console.error('Failed to generate report:', error);
  } finally {
    loading.value = false;
  }
}

async function downloadReport(report: Report) {
  try {
    const response = await reportService.download(report.filename);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', report.filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Failed to download report:', error);
  }
}

onMounted(async () => {
  // Set default date range to last 30 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  form.value.startDate = startDate.toISOString().split('T')[0];
  form.value.endDate = endDate.toISOString().split('T')[0];

  // Fetch initial reports
  try {
    const response = await reportService.getAll();
    reports.value = response.data;
  } catch (error) {
    console.error('Failed to fetch reports:', error);
  }
});
</script> 