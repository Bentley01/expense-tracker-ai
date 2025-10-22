'use client';

import { useState, useMemo } from 'react';
import { Expense, Category, CATEGORIES, CATEGORY_ICONS } from '@/types/expense';
import { formatCurrency, formatDate } from '@/utils/format';
import { filterExpenses } from '@/utils/analytics';

type ExportFormat = 'csv' | 'json' | 'pdf';

interface ExportModalProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
  onExport: (
    expenses: Expense[],
    format: ExportFormat,
    filename: string
  ) => Promise<void>;
}

export default function ExportModal({
  expenses,
  isOpen,
  onClose,
  onExport,
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState('expenses-export');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Filter expenses based on selected criteria
  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      category:
        selectedCategories.length === 0 || selectedCategories.length === CATEGORIES.length
          ? undefined
          : (selectedCategories[0] as Category),
    }).filter((exp) => {
      // If specific categories selected, filter by those
      if (selectedCategories.length > 0 && selectedCategories.length < CATEGORIES.length) {
        return selectedCategories.includes(exp.category);
      }
      return true;
    });
  }, [expenses, startDate, endDate, selectedCategories]);

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories(CATEGORIES);
  };

  const handleDeselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(filteredExpenses, format, filename);
      // Reset and close after successful export
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      alert('Export failed. Please try again.');
    }
  };

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Advanced Data Export</h2>
                <p className="text-primary-100 text-sm mt-1">
                  Configure your export with multiple formats and filters
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-primary-500 rounded-lg p-2 transition-colors"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Export Configuration */}
              <div className="space-y-6">
                {/* Export Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Export Summary
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Records to export:</span>
                      <span className="font-bold text-gray-900">
                        {filteredExpenses.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total amount:</span>
                      <span className="font-bold text-gray-900">
                        {formatCurrency(totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-bold text-gray-900 uppercase">
                        {format}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Export Format */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Export Format
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['csv', 'json', 'pdf'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setFormat(fmt as ExportFormat)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          format === fmt
                            ? 'border-primary-600 bg-primary-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-1">
                          {fmt === 'csv' && '📊'}
                          {fmt === 'json' && '{ }'}
                          {fmt === 'pdf' && '📄'}
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            format === fmt ? 'text-primary-700' : 'text-gray-700'
                          }`}
                        >
                          {fmt.toUpperCase()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filename */}
                <div>
                  <label
                    htmlFor="filename"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Filename
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      id="filename"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter filename..."
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      .{format}
                    </span>
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="startDate" className="block text-xs text-gray-600 mb-1">
                        From
                      </label>
                      <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-xs text-gray-600 mb-1">
                        To
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Categories
                    </label>
                    <div className="space-x-2 text-xs">
                      <button
                        onClick={handleSelectAllCategories}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Select All
                      </button>
                      <span className="text-gray-400">|</span>
                      <button
                        onClick={handleDeselectAllCategories}
                        className="text-gray-600 hover:text-gray-700 font-medium"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((category) => (
                      <label
                        key={category}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedCategories.includes(category)
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="mr-2 w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="mr-1">{CATEGORY_ICONS[category]}</span>
                        <span className="text-sm font-medium">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Preview */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-700">Data Preview</h3>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </button>
                </div>

                {showPreview && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {filteredExpenses.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="text-4xl mb-2">📭</div>
                        <p className="text-gray-500 text-sm">
                          No expenses match your filters
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-gray-50 sticky top-0">
                            <tr>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">
                                Date
                              </th>
                              <th className="px-3 py-2 text-left font-semibold text-gray-700">
                                Category
                              </th>
                              <th className="px-3 py-2 text-right font-semibold text-gray-700">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredExpenses.slice(0, 50).map((expense) => (
                              <tr key={expense.id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-gray-700">
                                  {formatDate(expense.date)}
                                </td>
                                <td className="px-3 py-2">
                                  <span className="inline-flex items-center text-gray-700">
                                    <span className="mr-1">
                                      {CATEGORY_ICONS[expense.category]}
                                    </span>
                                    {expense.category}
                                  </span>
                                </td>
                                <td className="px-3 py-2 text-right font-medium text-gray-900">
                                  {formatCurrency(expense.amount)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {filteredExpenses.length > 50 && (
                          <div className="p-2 text-center text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
                            Showing first 50 of {filteredExpenses.length} records
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!showPreview && filteredExpenses.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-4xl mb-3">👁️</div>
                    <p className="text-gray-600 text-sm">
                      Click "Show Preview" to see your data
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isExporting}
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || filteredExpenses.length === 0 || !filename.trim()}
                className={`px-8 py-2 rounded-lg font-medium transition-all ${
                  isExporting || filteredExpenses.length === 0 || !filename.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl'
                }`}
              >
                {isExporting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Exporting...
                  </span>
                ) : (
                  `Export ${filteredExpenses.length} Record${
                    filteredExpenses.length === 1 ? '' : 's'
                  }`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
