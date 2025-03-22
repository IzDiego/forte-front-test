export interface Transaction {
  _id: string;
  amount: number;
  category: string;
  date: string;
  client_id: string;
  createdAt: string;
  updatedAt: string;
  state: string;
  type: string;
}

export interface Report {
  id: string;
  filename: string;
  date: string;
  type: string;
  parameters: {
    startDate: string;
    endDate: string;
    categories?: string[];
    clients?: string[];
  };
}

export interface Metrics {
  byCategory: {
    _id: string;
    total: number;
    count: number;
  }[];
  byDate: {
    _id: string;
    total: number;
    count: number;
  }[];
  byClient: {
    _id: string;
    total: number;
    count: number;
    average: number;
  }[];
} 