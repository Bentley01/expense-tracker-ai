'use client';

import { useState, useEffect, useCallback } from 'react';
import { Expense, ExpenseFormData, Category } from '@/types/expense';
import { storage } from '@/utils/storage';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadedExpenses = storage.getExpenses();
    setExpenses(loadedExpenses);
    setIsLoading(false);
  }, []);

  const addExpense = useCallback((formData: ExpenseFormData) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.addExpense(newExpense);
    setExpenses(prev => [...prev, newExpense]);
    return newExpense;
  }, []);

  const updateExpense = useCallback((id: string, formData: ExpenseFormData) => {
    const existingExpense = expenses.find(exp => exp.id === id);
    if (!existingExpense) return;

    const updatedExpense: Expense = {
      ...existingExpense,
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      updatedAt: new Date().toISOString(),
    };

    storage.updateExpense(id, updatedExpense);
    setExpenses(prev => prev.map(exp => exp.id === id ? updatedExpense : exp));
    return updatedExpense;
  }, [expenses]);

  const deleteExpense = useCallback((id: string) => {
    storage.deleteExpense(id);
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  }, []);

  const clearAllExpenses = useCallback(() => {
    storage.clearAll();
    setExpenses([]);
  }, []);

  return {
    expenses,
    isLoading,
    addExpense,
    updateExpense,
    deleteExpense,
    clearAllExpenses,
  };
};
