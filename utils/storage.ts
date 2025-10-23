import { Expense, CustomCategory, DEFAULT_CATEGORIES } from '@/types/expense';

const STORAGE_KEY = 'expense-tracker-expenses';
const CATEGORIES_STORAGE_KEY = 'expense-tracker-custom-categories';

export const storage = {
  getExpenses: (): Expense[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveExpenses: (expenses: Expense[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  addExpense: (expense: Expense): void => {
    const expenses = storage.getExpenses();
    expenses.push(expense);
    storage.saveExpenses(expenses);
  },

  updateExpense: (id: string, updatedExpense: Expense): void => {
    const expenses = storage.getExpenses();
    const index = expenses.findIndex(exp => exp.id === id);
    if (index !== -1) {
      expenses[index] = updatedExpense;
      storage.saveExpenses(expenses);
    }
  },

  deleteExpense: (id: string): void => {
    const expenses = storage.getExpenses();
    const filtered = expenses.filter(exp => exp.id !== id);
    storage.saveExpenses(filtered);
  },

  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  },

  // Custom category management
  getCustomCategories: (): CustomCategory[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading custom categories from localStorage:', error);
      return [];
    }
  },

  saveCustomCategories: (categories: CustomCategory[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error('Error writing custom categories to localStorage:', error);
    }
  },

  addCustomCategory: (category: CustomCategory): void => {
    const categories = storage.getCustomCategories();
    categories.push(category);
    storage.saveCustomCategories(categories);
  },

  getAllCategories: (): string[] => {
    const customCategories = storage.getCustomCategories();
    const customCategoryNames = customCategories.map(c => c.name);
    return [...DEFAULT_CATEGORIES, ...customCategoryNames];
  },

  categoryExists: (categoryName: string): boolean => {
    const allCategories = storage.getAllCategories();
    return allCategories.some(c => c.toLowerCase() === categoryName.toLowerCase());
  }
};
