'use client';

import { useMemo } from 'react';
import { Expense, getCategoryIcon, getCategoryColor } from '@/types/expense';
import { formatCurrency } from '@/utils/format';

interface MonthlyInsightsProps {
  expenses: Expense[];
}

export default function MonthlyInsights({ expenses }: MonthlyInsightsProps) {
  // Calculate current month's data
  const monthlyData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter expenses for current month
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    // Calculate category totals
    const categoryTotals: Record<string, number> = {};
    monthExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    // Sort categories by spending (highest first)
    const sortedCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    // Get top 3 categories
    const top3 = sortedCategories.slice(0, 3);

    // Calculate total spending
    const totalSpending = sortedCategories.reduce((sum, cat) => sum + cat.amount, 0);

    // Calculate budget streak (days without spending over a threshold)
    // For simplicity, let's count consecutive days with expenses under $50/day
    const budgetStreak = calculateBudgetStreak(monthExpenses);

    return {
      top3,
      totalSpending,
      categoryTotals,
      sortedCategories,
      budgetStreak,
    };
  }, [expenses]);

  // Simple SVG donut chart
  const DonutChart = () => {
    const { sortedCategories, totalSpending } = monthlyData;

    if (sortedCategories.length === 0) {
      return (
        <div className="w-64 h-64 flex items-center justify-center text-gray-400">
          No data for this month
        </div>
      );
    }

    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    const strokeWidth = 40;

    let currentAngle = -90; // Start from top

    const segments = sortedCategories.map((cat, index) => {
      const percentage = (cat.amount / totalSpending) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      // Calculate arc path
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      ].join(' ');

      currentAngle = endAngle;

      const color = getCategoryColor(cat.category);

      return (
        <path
          key={cat.category}
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      );
    });

    return (
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
          {segments}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-700">Spending</p>
          </div>
        </div>
        {/* "Donut chart!" annotation */}
        <div className="absolute -right-4 top-1/2 transform translate-x-full -translate-y-1/2">
          <p className="text-gray-400 italic text-sm whitespace-nowrap">donut chart!</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with decorative line */}
      <div className="mb-8">
        <div className="relative">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
            Monthly Insights
          </h1>
          <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-gray-300 -z-10"></div>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="flex justify-center mb-12">
        <DonutChart />
      </div>

      {/* Top 3 Categories */}
      <div className="mb-12">
        <div className="space-y-4">
          {monthlyData.top3.map((cat, index) => {
            const color = getCategoryColor(cat.category);
            const icon = getCategoryIcon(cat.category);

            return (
              <div key={cat.category} className="flex items-center gap-4">
                {/* Color bar */}
                <div
                  className="w-1 h-12 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                {/* Category info */}
                <div className="flex items-center gap-3 text-lg">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-medium text-gray-800">
                    {cat.category}:
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {monthlyData.top3.length > 0 && (
          <div className="mt-4 text-right">
            <p className="text-sm text-gray-500 italic">Top 3!</p>
          </div>
        )}
      </div>

      {/* Budget Streak */}
      <div className="border-4 border-dashed border-gray-900 rounded-2xl p-8 bg-white">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Budget Streak
        </h2>
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-7xl font-bold text-green-600">
              {monthlyData.budgetStreak}
            </p>
            <p className="text-2xl font-semibold text-gray-700 mt-2">
              days!
            </p>
          </div>
          {/* Decorative badge */}
          <div className="w-32 h-16 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 opacity-50 relative overflow-hidden">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.3) 10px, rgba(255,255,255,.3) 20px)'
            }}></div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {monthlyData.top3.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            No expenses recorded for this month yet.
          </p>
          <p className="text-gray-400">
            Start adding expenses to see your monthly insights!
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to calculate budget streak
function calculateBudgetStreak(expenses: Expense[]): number {
  if (expenses.length === 0) return 0;

  // Group expenses by date
  const expensesByDate: Record<string, number> = {};
  expenses.forEach(expense => {
    const dateKey = expense.date.split('T')[0]; // Get date part only
    expensesByDate[dateKey] = (expensesByDate[dateKey] || 0) + expense.amount;
  });

  // Get all dates in current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Count consecutive days with spending under $50/day (or days with no spending)
  const budgetLimit = 50;
  let streak = 0;
  let currentStreak = 0;

  for (let day = 1; day <= now.getDate(); day++) {
    const dateKey = new Date(year, month, day).toISOString().split('T')[0];
    const dailySpending = expensesByDate[dateKey] || 0;

    if (dailySpending <= budgetLimit) {
      currentStreak++;
      streak = Math.max(streak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return streak;
}
