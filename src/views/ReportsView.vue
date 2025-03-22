<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      Reports
    </h1>
    <report-generator
      :categories="categories"
      :clients="clients"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ReportGenerator from '@/components/reports/ReportGenerator.vue';
import { useTransactionStore } from '@/stores/transactions';

const store = useTransactionStore();
const categories = ref<string[]>([]);
const clients = ref<string[]>([]);

onMounted(async () => {
  await store.fetchTransactions();
  
  // Extract unique categories and clients from transactions
  const uniqueCategories = new Set<string>();
  const uniqueClients = new Set<string>();
  
  store.transactions.forEach(transaction => {
    uniqueCategories.add(transaction.category);
    uniqueClients.add(transaction.client_id);
  });
  
  categories.value = Array.from(uniqueCategories).sort();
  clients.value = Array.from(uniqueClients).sort();
});
</script> 