import { Expense, VendorData, Category } from '@/types/expense';

/**
 * Extracts vendor name from expense description
 * Simple approach: normalize the description to use as vendor identifier
 * This treats each unique description as a unique vendor
 */
export const extractVendorName = (description: string): string => {
  // Trim and normalize the description
  const normalized = description.trim();

  // If description is empty, return a default
  if (!normalized) {
    return 'Unknown Vendor';
  }

  return normalized;
};

/**
 * Analyzes expenses to extract vendor data
 * Groups expenses by vendor (description) and calculates metrics
 */
export const analyzeVendors = (expenses: Expense[]): VendorData[] => {
  // Group expenses by vendor
  const vendorMap = new Map<string, Expense[]>();

  expenses.forEach(expense => {
    const vendor = extractVendorName(expense.description);
    const existing = vendorMap.get(vendor) || [];
    vendorMap.set(vendor, [...existing, expense]);
  });

  // Convert to VendorData array
  const vendorDataList: VendorData[] = [];

  vendorMap.forEach((vendorExpenses, vendor) => {
    // Calculate total amount
    const totalAmount = vendorExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Transaction count
    const transactionCount = vendorExpenses.length;

    // Find most recent transaction
    const lastTransactionDate = vendorExpenses
      .map(exp => exp.date)
      .sort()
      .reverse()[0];

    // Calculate category breakdown
    const categoryMap = new Map<Category, { amount: number; count: number }>();

    vendorExpenses.forEach(exp => {
      const existing = categoryMap.get(exp.category) || { amount: 0, count: 0 };
      categoryMap.set(exp.category, {
        amount: existing.amount + exp.amount,
        count: existing.count + 1,
      });
    });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Determine primary category (most common by count)
    const primaryCategory = categoryBreakdown.length > 0
      ? categoryBreakdown.sort((a, b) => b.count - a.count)[0].category
      : 'Other' as Category;

    vendorDataList.push({
      vendor,
      totalAmount,
      transactionCount,
      lastTransactionDate,
      primaryCategory,
      categoryBreakdown,
    });
  });

  // Sort by total amount (highest to lowest)
  return vendorDataList.sort((a, b) => b.totalAmount - a.totalAmount);
};

/**
 * Get top N vendors by spending
 */
export const getTopVendors = (expenses: Expense[], limit: number = 10): VendorData[] => {
  const allVendors = analyzeVendors(expenses);
  return allVendors.slice(0, limit);
};

/**
 * Search/filter vendors by name
 */
export const filterVendors = (vendors: VendorData[], searchQuery: string): VendorData[] => {
  if (!searchQuery.trim()) {
    return vendors;
  }

  const query = searchQuery.toLowerCase();
  return vendors.filter(vendor =>
    vendor.vendor.toLowerCase().includes(query)
  );
};
