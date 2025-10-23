export type Category = 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Bills' | 'Other';

export interface Expense {
  id: string;
  date: string; // ISO date string
  amount: number;
  category: Category;
  description: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ExpenseFormData {
  date: string;
  amount: string;
  category: Category;
  description: string;
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  category?: Category | 'All';
  searchQuery?: string;
}

export interface ExpenseSummary {
  totalSpending: number;
  monthlySpending: number;
  topCategory: {
    category: Category;
    amount: number;
  } | null;
  categoryBreakdown: {
    category: Category;
    amount: number;
    percentage: number;
  }[];
}

export const CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#ef4444',
  Transportation: '#3b82f6',
  Entertainment: '#8b5cf6',
  Shopping: '#ec4899',
  Bills: '#f59e0b',
  Other: '#6b7280'
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📌'
};

export interface VendorData {
  vendor: string;
  totalAmount: number;
  transactionCount: number;
  lastTransactionDate: string;
  primaryCategory: Category;
  categoryBreakdown: {
    category: Category;
    amount: number;
    count: number;
  }[];
}
