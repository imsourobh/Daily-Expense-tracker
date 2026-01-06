'use client';

/**
 * Export/Import Utility for Expense Tracker Data
 * Allows users to backup and restore their data in JSON format
 */

export const exportDataAsJSON = (transactions, savingsData, moneyGivenPeople, metadata = {}) => {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    ...metadata,
    data: {
      transactions,
      savingsData,
      moneyGivenPeople,
    },
  };

  // Create blob and download
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importDataFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.data && data.data.transactions !== undefined) {
          resolve(data.data);
        } else {
          reject(new Error('Invalid backup file format'));
        }
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const downloadDataAsCSV = (transactions) => {
  const headers = ['Date', 'Type', 'Category', 'Source', 'Amount', 'Description'];
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.type,
    t.category || '-',
    t.source || '-',
    t.amount,
    t.description || '-',
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expense-tracker-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
