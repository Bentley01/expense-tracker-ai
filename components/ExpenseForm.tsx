'use client';

import { useState, FormEvent, useEffect } from 'react';
import { ExpenseFormData, Category, Expense, CustomCategory } from '@/types/expense';
import { getTodayDate, isValidAmount } from '@/utils/format';
import { storage } from '@/utils/storage';

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormData) => void;
  onCancel?: () => void;
  initialData?: Expense;
  submitLabel?: string;
}

export default function ExpenseForm({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = 'Add Expense'
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    date: getTodayDate(),
    amount: '',
    category: 'Food',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ExpenseFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ExpenseFormData, boolean>>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Load categories on mount
  useEffect(() => {
    setCategories(storage.getAllCategories());
  }, []);

  // Populate form with initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        amount: initialData.amount.toString(),
        category: initialData.category,
        description: initialData.description,
      });
    }
  }, [initialData]);

  const validateField = (name: keyof ExpenseFormData, value: string): string => {
    switch (name) {
      case 'amount':
        if (!value) return 'Amount is required';
        if (!isValidAmount(value)) return 'Amount must be a positive number';
        return '';
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 3) return 'Description must be at least 3 characters';
        return '';
      case 'date':
        if (!value) return 'Date is required';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change if field has been touched
    if (touched[name as keyof ExpenseFormData]) {
      const error = validateField(name as keyof ExpenseFormData, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name as keyof ExpenseFormData, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleAddNewCategory = () => {
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      alert('Please enter a category name');
      return;
    }

    if (storage.categoryExists(trimmedName)) {
      alert('This category already exists');
      return;
    }

    const newCategory: CustomCategory = {
      name: trimmedName,
      createdAt: new Date().toISOString(),
    };

    storage.addCustomCategory(newCategory);
    setCategories(storage.getAllCategories());
    setFormData(prev => ({ ...prev, category: trimmedName }));
    setNewCategoryName('');
    setShowNewCategoryInput(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<Record<keyof ExpenseFormData, string>> = {};
    (Object.keys(formData) as Array<keyof ExpenseFormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      date: true,
      amount: true,
      category: true,
      description: true,
    });

    // If no errors, submit
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);

      // Reset form if adding new expense
      if (!initialData) {
        setFormData({
          date: getTodayDate(),
          amount: '',
          category: 'Food',
          description: '',
        });
        setTouched({});
        setErrors({});
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {initialData ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.date && touched.date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.date && touched.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($) *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.amount && touched.amount ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.amount && touched.amount && (
            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category *
        </label>
        <div className="flex gap-2">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowNewCategoryInput(!showNewCategoryInput)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            title="Add new category"
          >
            ➕
          </button>
        </div>

        {/* New Category Input */}
        {showNewCategoryInput && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
            <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-1">
              New Category Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="newCategory"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNewCategory();
                  }
                }}
                placeholder="e.g., Health, Education..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={handleAddNewCategory}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewCategoryInput(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Enter expense description..."
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${
            errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && touched.description && (
          <p className="text-red-500 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
