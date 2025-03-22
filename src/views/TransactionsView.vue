<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Transactions
      </h1>
    </div>

    <transactions-list
      :transactions="transactions"
      @create="showForm = true"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <!-- Transaction Form Modal -->
    <div
      v-if="showForm"
      class="fixed inset-0 bg-gray-500/75 dark:bg-gray-500/50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">
            {{ editingTransaction ? 'Edit Transaction' : 'New Transaction' }}
          </h2>
          <button
            @click="closeForm"
            class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <x-mark-icon class="h-6 w-6" />
          </button>
        </div>

        <transaction-form
          :transaction="editingTransaction"
          :loading="loading"
          @submit="handleSubmit"
          @cancel="closeForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import TransactionsList from '@/components/transactions/TransactionsList.vue';
import TransactionForm from '@/components/transactions/TransactionForm.vue';
import type { Transaction } from '@/types';
import { useTransactionStore } from '@/stores/transactions';

const store = useTransactionStore();
const showForm = ref(false);
const loading = ref(false);
const editingTransaction = ref<Transaction | undefined>();

const transactions = computed(() => store.transactions);

async function handleSubmit(data: Omit<Transaction, 'id'>) {
  loading.value = true;
  try {
    if (editingTransaction.value) {
      await store.updateTransaction(editingTransaction.value._id, data);
    } else {
      await store.createTransaction(data);
    }
    closeForm();
  } catch (error) {
    console.error('Failed to save transaction:', error);
  } finally {
    loading.value = false;
  }
}

function handleEdit(transaction: Transaction) {
  editingTransaction.value = transaction;
  showForm.value = true;
}

async function handleDelete(transaction: Transaction) {
  if (!confirm('Are you sure you want to delete this transaction?')) {
    return;
  }

  try {
    await store.deleteTransaction(transaction._id);
  } catch (error) {
    console.error('Failed to delete transaction:', error);
  }
}

function closeForm() {
  showForm.value = false;
  editingTransaction.value = undefined;
}

onMounted(() => {
  store.fetchTransactions();
});
</script> 