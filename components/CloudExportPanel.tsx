'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';
import {
  EXPORT_TEMPLATES,
  CLOUD_PROVIDERS,
  ExportTemplate,
  CloudProvider,
  ExportHistory,
  ScheduledExport,
  ShareLink,
} from '@/types/cloud-export';
import { formatCurrency, formatDate } from '@/utils/format';

interface CloudExportPanelProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'export' | 'history' | 'schedule' | 'share' | 'integrations';

export default function CloudExportPanel({
  expenses,
  isOpen,
  onClose,
}: CloudExportPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('export');
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate | null>(null);
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['email']);
  const [emailAddress, setEmailAddress] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data for demonstration
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      template: 'Monthly Summary',
      provider: 'Google Sheets',
      format: 'pdf',
      recordCount: 45,
      status: 'success',
      destination: 'My Drive/Expenses/',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      template: 'Tax Report',
      provider: 'Email',
      format: 'pdf',
      recordCount: 120,
      status: 'success',
      destination: 'user@example.com',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      template: 'Full Backup',
      provider: 'Dropbox',
      format: 'json',
      recordCount: 200,
      status: 'success',
      destination: '/Backups/expenses.json',
    },
  ]);

  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([
    {
      id: '1',
      enabled: true,
      frequency: 'weekly',
      template: 'monthly-summary',
      providers: ['email', 'google-sheets'],
      nextRun: new Date(Date.now() + 432000000).toISOString(),
    },
    {
      id: '2',
      enabled: false,
      frequency: 'monthly',
      template: 'tax-report',
      providers: ['dropbox'],
      nextRun: new Date(Date.now() + 2592000000).toISOString(),
    },
  ]);

  const [shareLinks, setShareLinks] = useState<ShareLink[]>([
    {
      id: '1',
      url: 'https://expense-tracker.app/share/abc123xyz',
      expiresAt: new Date(Date.now() + 604800000).toISOString(),
      password: true,
      accessCount: 3,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const [cloudProviders, setCloudProviders] = useState<CloudProvider[]>(CLOUD_PROVIDERS);

  const handleExport = async () => {
    if (!selectedTemplate) return;

    setIsExporting(true);

    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Add to history
    const newExport: ExportHistory = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      template: selectedTemplate.name,
      provider: selectedProviders.map(id =>
        cloudProviders.find(p => p.id === id)?.name || id
      ).join(', '),
      format: selectedTemplate.format,
      recordCount: expenses.length,
      status: 'success',
      destination: selectedProviders.includes('email') ? emailAddress : 'Cloud Storage',
    };

    setExportHistory([newExport, ...exportHistory]);
    setIsExporting(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setActiveTab('history');
    }, 2000);
  };

  const handleConnectProvider = (providerId: string) => {
    setCloudProviders(prev =>
      prev.map(p =>
        p.id === providerId
          ? { ...p, connected: !p.connected, lastSync: p.connected ? undefined : new Date().toISOString() }
          : p
      )
    );
  };

  const generateShareLink = () => {
    const newLink: ShareLink = {
      id: Date.now().toString(),
      url: `https://expense-tracker.app/share/${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: new Date(Date.now() + 604800000).toISOString(),
      password: false,
      accessCount: 0,
      createdAt: new Date().toISOString(),
    };
    setShareLinks([newLink, ...shareLinks]);
  };

  const generateQRCode = (url: string) => {
    // In a real implementation, this would generate an actual QR code
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`, '_blank');
  };

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'export', label: 'Export', icon: '🚀' },
    { id: 'history', label: 'History', icon: '📜' },
    { id: 'schedule', label: 'Schedule', icon: '⏰' },
    { id: 'share', label: 'Share', icon: '🔗' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Sliding Panel */}
      <div className="fixed inset-y-0 right-0 max-w-2xl w-full">
        <div className="h-full flex flex-col bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                    <span className="text-3xl">☁️</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Cloud Export</h2>
                    <p className="text-indigo-100 text-sm">Export, sync, and share your data</p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/90 hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Export Tab */}
            {activeTab === 'export' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Export Template</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {EXPORT_TEMPLATES.map(template => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedTemplate?.id === template.id
                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="text-3xl mb-2">{template.icon}</div>
                        <div className="font-semibold text-gray-800 text-sm mb-1">
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {template.description}
                        </div>
                        <div className="mt-2 text-xs">
                          <span className="px-2 py-1 bg-gray-100 rounded text-gray-600 uppercase font-medium">
                            {template.format}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedTemplate && (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Choose Destination</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {cloudProviders.map(provider => (
                          <button
                            key={provider.id}
                            onClick={() => {
                              if (provider.connected) {
                                setSelectedProviders(prev =>
                                  prev.includes(provider.id)
                                    ? prev.filter(p => p !== provider.id)
                                    : [...prev, provider.id]
                                );
                              } else {
                                handleConnectProvider(provider.id);
                              }
                            }}
                            disabled={!provider.connected}
                            className={`p-3 rounded-lg border-2 transition-all ${
                              selectedProviders.includes(provider.id)
                                ? 'border-indigo-500 bg-indigo-50'
                                : provider.connected
                                ? 'border-gray-200 hover:border-gray-300 bg-white'
                                : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="text-2xl mb-1">{provider.icon}</div>
                            <div className="text-xs font-medium text-gray-700">{provider.name}</div>
                            {!provider.connected && (
                              <div className="text-xs text-red-500 mt-1">Not connected</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedProviders.includes('email') && (
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}

                    <button
                      onClick={handleExport}
                      disabled={isExporting || selectedProviders.length === 0}
                      className={`w-full py-3 rounded-lg font-semibold transition-all ${
                        isExporting || selectedProviders.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isExporting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Exporting...
                        </span>
                      ) : showSuccess ? (
                        <span className="flex items-center justify-center">
                          <span className="mr-2">✓</span>
                          Export Successful!
                        </span>
                      ) : (
                        `Export to ${selectedProviders.length} Destination${selectedProviders.length > 1 ? 's' : ''}`
                      )}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Export History</h3>
                  <span className="text-sm text-gray-500">{exportHistory.length} exports</span>
                </div>
                {exportHistory.map(item => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{item.template}</h4>
                        <p className="text-sm text-gray-500">{item.provider} • {item.format.toUpperCase()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'success' ? 'bg-green-100 text-green-700' :
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Records:</span>
                        <span className="font-medium">{item.recordCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Destination:</span>
                        <span className="font-medium truncate ml-2">{item.destination}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Automatic Backups</h3>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                    + New Schedule
                  </button>
                </div>

                {scheduledExports.map(schedule => {
                  const template = EXPORT_TEMPLATES.find(t => t.id === schedule.template);
                  return (
                    <div key={schedule.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">{template?.name}</h4>
                          <p className="text-sm text-gray-500 capitalize">{schedule.frequency} export</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={schedule.enabled}
                            onChange={() => {
                              setScheduledExports(prev =>
                                prev.map(s =>
                                  s.id === schedule.id ? { ...s, enabled: !s.enabled } : s
                                )
                              );
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next run:</span>
                          <span className="font-medium">{new Date(schedule.nextRun).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Destinations:</span>
                          <span className="font-medium">{schedule.providers.length} services</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Share Tab */}
            {activeTab === 'share' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Generate Share Link</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Create a secure, temporary link to share your expense data with others.
                  </p>
                  <button
                    onClick={generateShareLink}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
                  >
                    🔗 Generate New Share Link
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Active Share Links</h3>
                  <div className="space-y-3">
                    {shareLinks.map(link => (
                      <div key={link.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="text-sm font-mono text-indigo-600 break-all mb-1">{link.url}</div>
                            <div className="text-xs text-gray-500">
                              Created {new Date(link.createdAt).toLocaleDateString()} •
                              Expires {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : 'Never'}
                            </div>
                          </div>
                          <button
                            onClick={() => generateQRCode(link.url)}
                            className="ml-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
                          >
                            QR Code
                          </button>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-gray-600">
                              👁️ {link.accessCount} views
                            </span>
                            {link.password && (
                              <span className="text-green-600 font-medium">
                                🔒 Password protected
                              </span>
                            )}
                          </div>
                          <button className="text-red-600 hover:text-red-700 text-xs font-medium">
                            Revoke
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Connected Services</h3>
                {cloudProviders.map(provider => (
                  <div key={provider.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{provider.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{provider.name}</h4>
                          {provider.connected ? (
                            <p className="text-sm text-green-600 font-medium">
                              ✓ Connected
                              {provider.lastSync && (
                                <span className="text-gray-500 ml-2">
                                  • Synced {new Date(provider.lastSync).toLocaleTimeString()}
                                </span>
                              )}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500">Not connected</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleConnectProvider(provider.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          provider.connected
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {provider.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
