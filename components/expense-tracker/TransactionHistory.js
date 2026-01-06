'use client';

import { useState } from 'react';

const formatBDT = (amount) => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const EXPENSE_CATEGORIES = {
  food: { label: '🍽️ Food & Cloth', color: 'from-orange-500 to-red-500' },
  entertainment: { label: '🎮 Entertainment', color: 'from-pink-500 to-purple-500' },
  vehicle: { label: '🚗 Vehicle', color: 'from-blue-500 to-cyan-500' },
  extra: { label: '✨ Extra', color: 'from-yellow-500 to-orange-500' },
};

const SAVINGS_SOURCES = {
  mobile: { label: '📱 Mobile Money', color: 'from-blue-500 to-cyan-500' },
  cash: { label: '💵 Cash', color: 'from-green-500 to-emerald-500' },
  card: { label: '💳 Card', color: 'from-purple-500 to-pink-500' },
  moneyGiven: { label: '🤝 Money Given', color: 'from-orange-500 to-red-500' },
};

export default function TransactionHistory({ transactions, moneyGivenPeople, onDeleteTransaction }) {
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-3 border-b border-cyan-500/20 overflow-x-auto">
        {[
          { value: 'all', label: 'All Transactions', count: transactions.length },
          { value: 'expense', label: 'Expenses', count: transactions.filter(t => t.type === 'expense').length },
          { value: 'savings', label: 'Savings', count: transactions.filter(t => t.type === 'savings').length },
          { value: 'moneyGiven', label: 'Money Given', count: transactions.filter(t => t.type === 'moneyGiven').length },
          { value: 'moneyReceived', label: 'Money Received', count: transactions.filter(t => t.type === 'moneyReceived').length },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={`px-4 py-3 font-semibold transition-all duration-300 relative whitespace-nowrap ${
              filterType === tab.value
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label} <span className="text-xs ml-2 opacity-70">({tab.count})</span>
            {filterType === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 blur-sm"></span>
            )}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/20 rounded-xl p-12 text-center">
          <p className="text-gray-400 text-lg">No transactions yet. Start by adding expenses or savings!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
          {filteredTransactions.map(transaction => (
            <div
              key={transaction.id}
              className="bg-gradient-to-r from-slate-900 to-slate-800 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    {transaction.type === 'expense' ? (
                      <>
                        <div className="text-2xl">{EXPENSE_CATEGORIES[transaction.category]?.label.split(' ')[0] || '💸'}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">
                            {EXPENSE_CATEGORIES[transaction.category]?.label || 'Unknown'}
                          </p>
                          {transaction.description && (
                            <p className="text-sm text-gray-400 truncate">{transaction.description}</p>
                          )}
                        </div>
                      </>
                    ) : transaction.type === 'moneyGiven' ? (
                      <>
                        <div className="text-2xl">💸</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">
                            Money Given to {moneyGivenPeople?.find(p => p.id === transaction.personId)?.name || 'Unknown'}
                          </p>
                          {transaction.description && (
                            <p className="text-sm text-gray-400 truncate">{transaction.description}</p>
                          )}
                        </div>
                      </>
                    ) : transaction.type === 'moneyReceived' ? (
                      <>
                        <div className="text-2xl">💰</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">
                            Money Received from {moneyGivenPeople?.find(p => p.id === transaction.personId)?.name || 'Unknown'}
                          </p>
                          {transaction.description && (
                            <p className="text-sm text-gray-400 truncate">{transaction.description}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl">{SAVINGS_SOURCES[transaction.source]?.label.split(' ')[0] || '💰'}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white truncate">
                            {SAVINGS_SOURCES[transaction.source]?.label || 'Unknown'}
                          </p>
                          {transaction.description && (
                            <p className="text-sm text-gray-400 truncate">{transaction.description}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatDate(transaction.date)}</p>
                </div>

                {/* Amount and Delete Button */}
                <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                  <span
                    className={`text-lg font-bold ${
                      transaction.type === 'expense' || transaction.type === 'moneyGiven' ? 'text-pink-400' : 'text-green-400'
                    }`}
                  >
                    {transaction.type === 'expense' || transaction.type === 'moneyGiven' ? '−' : '+'} {formatBDT(transaction.amount)}
                  </span>
                  <button
                    onClick={() => onDeleteTransaction(transaction.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Transaction Source/Details */}
              {(transaction.type === 'expense' || transaction.type === 'moneyGiven' || transaction.type === 'moneyReceived') && (
                <div className="mt-3 pt-3 border-t border-cyan-500/10">
                  <p className="text-xs text-gray-400 mb-2">
                    {transaction.type === 'expense' ? 'Paid from:' : transaction.type === 'moneyGiven' ? 'From:' : 'Received to:'}
                  </p>
                  <span className="text-xs bg-slate-800/50 border border-cyan-500/20 rounded px-2 py-1 text-cyan-400 inline-block">
                    {SAVINGS_SOURCES[transaction.source]?.label || transaction.source}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
