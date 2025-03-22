<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Type
        </label>
        <select
          id="type"
          v-model="form.type"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700"
          required
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount
        </label>
        <div class="mt-1 relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="amount"
            v-model="form.amount"
            class="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700"
            required
            step="0.01"
          />
        </div>
      </div>

      <div>
        <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <input
          type="text"
          id="category"
          v-model="form.category"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700"
          required
        />
      </div>

      <div>
        <label for="client" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Client
        </label>
        <input
          type="text"
          id="client_id"
          v-model="form.client_id"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700"
          required
        />
      </div>

      <div>
        <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          type="date"
          id="date"
          v-model="form.date"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700"
          required
        />
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        class="btn btn-secondary rounded-md p-2 bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="btn btn-primary rounded-md p-2 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        :disabled="loading"
      >
        {{ loading ? 'Saving...' : 'Save' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Transaction } from '@/types';

const props = defineProps<{
  transaction?: Transaction;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: Omit<Transaction, 'id'>): void;
  (e: 'cancel'): void;
}>();

const form = ref<TransactionForm>({
  amount: 0,
  category: '',
  date: new Date().toISOString().split('T')[0],
  client_id: '',
  type: 'income',
  state: 'activa'
});

onMounted(() => {
  if (props.transaction) {
    form.value = { ...props.transaction };
  }
});

watch(() => form.value.type, (newType) => {
  if (newType === 'expense' && form.value.amount > 0) {
    form.value.amount = -form.value.amount;
  } else if (newType === 'income' && form.value.amount < 0) {
    form.value.amount = Math.abs(form.value.amount);
  }
});

watch(() => form.value.amount, (newAmount) => {
  if (form.value.type === 'expense' && newAmount > 0) {
    form.value.amount = -newAmount;
  } else if (form.value.type === 'income' && newAmount < 0) {
    form.value.amount = Math.abs(newAmount);
  }
});

const handleSubmit = () => {
  emit('submit', form.value);
};
</script> 