'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useExpenses } from '@/hooks/useExpenses';
import { analyzeVendors, filterVendors } from '@/utils/vendorAnalytics';
import VendorList from '@/components/VendorList';
import { formatCurrency } from '@/utils/format';

export default function TopVendorsPage() {
  const { expenses, isLoading } = useExpenses();
  const [searchQuery, setSearchQuery] = useState('');

  // Analyze vendors from expenses
  const allVendors = useMemo(() => analyzeVendors(expenses), [expenses]);

  // Filter vendors based on search
  const filteredVendors = useMemo(
    () => filterVendors(allVendors, searchQuery),
    [allVendors, searchQuery]
  );

  // Calculate summary stats
  const totalVendors = allVendors.length;
  const totalSpent = allVendors.reduce((sum, v) => sum + v.totalAmount, 0);
  const totalTransactions = allVendors.reduce((sum, v) => sum + v.transactionCount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🏪</div>
          <p className="text-xl text-gray-600">Analyzing your vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  title="Back to Home"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Top Vendors</h1>
              </div>
              <p className="text-gray-600">See where your money goes most often</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Total Vendors</h3>
                <div className="text-2xl bg-blue-50 p-2 rounded-lg">🏪</div>
              </div>
              <p className="text-2xl font-bold text-blue-600">{totalVendors}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Total Spent</h3>
                <div className="text-2xl bg-green-50 p-2 rounded-lg">💰</div>
              </div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSpent)}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase">
                  Total Transactions
                </h3>
                <div className="text-2xl bg-purple-50 p-2 rounded-lg">📊</div>
              </div>
              <p className="text-2xl font-bold text-purple-600">{totalTransactions}</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🔍</div>
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Clear
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Found {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Vendor List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {searchQuery ? 'Search Results' : 'All Vendors'}
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredVendors.length} of {totalVendors} vendors
            </div>
          </div>
          <VendorList vendors={filteredVendors} searchQuery={searchQuery} />
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
