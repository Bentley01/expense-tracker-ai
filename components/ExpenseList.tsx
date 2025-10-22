'use client';

import { Expense, CATEGORY_ICONS, CATEGORY_COLORS } from '@/types/expense';
import { formatCurrency, formatDate } from '@/utils/format';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No expenses found</h3>
        <p className="text-gray-500">
          Add your first expense or adjust your filters to see results.
        </p>
      </div>
    );
  }

  // Sort expenses by date (most recent first)
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedExpenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[expense.category]}15`,
                      color: CATEGORY_COLORS[expense.category],
                    }}
                  >
                    <span className="mr-1">{CATEGORY_ICONS[expense.category]}</span>
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="max-w-xs truncate" title={expense.description}>
                    {expense.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-primary-600 hover:text-primary-900 mr-3 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this expense?')) {
                        onDelete(expense.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {sortedExpenses.map((expense) => (
            <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-1">{formatDate(expense.date)}</div>
                  <div className="font-medium text-gray-900 mb-2">{expense.description}</div>
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[expense.category]}15`,
                      color: CATEGORY_COLORS[expense.category],
                    }}
                  >
                    <span className="mr-1">{CATEGORY_ICONS[expense.category]}</span>
                    {expense.category}
                  </span>
                </div>
                <div className="text-right ml-4">
                  <div className="font-semibold text-gray-900 mb-2">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-xs text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this expense?')) {
                          onDelete(expense.id);
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
