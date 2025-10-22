export type ExportTemplate = {
  id: string;
  name: string;
  description: string;
  icon: string;
  format: 'csv' | 'json' | 'pdf' | 'xlsx';
  fields: string[];
  filters?: {
    dateRange?: 'all' | 'month' | 'quarter' | 'year' | 'custom';
    categories?: string[];
  };
};

export type CloudProvider = {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  lastSync?: string;
};

export type ExportHistory = {
  id: string;
  timestamp: string;
  template: string;
  provider: string;
  format: string;
  recordCount: number;
  status: 'success' | 'pending' | 'failed';
  destination: string;
};

export type ScheduledExport = {
  id: string;
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  template: string;
  providers: string[];
  nextRun: string;
};

export type ShareLink = {
  id: string;
  url: string;
  expiresAt?: string;
  password?: boolean;
  accessCount: number;
  createdAt: string;
};

export const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: 'tax-report',
    name: 'Tax Report',
    description: 'Detailed expense report formatted for tax purposes',
    icon: '📋',
    format: 'pdf',
    fields: ['date', 'category', 'amount', 'description', 'receipt'],
    filters: { dateRange: 'year' },
  },
  {
    id: 'monthly-summary',
    name: 'Monthly Summary',
    description: 'Condensed monthly overview with category totals',
    icon: '📊',
    format: 'pdf',
    fields: ['category', 'total', 'count', 'average'],
    filters: { dateRange: 'month' },
  },
  {
    id: 'category-analysis',
    name: 'Category Analysis',
    description: 'Deep dive into spending patterns by category',
    icon: '📈',
    format: 'xlsx',
    fields: ['category', 'total', 'percentage', 'trend', 'monthOverMonth'],
    filters: { dateRange: 'quarter' },
  },
  {
    id: 'full-backup',
    name: 'Full Backup',
    description: 'Complete data export with all fields and metadata',
    icon: '💾',
    format: 'json',
    fields: ['all'],
    filters: { dateRange: 'all' },
  },
  {
    id: 'budget-tracker',
    name: 'Budget Tracker',
    description: 'Spending comparison against budget limits',
    icon: '🎯',
    format: 'csv',
    fields: ['category', 'spent', 'budget', 'remaining', 'percentage'],
    filters: { dateRange: 'month' },
  },
  {
    id: 'minimal-export',
    name: 'Minimal Export',
    description: 'Basic expense list for quick review',
    icon: '📝',
    format: 'csv',
    fields: ['date', 'category', 'amount'],
    filters: { dateRange: 'month' },
  },
];

export const CLOUD_PROVIDERS: CloudProvider[] = [
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    icon: '📗',
    color: '#34A853',
    connected: false,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '📦',
    color: '#0061FF',
    connected: false,
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '☁️',
    color: '#0078D4',
    connected: false,
  },
  {
    id: 'email',
    name: 'Email',
    icon: '📧',
    color: '#EA4335',
    connected: true,
  },
  {
    id: 'airtable',
    name: 'Airtable',
    icon: '🔲',
    color: '#FCB400',
    connected: false,
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: '📓',
    color: '#000000',
    connected: false,
  },
];
