'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useExpenses } from '@/hooks/useExpenses';
import { calculateSummary } from '@/utils/analytics';
import { formatCurrency } from '@/utils/format';
import { CATEGORY_COLORS, CATEGORY_ICONS, Category } from '@/types/expense';

interface CategoryStats {
  category: Category;
  amount: number;
  percentage: number;
  count: number;
}

export default function TopCategoriesPage() {
  const { expenses, isLoading } = useExpenses();

  const categoryStats = useMemo<CategoryStats[]>(() => {
    const summary = calculateSummary(expenses);

    // Count expenses per category
    const categoryCounts: Record<string, number> = {};
    expenses.forEach(exp => {
      categoryCounts[exp.category] = (categoryCounts[exp.category] || 0) + 1;
    });

    // Combine breakdown with counts
    return summary.categoryBreakdown.map(item => ({
      category: item.category,
      amount: item.amount,
      percentage: item.percentage,
      count: categoryCounts[item.category] || 0,
    }));
  }, [expenses]);

  const totalSpending = useMemo(() => {
    return categoryStats.reduce((sum, stat) => sum + stat.amount, 0);
  }, [categoryStats]);

  const totalExpenses = expenses.length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="text-6xl mb-4">💰</div>
          <p className="text-xl text-gray-600">Loading categories...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Top Expense Categories</h1>
              <p className="text-gray-600 mt-1">See where your money is going</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Spending</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalSpending)}
                </p>
              </div>
              <div className="text-5xl">💸</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-900">{totalExpenses}</p>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </div>
        </div>

        {/* Categories List */}
        {categoryStats.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Expenses Yet</h2>
            <p className="text-gray-600 mb-6">Start tracking your expenses to see category breakdown</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium"
            >
              Add Your First Expense
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Categories ({categoryStats.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryStats.map((stat) => (
                <div
                  key={stat.category}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-3xl mr-3">{CATEGORY_ICONS[stat.category]}</span>
                      <h3 className="text-xl font-bold text-gray-900">{stat.category}</h3>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stat.amount)}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Percentage</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {stat.percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Expenses</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {stat.count}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${stat.percentage}%`,
                        backgroundColor: CATEGORY_COLORS[stat.category],
                      }}
                    ></div>
                  </div>

                  {/* Average per expense */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Average per expense</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(stat.amount / stat.count)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
