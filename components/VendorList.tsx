'use client';

import { VendorData, CATEGORY_ICONS, CATEGORY_COLORS } from '@/types/expense';
import { formatCurrency, formatDate } from '@/utils/format';

interface VendorListProps {
  vendors: VendorData[];
  searchQuery?: string;
}

export default function VendorList({ vendors, searchQuery }: VendorListProps) {
  if (vendors.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">🏪</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Vendors Found</h3>
        <p className="text-gray-500">
          {searchQuery
            ? `No vendors match your search "${searchQuery}"`
            : 'Add some expenses to see your top vendors'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vendors.map((vendor, index) => (
        <div
          key={vendor.vendor}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          {/* Rank indicator */}
          <div
            className="h-2"
            style={{
              background: `linear-gradient(to right, ${CATEGORY_COLORS[vendor.primaryCategory]}, ${CATEGORY_COLORS[vendor.primaryCategory]}dd)`,
            }}
          ></div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    #{index + 1}
                  </div>
                </div>

                {/* Vendor Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 truncate" title={vendor.vendor}>
                    {vendor.vendor}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      {CATEGORY_ICONS[vendor.primaryCategory]}
                      {vendor.primaryCategory}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="text-right flex-shrink-0 ml-4">
                <div className="text-2xl font-bold text-primary-600">
                  {formatCurrency(vendor.totalAmount)}
                </div>
                <div className="text-sm text-gray-500">Total Spent</div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              {/* Transaction Count */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Transactions</div>
                <div className="text-2xl font-bold text-blue-600">
                  {vendor.transactionCount}
                </div>
              </div>

              {/* Last Transaction */}
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Last Purchase</div>
                <div className="text-lg font-semibold text-green-600">
                  {formatDate(vendor.lastTransactionDate)}
                </div>
              </div>

              {/* Average Per Transaction */}
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Avg per Transaction</div>
                <div className="text-lg font-semibold text-purple-600">
                  {formatCurrency(vendor.totalAmount / vendor.transactionCount)}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            {vendor.categoryBreakdown.length > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-2">Category Breakdown</div>
                <div className="flex flex-wrap gap-2">
                  {vendor.categoryBreakdown.map(catData => (
                    <div
                      key={catData.category}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[catData.category]}20`,
                        color: CATEGORY_COLORS[catData.category],
                      }}
                    >
                      <span>{CATEGORY_ICONS[catData.category]}</span>
                      <span className="font-medium">{catData.category}</span>
                      <span className="text-xs opacity-75">
                        ({formatCurrency(catData.amount)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
