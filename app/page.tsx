'use client';

import { useState, useMemo } from 'react';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseFilters from '@/components/ExpenseFilters';
import SummaryCards from '@/components/SummaryCards';
import CategoryChart from '@/components/CategoryChart';
import ExportModal from '@/components/ExportModal';
import { useExpenses } from '@/hooks/useExpenses';
import { useFilters } from '@/hooks/useFilters';
import { calculateSummary } from '@/utils/analytics';
import { performExport } from '@/utils/exportAdvanced';
import { Expense, ExpenseFormData } from '@/types/expense';

export default function Home() {
  const { expenses, isLoading, addExpense, updateExpense, deleteExpense } = useExpenses();
  const { filters, filteredExpenses, updateFilter, resetFilters } = useFilters(expenses);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

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

  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const handleExport = async (
    expenses: Expense[],
    format: 'csv' | 'json' | 'pdf',
    filename: string
  ) => {
    await performExport(expenses, format, filename);
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
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
              >
                {showForm ? 'Hide Form' : 'Show Form'}
              </button>
              {expenses.length > 0 && (
                <button
                  onClick={handleExportClick}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export Data
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

      {/* Export Modal */}
      <ExportModal
        expenses={expenses}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  );
}
