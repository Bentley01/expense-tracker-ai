# Expense Tracker

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS. Manage your personal finances with an intuitive interface, powerful filtering, and comprehensive analytics.

![Expense Tracker](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan)

## Features

### Core Functionality
- **Add Expenses**: Create new expenses with date, amount, category, and description
- **Edit & Delete**: Modify or remove existing expenses with confirmation prompts
- **Real-time Validation**: Form validation with helpful error messages
- **Data Persistence**: All data saved locally using localStorage

### Advanced Features
- **Smart Filtering**: Filter by date range, category, and search query
- **Expense Analytics**: View total spending, monthly spending, and top categories
- **Category Breakdown**: Visual breakdown of spending by category with percentages
- **CSV Export**: Export filtered expenses to CSV format
- **Responsive Design**: Fully responsive layout for desktop, tablet, and mobile
- **Intuitive UI**: Clean, modern interface with smooth animations

### Categories
- Food
- Transportation
- Entertainment
- Shopping
- Bills
- Other

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Date Utilities**: date-fns
- **State Management**: React Hooks
- **Storage**: localStorage API

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone or download the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Usage Guide

### Adding an Expense

1. Fill in the expense form at the top of the page
2. Select a date (defaults to today)
3. Enter the amount (must be a positive number)
4. Choose a category from the dropdown
5. Add a description (minimum 3 characters)
6. Click "Add Expense"

### Filtering Expenses

Use the Filters section to:
- **Search**: Find expenses by description, category, or amount
- **Category**: Filter by specific category or view all
- **Date Range**: Set start and end dates to view expenses in a specific period
- **Reset**: Clear all filters with one click

### Editing an Expense

1. Click the "Edit" button on any expense in the list
2. The form will populate with the expense data
3. Make your changes
4. Click "Update Expense" to save

### Deleting an Expense

1. Click the "Delete" button on any expense
2. Confirm the deletion in the prompt
3. The expense will be permanently removed

### Exporting Data

1. Apply any filters you want (optional)
2. Click the "Export CSV" button in the header
3. A CSV file will download with your filtered expenses

## Project Structure

```
expense-tracker-ai/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main application page
│   └── globals.css         # Global styles
├── components/
│   ├── ExpenseForm.tsx     # Form for adding/editing expenses
│   ├── ExpenseList.tsx     # Table/list view of expenses
│   ├── ExpenseFilters.tsx  # Filter controls
│   ├── SummaryCards.tsx    # Dashboard summary cards
│   └── CategoryChart.tsx   # Category breakdown visualization
├── hooks/
│   ├── useExpenses.ts      # Expense CRUD operations
│   └── useFilters.ts       # Filter state management
├── types/
│   └── expense.ts          # TypeScript type definitions
├── utils/
│   ├── storage.ts          # localStorage utilities
│   ├── format.ts           # Date and currency formatting
│   └── analytics.ts        # Summary calculations and exports
└── package.json
```

## Component Overview

### ExpenseForm
- Validates user input in real-time
- Supports both add and edit modes
- Shows field-level error messages
- Auto-focuses on validation errors

### ExpenseList
- Displays expenses in a sortable table (desktop)
- Card-based layout for mobile devices
- Inline edit and delete actions
- Empty state when no expenses found

### ExpenseFilters
- Search across all expense fields
- Category dropdown filter
- Date range selection
- One-click reset functionality

### SummaryCards
- Total spending across all time
- Current month spending
- Top spending category
- Number of categories used

### CategoryChart
- Horizontal bar chart showing category breakdown
- Percentage and amount for each category
- Color-coded by category
- Sorted by highest spending

## Data Model

```typescript
interface Expense {
  id: string;              // Unique identifier
  date: string;            // ISO date string
  amount: number;          // Expense amount
  category: Category;      // Expense category
  description: string;     // Expense description
  createdAt: string;       // Creation timestamp
  updatedAt: string;       // Last update timestamp
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Client-side rendering for instant interactions
- Optimized re-renders with React.memo and useMemo
- Efficient filtering with memoized calculations
- Lazy loading of components where applicable

## Future Enhancements

Potential features for future versions:
- [ ] User authentication and cloud sync
- [ ] Budget goals and alerts
- [ ] Recurring expenses
- [ ] Multiple currency support
- [ ] Advanced charts (line graphs, pie charts)
- [ ] Receipt photo uploads
- [ ] PDF export
- [ ] Dark mode
- [ ] Multi-language support

## Troubleshooting

### Data not persisting
- Ensure localStorage is enabled in your browser
- Check browser privacy settings
- Try clearing cache and reloading

### Styles not loading
- Run `npm install` to ensure all dependencies are installed
- Check that Tailwind CSS is properly configured
- Clear `.next` folder and rebuild

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
