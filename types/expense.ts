// Category is now a string to support custom categories
export type Category = string;

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

// Default categories provided out of the box
export const DEFAULT_CATEGORIES: Category[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
];

// Keep CATEGORIES for backward compatibility
export const CATEGORIES = DEFAULT_CATEGORIES;

export const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  Food: '#ef4444',
  Transportation: '#3b82f6',
  Entertainment: '#8b5cf6',
  Shopping: '#ec4899',
  Bills: '#f59e0b',
  Other: '#6b7280'
};

export const DEFAULT_CATEGORY_ICONS: Record<string, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📌'
};

// Keep old names for backward compatibility
export const CATEGORY_COLORS = DEFAULT_CATEGORY_COLORS;
export const CATEGORY_ICONS = DEFAULT_CATEGORY_ICONS;

// Helper function to get category color (with fallback for custom categories)
export const getCategoryColor = (category: Category): string => {
  return DEFAULT_CATEGORY_COLORS[category] || '#9ca3af'; // gray-400 fallback
};

// Helper function to get category icon (with fallback for custom categories)
export const getCategoryIcon = (category: Category): string => {
  return DEFAULT_CATEGORY_ICONS[category] || '📁'; // folder icon fallback
};

// Interface for custom category
export interface CustomCategory {
  name: string;
  color?: string;
  icon?: string;
  createdAt: string;
}

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
