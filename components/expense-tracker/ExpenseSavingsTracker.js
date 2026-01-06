'use client';

import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';
import ExpenseForm from './ExpenseForm';
import SavingsManagement from './SavingsManagement';
import TransactionHistory from './TransactionHistory';
import SavingsBalance from './SavingsBalance';
import ExpenseBreakdown from './ExpenseBreakdown';
import MoneyGivenForm from './MoneyGivenForm';
import SettingsPanel from './SettingsPanel';
import FinancialForecast from './FinancialForecast';

// Format Bangladeshi Taka
const formatBDT = (amount) => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ExpenseSavingsTracker() {
  const [savingsData, setSavingsData] = useState({
    mobile: 0,
    cash: 0,
    card: 0,
    loan: 0,
  });

  const [moneyGivenPeople, setMoneyGivenPeople] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('expense');

  // Load data from Capacitor Preferences
  useEffect(() => {
    const loadData = async () => {
      const { value } = await Preferences.get({ key: 'expenseSavingsData' });
      if (value) {
        try {
          const data = JSON.parse(value);
          setSavingsData(data.savings || {
            mobile: 0,
            cash: 0,
            card: 0,
            loan: 0,
          });
          setMoneyGivenPeople(data.moneyGivenPeople || []);
          setTransactions(data.transactions || []);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      }
    };
    loadData();
  }, []);

  // Save data to Capacitor Preferences
  useEffect(() => {
    const saveData = async () => {
      await Preferences.set({
        key: 'expenseSavingsData',
        value: JSON.stringify({
          savings: savingsData,
          moneyGivenPeople,
          transactions,
        }),
      });
    };
    saveData();
  }, [savingsData, moneyGivenPeople, transactions]);

  const handleAddExpense = (expense) => {
    const newSavingsData = { ...savingsData };
    const selectedSource = expense.source || 'mobile';
    
    newSavingsData[selectedSource] = Math.max(0, newSavingsData[selectedSource] - expense.amount);
    setSavingsData(newSavingsData);

    const newTransaction = {
      id: Date.now(),
      type: 'expense',
      category: expense.category,
      source: selectedSource,
      amount: expense.amount,
      description: expense.description,
      date: new Date().toISOString(),
    };

    setTransactions([newTransaction, ...transactions]);
  };

  const handleAddSavings = (saving) => {
    const newSavingsData = {
      ...savingsData,
      [saving.source]: savingsData[saving.source] + saving.amount,
    };

    setSavingsData(newSavingsData);

    const newTransaction = {
      id: Date.now(),
      type: 'savings',
      source: saving.source,
      amount: saving.amount,
      description: saving.description,
      date: new Date().toISOString(),
    };

    setTransactions([newTransaction, ...transactions]);
  };

  const handleDeleteTransaction = (id) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    if (transaction.type === 'expense') {
      const newSavingsData = { ...savingsData };
      const source = transaction.source || 'mobile';
      newSavingsData[source] = (newSavingsData[source] || 0) + transaction.amount;
      setSavingsData(newSavingsData);
    } else if (transaction.type === 'savings') {
      const newSavingsData = {
        ...savingsData,
        [transaction.source]: savingsData[transaction.source] - transaction.amount,
      };
      setSavingsData(newSavingsData);
    } else if (transaction.type === 'moneyGiven') {
      const newSavingsData = { ...savingsData };
      newSavingsData[transaction.source] = newSavingsData[transaction.source] + transaction.amount;
      setSavingsData(newSavingsData);
    } else if (transaction.type === 'moneyReceived') {
      const newSavingsData = { ...savingsData };
      newSavingsData[transaction.source] = Math.max(0, newSavingsData[transaction.source] - transaction.amount);
      setSavingsData(newSavingsData);
    }

    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleAddNewPerson = (personName) => {
    const newPerson = {
      id: Date.now(),
      name: personName,
    };
    setMoneyGivenPeople([...moneyGivenPeople, newPerson]);
  };

  const handleAddMoneyGiven = (personId, amount, source, description) => {
    const newSavingsData = { ...savingsData };
    newSavingsData[source] = Math.max(0, newSavingsData[source] - amount);
    setSavingsData(newSavingsData);

    const newTransaction = {
      id: Date.now(),
      type: 'moneyGiven',
      personId: personId,
      amount: amount,
      source: source,
      description: description,
      date: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleAddMoneyReceived = (personId, amount, source, description) => {
    const newSavingsData = { ...savingsData };
    newSavingsData[source] = newSavingsData[source] + amount;
    setSavingsData(newSavingsData);

    const newTransaction = {
      id: Date.now(),
      type: 'moneyReceived',
      personId: personId,
      amount: amount,
      source: source,
      description: description,
      date: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const totalSavings = Object.values(savingsData).reduce((a, b) => a + b, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 md:space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
          Remember: Easy money never exist
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 rounded-lg p-3 md:p-4 hover:border-cyan-500/50 transition-colors">
          <p className="text-cyan-400 text-xs md:text-sm font-semibold uppercase tracking-wider">Total Savings</p>
          <p className="text-lg md:text-3xl font-bold text-white mt-1 md:mt-2 break-words">{formatBDT(totalSavings)}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/30 rounded-lg p-3 md:p-4 hover:border-pink-500/50 transition-colors">
          <p className="text-pink-400 text-xs md:text-sm font-semibold uppercase tracking-wider">Total Spent</p>
          <p className="text-lg md:text-3xl font-bold text-white mt-1 md:mt-2 break-words">{formatBDT(totalExpenses)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-lg p-3 md:p-4 hover:border-purple-500/50 transition-colors">
          <p className="text-purple-400 text-xs md:text-sm font-semibold uppercase tracking-wider">Transactions</p>
          <p className="text-lg md:text-3xl font-bold text-white mt-1 md:mt-2">{transactions.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-lg p-3 md:p-4 hover:border-green-500/50 transition-colors">
          <p className="text-green-400 text-xs md:text-sm font-semibold uppercase tracking-wider">Net Balance</p>
          <p className="text-lg md:text-3xl font-bold text-white mt-1 md:mt-2 break-words">{formatBDT(totalSavings - totalExpenses)}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 rounded-lg p-3 md:p-4 hover:border-red-500/50 transition-colors">
          <p className="text-red-400 text-xs md:text-sm font-semibold uppercase tracking-wider">Total Loan</p>
          <p className="text-lg md:text-3xl font-bold text-white mt-1 md:mt-2 break-words">{formatBDT(savingsData.loan)}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Tabs */}
          <div className="flex gap-1 md:gap-2 border-b border-cyan-500/20 overflow-x-auto pb-0">
            <button
              onClick={() => setActiveTab('expense')}
              className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all duration-300 relative whitespace-nowrap ${
                activeTab === 'expense'
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Add Expense
            </button>
            <button
              onClick={() => setActiveTab('moneyGiven')}
              className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all duration-300 relative whitespace-nowrap ${
                activeTab === 'moneyGiven'
                  ? 'text-orange-400 border-b-2 border-orange-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Money Exchanged
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all duration-300 relative whitespace-nowrap ${
                activeTab === 'savings'
                  ? 'text-green-400 border-b-2 border-green-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Saving
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all duration-300 relative whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'text-purple-500 border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold transition-all duration-300 relative whitespace-nowrap ${
                activeTab === 'history'
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              History
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'expense' && (
            <ExpenseForm onAddExpense={handleAddExpense} />
          )}

          {activeTab === 'moneyGiven' && (
            <MoneyGivenForm
              moneyGivenPeople={moneyGivenPeople}
              transactions={transactions}
              onAddPerson={handleAddNewPerson}
              onAddMoneyGiven={handleAddMoneyGiven}
              onAddMoneyReceived={handleAddMoneyReceived}
            />
          )}

          {activeTab === 'savings' && (
            <SavingsManagement onAddSavings={handleAddSavings} savingsData={savingsData} />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel
              transactions={transactions}
              savingsData={savingsData}
              moneyGivenPeople={moneyGivenPeople}
            />
          )}

          {activeTab === 'history' && (
            <TransactionHistory 
              transactions={transactions}
              moneyGivenPeople={moneyGivenPeople}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
        </div>

        {/* Right Column - Savings and Breakdown */}
        <div className="hidden lg:block space-y-6 md:space-y-8">
          <SavingsBalance savingsData={savingsData} />
          <FinancialForecast savingsData={savingsData} />
          <ExpenseBreakdown transactions={transactions} />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 md:pt-12 border-t border-gray-700">
        <p className="text-gray-400 text-sm md:text-base">
          contact: soumik@imsourobh.com
        </p>
      </div>
    </div>
  );
}
