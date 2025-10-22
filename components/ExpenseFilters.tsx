'use client';

import { CATEGORIES, Category } from '@/types/expense';

interface ExpenseFiltersProps {
  searchQuery: string;
  category: Category | 'All';
  startDate?: string;
  endDate?: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: Category | 'All') => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
}

export default function ExpenseFilters({
  searchQuery,
  category,
  startDate,
  endDate,
  onSearchChange,
  onCategoryChange,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: ExpenseFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Reset All
        </button>
      </div>

      {/* Search */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          id="search"
          placeholder="Search descriptions, categories, or amounts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="categoryFilter"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as Category | 'All')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            From Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate || ''}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            To Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate || ''}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );
}
