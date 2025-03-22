import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Transaction } from '@/types';
import { transactionService } from '@/services/api';

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const activeTransactions = computed(() => 
    transactions.value.filter(t => t.state === 'active')
  );  

  const totalIncome = computed(() => 
    activeTransactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const totalExpenses = computed(() => 
    activeTransactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  );

  async function fetchTransactions() {
    loading.value = true;
    error.value = null;
    try {
      const response = await transactionService.getAll();
      transactions.value = response.data;
    } catch (err) {
      error.value = 'Failed to fetch transactions';
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  async function createTransaction(data: Omit<Transaction, 'id'>) {
    loading.value = true;
    error.value = null;
    try {
      const response = await transactionService.create(data);
      transactions.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = 'Failed to create transaction';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateTransaction(id: string, data: Partial<Transaction>) {
    loading.value = true;
    error.value = null;
    try {
      const response = await transactionService.update(id, data);
      const index = transactions.value.findIndex(t => t._id === id);
      if (index !== -1) {
        transactions.value[index] = response.data;
      }
      return response.data;
    } catch (err) {
      error.value = 'Failed to update transaction';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteTransaction(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await transactionService.delete(id);
      transactions.value = transactions.value.filter(t => t._id !== id);
    } catch (err) {
      error.value = 'Failed to delete transaction';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    transactions,
    loading,
    error,
    activeTransactions,
    totalIncome,
    totalExpenses,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}); 