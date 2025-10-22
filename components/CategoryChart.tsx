'use client';

import { ExpenseSummary, CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/expense';
import { formatCurrency } from '@/utils/format';

interface CategoryChartProps {
  summary: ExpenseSummary;
}

export default function CategoryChart({ summary }: CategoryChartProps) {
  const { categoryBreakdown } = summary;

  if (categoryBreakdown.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-gray-500">No expense data to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Spending by Category</h3>

      <div className="space-y-4">
        {categoryBreakdown.map((item) => (
          <div key={item.category}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-xl mr-2">{CATEGORY_ICONS[item.category]}</span>
                <span className="font-medium text-gray-700">{item.category}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(item.amount)}
                </div>
                <div className="text-xs text-gray-500">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: CATEGORY_COLORS[item.category],
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend/Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(summary.totalSpending)}
          </span>
        </div>
      </div>
    </div>
  );
}
