<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div class="flex space-x-4 w-[60%]">
        <div class="relative w-[90%]">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by client, category, or type..."
            class="input pl-10 w-[90%]"
          />
          <magnifying-glass-icon class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <select
          v-model="typeFilter"
          class="input"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <button
        @click="$emit('create')"
        class="btn btn-primary rounded-md p-2 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        New Transaction
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              @click="sortBy(header.key)"
            >
              <div class="flex items-center space-x-1">
                <span>{{ header.label }}</span>
                <chevron-up-icon
                  v-if="sortKey === header.key && sortOrder === 'asc'"
                  class="h-4 w-4"
                />
                <chevron-down-icon
                  v-if="sortKey === header.key && sortOrder === 'desc'"
                  class="h-4 w-4"
                />
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="transaction in filteredTransactions" :key="transaction.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="[
                  transaction.type === 'income'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                ]"
              >
                {{ transaction.type }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              ${{ transaction.amount.toFixed(2) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {{ transaction.category }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {{ transaction.client_id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {{ new Date(transaction.date).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="$emit('edit', transaction)"
                class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', transaction)"
                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline';
import type { Transaction } from '@/types';

const props = defineProps<{
  transactions: Transaction[];
}>();

const emit = defineEmits<{
  (e: 'create'): void;
  (e: 'edit', transaction: Transaction): void;
  (e: 'delete', transaction: Transaction): void;
}>();

const searchQuery = ref('');
const typeFilter = ref('');
const sortKey = ref<keyof Transaction>('date');
const sortOrder = ref<'asc' | 'desc'>('desc');

const headers = [
  { key: 'type', label: 'Type' },
  { key: 'amount', label: 'Amount' },
  { key: 'category', label: 'Category' },
  { key: 'client_id', label: 'Client' },
  { key: 'date', label: 'Date' },
];

const filteredTransactions = computed(() => {
  let result = [...props.transactions];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(t =>
      t.category.toLowerCase().includes(query) ||
      t.client_id.toLowerCase().includes(query) ||
      t.type.toLowerCase().includes(query)
    );
  }

  // Apply type filter
  if (typeFilter.value) {
    result = result.filter(t => t.type === typeFilter.value);
  }

  // Apply sorting
  result.sort((a, b) => {
    const aValue = a[sortKey.value];
    const bValue = b[sortKey.value];
    
    if (sortKey.value === 'date') {
      return sortOrder.value === 'asc'
        ? new Date(aValue as string).getTime() - new Date(bValue as string).getTime()
        : new Date(bValue as string).getTime() - new Date(aValue as string).getTime();
    }

    if (typeof aValue === 'number') {
      return sortOrder.value === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }

    return sortOrder.value === 'asc'
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  return result;
});

const sortBy = (key: keyof Transaction) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};
</script> 