'use client';

import Link from 'next/link';
import { useExpenses } from '@/hooks/useExpenses';
import MonthlyInsights from '@/components/MonthlyInsights';

export default function MonthlyInsightsPage() {
  const { expenses, isLoading } = useExpenses();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-xl text-gray-600">Loading insights...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Monthly Insights</h1>
              <p className="text-gray-600 mt-1">Your spending patterns this month</p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-medium inline-flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <MonthlyInsights expenses={expenses} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Expense Tracker - Monthly Insights Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
