'use client';

import { useState, useMemo } from 'react';
import { Expense, ExpenseFilters, Category } from '@/types/expense';
import { filterExpenses } from '@/utils/analytics';

export const useFilters = (expenses: Expense[]) => {
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: 'All',
    searchQuery: '',
  });

  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, filters);
  }, [expenses, filters]);

  const updateFilter = (key: keyof ExpenseFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      searchQuery: '',
    });
  };

  return {
    filters,
    filteredExpenses,
    updateFilter,
    resetFilters,
  };
};
