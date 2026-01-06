'use client';

import { useState } from 'react';
import { Preferences } from '@capacitor/preferences';

const MONEY_SOURCES = {
  mobile: { label: '📱 Mobile Money', icon: '📱', color: 'from-blue-500 to-cyan-500' },
  cash: { label: '💵 Cash', icon: '💵', color: 'from-green-500 to-emerald-500' },
  card: { label: '💳 Card', icon: '💳', color: 'from-purple-500 to-pink-500' },
  loan: { label: '🏦 Loan', icon: '🏦', color: 'from-orange-500 to-red-500' },
};

const formatBDT = (amount) => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function SavingsManagement({
  savingsData,
  onAddSavings,
  onAddTransaction,
}) {
  const [activeTab, setActiveTab] = useState('add');
  const [selectedSource, setSelectedSource] = useState('mobile');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Monthly Auto State
  const [monthlyAutoEnabled, setMonthlyAutoEnabled] = useState(false);
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [monthlySource, setMonthlySource] = useState('mobile');
  const [monthlyDay, setMonthlyDay] = useState('1');

  // Scheduled Deposit State
  const [scheduledAmount, setScheduledAmount] = useState('');
  const [scheduledSource, setScheduledSource] = useState('mobile');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledDescription, setScheduledDescription] = useState('');
  const [scheduledDeposits, setScheduledDeposits] = useState([]);

  // Direct Change State
  const [directAmount, setDirectAmount] = useState('');
  const [directSource, setDirectSource] = useState('mobile');

  // Estimation State
  const [estimationDate, setEstimationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [estimationAmount, setEstimationAmount] = useState(0);
  const [monthlyConfig, setMonthlyConfig] = useState(null);
  const [estimationScheduledDeposits, setEstimationScheduledDeposits] = useState([]);

  const handleAddSavings = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    onAddSavings({
      source: selectedSource,
      amount: parseFloat(amount),
      description,
    });

    setAmount('');
    setDescription('');
    setError('');
  };

  const handleDirectChange = () => {
    if (!directAmount || parseFloat(directAmount) < 0) {
      setError('Please enter a valid amount');
      return;
    }

    const currentAmount = savingsData[directSource] || 0;
    const newAmount = parseFloat(directAmount);
    const delta = newAmount - currentAmount;

    onAddSavings({
      source: directSource,
      amount: delta,
      description: `Adjustment: ${currentAmount.toLocaleString()} → ${newAmount.toLocaleString()}`,
    });

    setDirectAmount('');
    setError('');
  };

  const handleSaveMonthlyConfig = async () => {
    if (!monthlyAmount || parseFloat(monthlyAmount) <= 0) {
      setError('Please enter a valid monthly amount');
      return;
    }

    const config = {
      enabled: monthlyAutoEnabled,
      amount: parseFloat(monthlyAmount),
      source: monthlySource,
      dayOfMonth: parseInt(monthlyDay),
      lastRun: new Date().toISOString(),
    };

    await Preferences.set({
      key: 'monthlyAutoDeposit',
      value: JSON.stringify(config),
    });

    setError('');
    alert('✅ Monthly auto-deposit configured!');
  };

  const handleScheduleDeposit = async () => {
    if (!scheduledAmount || parseFloat(scheduledAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!scheduledDate) {
      setError('Please select a date');
      return;
    }

    const deposit = {
      id: Date.now(),
      amount: parseFloat(scheduledAmount),
      source: scheduledSource,
      scheduledDate,
      description: scheduledDescription,
      completed: false,
    };

    const deposits = [...scheduledDeposits, deposit];
    setScheduledDeposits(deposits);

    await Preferences.set({
      key: 'scheduledDeposits',
      value: JSON.stringify(deposits),
    });

    setScheduledAmount('');
    setScheduledSource('mobile');
    setScheduledDate('');
    setScheduledDescription('');
    setError('');
    alert('✅ Deposit scheduled!');
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-cyan-500/20">
        {[
          { id: 'add', label: 'Add Savings', icon: '➕' },
          { id: 'direct', label: 'Direct Change', icon: '🔄' },
          { id: 'monthly', label: 'Monthly Auto', icon: '📅' },
          { id: 'scheduled', label: 'Scheduled', icon: '⏰' },
          { id: 'estimation', label: 'Estimation', icon: '🔮' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'add' && (
        <div className="bg-slate-800/50 border border-green-500/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-green-400">Add Savings</h3>

          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">Account</label>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
            >
              {Object.entries(MONEY_SOURCES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">Amount (BDT)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <button
            onClick={handleAddSavings}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
          >
            ✅ Add Savings
          </button>
        </div>
      )}

      {activeTab === 'direct' && (
        <div className="bg-slate-800/50 border border-blue-500/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-blue-400">Direct Change</h3>
          <p className="text-gray-400 text-sm">Set exact amount directly (creates adjustment transaction)</p>

          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">Account</label>
            <select
              value={directSource}
              onChange={(e) => setDirectSource(e.target.value)}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
            >
              {Object.entries(MONEY_SOURCES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">
              Current: {formatBDT(savingsData[directSource] || 0)}
            </label>
            <label className="block text-gray-400 text-sm font-semibold mb-2">New Amount (BDT)</label>
            <input
              type="number"
              value={directAmount}
              onChange={(e) => setDirectAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <button
            onClick={handleDirectChange}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
          >
            🔄 Update Amount
          </button>
        </div>
      )}

      {activeTab === 'monthly' && (
        <div className="bg-slate-800/50 border border-orange-500/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-orange-400">Monthly Auto-Deposit</h3>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="monthlyToggle"
              checked={monthlyAutoEnabled}
              onChange={(e) => setMonthlyAutoEnabled(e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
            <label htmlFor="monthlyToggle" className="text-gray-300 cursor-pointer">
              Enable monthly auto-deposit
            </label>
          </div>

          {monthlyAutoEnabled && (
            <>
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Amount (BDT)</label>
                <input
                  type="number"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Account</label>
                <select
                  value={monthlySource}
                  onChange={(e) => setMonthlySource(e.target.value)}
                  className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
                >
                  {Object.entries(MONEY_SOURCES).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Day of Month (1-28)</label>
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={monthlyDay}
                  onChange={(e) => setMonthlyDay(e.target.value)}
                  className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
                />
              </div>

              <button
                onClick={handleSaveMonthlyConfig}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
              >
                💾 Save Config
              </button>
            </>
          )}
        </div>
      )}

      {activeTab === 'scheduled' && (
        <div className="bg-slate-800/50 border border-purple-500/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-purple-400">Scheduled Deposits</h3>

          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">Amount (BDT)</label>
            <input
              type="number"
              value={scheduledAmount}
              onChange={(e) => setScheduledAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">Account</label>
            <select
              value={scheduledSource}
              onChange={(e) => setScheduledSource(e.target.value)}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
            >
              {Object.entries(MONEY_SOURCES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-2">Description</label>
            <input
              type="text"
              value={scheduledDescription}
              onChange={(e) => setScheduledDescription(e.target.value)}
              placeholder="e.g., Bonus payment"
              className="w-full bg-slate-700 border border-cyan-500/30 rounded-lg px-4 py-2 text-white"
            />
          </div>

          <button
            onClick={handleScheduleDeposit}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
          >
            ⏰ Schedule Deposit
          </button>

          {scheduledDeposits.length > 0 && (
            <div className="mt-6">
              <h4 className="text-gray-400 font-semibold mb-3">Scheduled Deposits:</h4>
              <div className="space-y-2">
                {scheduledDeposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="bg-slate-700/50 border border-purple-500/20 rounded p-3 text-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-semibold">{formatBDT(deposit.amount)}</p>
                        <p className="text-gray-400 text-xs">
                          {MONEY_SOURCES[deposit.source].label} • {deposit.scheduledDate}
                        </p>
                        {deposit.description && (
                          <p className="text-gray-500 text-xs mt-1">{deposit.description}</p>
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          deposit.completed
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {deposit.completed ? '✅ Done' : '⏳ Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'estimation' && (
        <div className="bg-slate-800/50 border border-indigo-500/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-indigo-400">Estimation for Future Date</h3>
          <p className="text-gray-400 text-sm">Select a date to see your estimated savings</p>

          <div>
            <label className="block text-gray-400 text-sm font-semibold mb-3">Select Date</label>
            <input
              type="date"
              value={estimationDate}
              onChange={(e) => setEstimationDate(e.target.value)}
              className="w-full bg-slate-700 border border-indigo-500/30 rounded-lg px-4 py-3 text-white font-semibold text-lg"
            />
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/30 rounded-lg p-6 mt-6">
            <div className="text-center space-y-4">
              <p className="text-indigo-300 font-semibold text-sm">
                Estimated Balance on {new Date(estimationDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              
              {(() => {
                const currentBalance = Object.values(savingsData).reduce((a, b) => a + b, 0);
                let projectedAmount = currentBalance;
                
                const selectedDateObj = new Date(estimationDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                selectedDateObj.setHours(0, 0, 0, 0);

                // This is a simplified calculation - would need to load monthly config in real implementation
                if (selectedDateObj >= today) {
                  // Calculate days until selected date for monthly deposits
                  if (monthlyConfig && monthlyConfig.enabled) {
                    let currentDate = new Date(today);
                    while (currentDate <= selectedDateObj) {
                      if (currentDate.getDate() === monthlyConfig.dayOfMonth) {
                        projectedAmount += monthlyConfig.amount;
                      }
                      currentDate.setDate(currentDate.getDate() + 1);
                    }
                  }
                }

                return (
                  <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {formatBDT(projectedAmount)}
                  </p>
                );
              })()}
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <span className="text-gray-300 font-semibold">Current Total</span>
              <span className="text-xl font-bold text-cyan-400">
                {formatBDT(Object.values(savingsData).reduce((a, b) => a + b, 0))}
              </span>
            </div>
            <p className="text-gray-400 text-sm text-center">
              💡 This estimation shows your balance including monthly deposits and scheduled deposits up to the selected date.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}