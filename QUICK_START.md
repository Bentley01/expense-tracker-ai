# Quick Start Guide

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to: http://localhost:3000

## Your First Expense

1. The expense form is at the top of the page
2. Fill in:
   - **Date**: Today's date is pre-selected
   - **Amount**: e.g., 12.50
   - **Category**: Choose from dropdown (Food, Transportation, etc.)
   - **Description**: e.g., "Lunch at cafe"
3. Click **Add Expense**
4. Your expense appears in the list below!

## Key Features to Try

### 1. Dashboard Summary Cards
- View total spending, monthly spending, top category, and more
- Updated automatically as you add expenses

### 2. Filtering & Search
- **Search**: Type in the search box to find specific expenses
- **Category Filter**: Select a category to view only those expenses
- **Date Range**: Set start/end dates to view expenses in a period
- **Reset**: Click "Reset All" to clear filters

### 3. Edit & Delete
- Click **Edit** on any expense to modify it
- Click **Delete** to remove (with confirmation)

### 4. Category Breakdown
- See visual breakdown of spending by category
- Shows percentages and amounts
- Color-coded bars

### 5. Export Data
- Click **Export CSV** button to download your expenses
- Opens in Excel, Google Sheets, or any CSV viewer

## Production Build

```bash
npm run build
npm start
```

## Tips

- All data is saved automatically in your browser's localStorage
- The app works offline once loaded
- Fully responsive - works on phone, tablet, and desktop
- Form validates inputs to prevent errors

## Common Tasks

### Add Multiple Expenses Quickly
After adding an expense, the form clears automatically. Just enter the next expense!

### View This Month's Spending
Check the "This Month" card in the dashboard - it shows current month total.

### Find Your Biggest Expenses
Look at the expense list - it's sorted by date. Use search to find specific items.

### Track Spending by Category
Use the category filter to see all expenses in a category, or check the category breakdown chart.

Enjoy tracking your expenses!
