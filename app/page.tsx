'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseFilters from '@/components/ExpenseFilters';
import SummaryCards from '@/components/SummaryCards';
import CategoryChart from '@/components/CategoryChart';
import { useExpenses } from '@/hooks/useExpenses';
import { useFilters } from '@/hooks/useFilters';
import { calculateSummary, downloadCSV } from '@/utils/analytics';
import { Expense, ExpenseFormData, Category } from '@/types/expense';

export default function Home() {
  const { expenses, isLoading, addExpense, updateExpense, deleteExpense } = useExpenses();
  const { filters, filteredExpenses, updateFilter, resetFilters } = useFilters(expenses);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(true);

  const summary = useMemo(() => calculateSummary(filteredExpenses), [filteredExpenses]);

  const handleAddExpense = (formData: ExpenseFormData) => {
    addExpense(formData);
    // Show success feedback
  };

  const handleUpdateExpense = (formData: ExpenseFormData) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, formData);
      setEditingExpense(null);
      setShowForm(true);
    }
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const handleExportCSV = () => {
    downloadCSV(filteredExpenses, `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="text-6xl mb-4">💰</div>
          <p className="text-xl text-gray-600">Loading your expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
              <p className="text-gray-600 mt-1">Manage your personal finances with ease</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/monthly-insights"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium inline-flex items-center gap-2"
              >
                <span>💡</span>
                <span>Monthly Insights</span>
              </Link>
              <Link
                href="/categories"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium inline-flex items-center gap-2"
              >
                <span>📊</span>
                <span>Top Categories</span>
              </Link>
              <Link
                href="/top-vendors"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium inline-flex items-center gap-2"
              >
                <span>🏪</span>
                <span>Top Vendors</span>
              </Link>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                {showForm ? 'Hide Form' : 'Show Form'}
              </button>
              {filteredExpenses.length > 0 && (
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <SummaryCards summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Form and Chart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expense Form */}
            {showForm && (
              <ExpenseForm
                onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
                onCancel={editingExpense ? handleCancelEdit : undefined}
                initialData={editingExpense || undefined}
                submitLabel={editingExpense ? 'Update Expense' : 'Add Expense'}
              />
            )}

            {/* Filters */}
            <ExpenseFilters
              searchQuery={filters.searchQuery || ''}
              category={filters.category || 'All'}
              startDate={filters.startDate}
              endDate={filters.endDate}
              onSearchChange={(query) => updateFilter('searchQuery', query)}
              onCategoryChange={(category) => updateFilter('category', category)}
              onStartDateChange={(date) => updateFilter('startDate', date)}
              onEndDateChange={(date) => updateFilter('endDate', date)}
              onReset={resetFilters}
            />

            {/* Expense List */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Expenses ({filteredExpenses.length})
                </h2>
              </div>
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={handleEditClick}
                onDelete={deleteExpense}
              />
            </div>
          </div>

          {/* Right Column - Category Chart */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <CategoryChart summary={summary} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
