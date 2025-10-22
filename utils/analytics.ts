import { Expense, ExpenseSummary, Category } from '@/types/expense';
import { startOfMonth, endOfMonth } from 'date-fns';

export const calculateSummary = (expenses: Expense[]): ExpenseSummary => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Total spending
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Monthly spending
  const monthlySpending = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= monthStart && expDate <= monthEnd;
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const categoryBreakdown = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category: category as Category,
      amount,
      percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Top category
  const topCategory = categoryBreakdown.length > 0
    ? {
        category: categoryBreakdown[0].category,
        amount: categoryBreakdown[0].amount,
      }
    : null;

  return {
    totalSpending,
    monthlySpending,
    topCategory,
    categoryBreakdown,
  };
};

export const filterExpenses = (
  expenses: Expense[],
  filters: {
    startDate?: string;
    endDate?: string;
    category?: Category | 'All';
    searchQuery?: string;
  }
): Expense[] => {
  return expenses.filter(expense => {
    // Date range filter
    if (filters.startDate) {
      const expDate = new Date(expense.date);
      const startDate = new Date(filters.startDate);
      if (expDate < startDate) return false;
    }

    if (filters.endDate) {
      const expDate = new Date(expense.date);
      const endDate = new Date(filters.endDate);
      if (expDate > endDate) return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      if (expense.category !== filters.category) return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesDescription = expense.description.toLowerCase().includes(query);
      const matchesCategory = expense.category.toLowerCase().includes(query);
      const matchesAmount = expense.amount.toString().includes(query);
      if (!matchesDescription && !matchesCategory && !matchesAmount) return false;
    }

    return true;
  });
};

export const exportToCSV = (expenses: Expense[]): string => {
  const headers = ['Date', 'Category', 'Amount', 'Description'];
  const rows = expenses.map(exp => [
    exp.date,
    exp.category,
    exp.amount.toString(),
    `"${exp.description.replace(/"/g, '""')}"`, // Escape quotes in description
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (expenses: Expense[], filename: string = 'expenses.csv'): void => {
  const csv = exportToCSV(expenses);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
