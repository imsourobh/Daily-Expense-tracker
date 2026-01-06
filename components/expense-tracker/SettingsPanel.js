'use client';

import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { exportDataAsJSON, importDataFromJSON, downloadDataAsCSV } from '@/utils/exportImport';

export default function SettingsPanel({
  transactions,
  savingsData,
  moneyGivenPeople,
  onDataImported,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleExportJSON = () => {
    try {
      exportDataAsJSON(transactions, savingsData, moneyGivenPeople);
      setMessageType('success');
      setMessage('✅ Data exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessageType('error');
      setMessage('❌ Failed to export data');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleExportCSV = () => {
    try {
      downloadDataAsCSV(transactions);
      setMessageType('success');
      setMessage('✅ CSV exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessageType('error');
      setMessage('❌ Failed to export CSV');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleImportJSON = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const importedData = await importDataFromJSON(file);
      
      // Save to Capacitor Preferences
      await Preferences.set({
        key: 'expenseSavingsData',
        value: JSON.stringify({
          savings: importedData.savingsData,
          moneyGivenPeople: importedData.moneyGivenPeople,
          transactions: importedData.transactions,
        }),
      });

      setMessageType('success');
      setMessage('✅ Data imported successfully! Please refresh the page.');
      
      // Call callback
      if (onDataImported) {
        onDataImported(importedData);
      }

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessageType('error');
      setMessage(`❌ ${error.message}`);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Data Management</h2>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-lg text-center font-semibold ${
            messageType === 'success'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4">
        {/* Export JSON */}
        <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">📥 Export to JSON</h3>
          <p className="text-gray-400 text-sm mb-4">
            Download a complete backup of your data as JSON file. Keep it safe for disaster recovery.
          </p>
          <button
            onClick={handleExportJSON}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
          >
            📥 Export to JSON Backup
          </button>
        </div>

        {/* Export CSV */}
        <div className="bg-slate-800/50 border border-green-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">📊 Export to CSV</h3>
          <p className="text-gray-400 text-sm mb-4">
            Export transaction history as CSV for spreadsheet analysis (Excel, Google Sheets, etc).
          </p>
          <button
            onClick={handleExportCSV}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
          >
            📊 Export to CSV
          </button>
        </div>

        {/* Import JSON */}
        <div className="bg-slate-800/50 border border-orange-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-400 mb-4">📤 Import from JSON</h3>
          <p className="text-gray-400 text-sm mb-4">
            Restore your data from a previously exported JSON backup file.
          </p>
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              disabled={isLoading}
              className="hidden"
            />
            <span className="w-full block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer text-center">
              {isLoading ? '⏳ Importing...' : '📤 Choose JSON File'}
            </span>
          </label>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <p className="text-purple-300 text-sm">
          💡 <strong>Tip:</strong> Export your data regularly and keep backups in safe locations (cloud storage, external drive, email).
        </p>
      </div>
    </div>
  );
}
