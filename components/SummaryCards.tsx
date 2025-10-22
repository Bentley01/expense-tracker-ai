'use client';

import { ExpenseSummary, CATEGORY_ICONS } from '@/types/expense';
import { formatCurrency } from '@/utils/format';

interface SummaryCardsProps {
  summary: ExpenseSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Spending',
      value: formatCurrency(summary.totalSpending),
      icon: '💰',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'This Month',
      value: formatCurrency(summary.monthlySpending),
      icon: '📅',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Top Category',
      value: summary.topCategory
        ? `${summary.topCategory.category} (${formatCurrency(summary.topCategory.amount)})`
        : 'N/A',
      icon: summary.topCategory ? CATEGORY_ICONS[summary.topCategory.category] : '📊',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Categories',
      value: summary.categoryBreakdown.length.toString(),
      icon: '📂',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase">{card.title}</h3>
              <div className={`text-2xl ${card.bgColor} p-2 rounded-lg`}>
                {card.icon}
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.textColor} truncate`} title={card.value}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
