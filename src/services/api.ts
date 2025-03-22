import axios from 'axios';
import type { Transaction, Report, Metrics } from '@/types';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const transactionService = {
  getAll: () => api.get<Transaction[]>('/transactions'),
  getById: (id: string) => api.get<Transaction>(`/transactions/${id}`),
  create: (data: Omit<Transaction, 'id'>) => api.post<Transaction>('/transactions', data),
  update: (id: string, data: Partial<Transaction>) => api.put<Transaction>(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

export const reportService = {
  getAll: () => api.get<Report[]>('/reports'),
  generate: (data: Report['parameters']) => api.post<Report>('/reports/generate', data),
  download: (filename: string) => api.get(`/reports/download/${filename}`, { responseType: 'blob' }),
};

export interface DateRangeParams {
  startDate: string;
  endDate: string;
}

export const metricsService = {
  getByCategory: () => api.get<Metrics['byCategory']>('/metrics/by-category'),
  getByDate: (params: DateRangeParams) => {
    console.log(params);
    return api.get<Metrics['byDate']>('/metrics/by-date', { params });
  },
  getByClient: () => api.get<Metrics['byClient']>('/metrics/by-client'),
}; 