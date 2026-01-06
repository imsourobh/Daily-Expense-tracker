'use client';

import { useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

const formatBDT = (amount) => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function FinancialForecast({ savingsData }) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [forecastAmount, setForecastAmount] = useState(0);
  const [monthlyConfig, setMonthlyConfig] = useState(null);
  const [scheduledDeposits, setScheduledDeposits] = useState([]);

  // Load configurations on mount
  useEffect(() => {
    const loadConfigs = async () => {
      try {
        const monthlyValue = await Preferences.get({
          key: 'monthlyAutoDeposit',
        });
        if (monthlyValue.value) {
          setMonthlyConfig(JSON.parse(monthlyValue.value));
        }

        const scheduledValue = await Preferences.get({
          key: 'scheduledDeposits',
        });
        if (scheduledValue.value) {
          setScheduledDeposits(JSON.parse(scheduledValue.value));
        }
      } catch (error) {
        console.error('Error loading configs:', error);
      }
    };
    loadConfigs();
  }, []);

  // Calculate forecast amount
  useEffect(() => {
    const calculateForecast = () => {
      const totalBalance = Object.values(savingsData).reduce((a, b) => a + b, 0);
      let projectedAmount = totalBalance;

      const selectedDateObj = new Date(selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDateObj.setHours(0, 0, 0, 0);

      if (selectedDateObj >= today) {
        // Add scheduled deposits up to selected date
        scheduledDeposits.forEach((deposit) => {
          const depositDate = new Date(deposit.scheduledDate);
          depositDate.setHours(0, 0, 0, 0);

          if (depositDate <= selectedDateObj && !deposit.completed) {
            projectedAmount += deposit.amount;
          }
        });

        // Add monthly deposits
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

      setForecastAmount(projectedAmount);
    };

    calculateForecast();
  }, [selectedDate, savingsData, monthlyConfig, scheduledDeposits]);

  // Get breakdown of deposits
  const getDepositBreakdown = () => {
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDateObj.setHours(0, 0, 0, 0);

    let breakdown = {
      currentBalance: Object.values(savingsData).reduce((a, b) => a + b, 0),
      monthlyDeposits: 0,
      scheduledDeposits: 0,
      count: {
        monthly: 0,
        scheduled: 0,
      },
    };

    if (selectedDateObj >= today) {
      // Count scheduled deposits
      scheduledDeposits.forEach((deposit) => {
        const depositDate = new Date(deposit.scheduledDate);
        depositDate.setHours(0, 0, 0, 0);

        if (depositDate <= selectedDateObj && !deposit.completed) {
          breakdown.scheduledDeposits += deposit.amount;
          breakdown.count.scheduled += 1;
        }
      });

      // Count monthly deposits
      if (monthlyConfig && monthlyConfig.enabled) {
        let currentDate = new Date(today);
        while (currentDate <= selectedDateObj) {
          if (currentDate.getDate() === monthlyConfig.dayOfMonth) {
            breakdown.monthlyDeposits += monthlyConfig.amount;
            breakdown.count.monthly += 1;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }

    return breakdown;
  };

  const breakdown = getDepositBreakdown();
  const isToday =
    selectedDate === new Date().toISOString().split('T')[0];
  const isFuture = new Date(selectedDate) > new Date();

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors space-y-6">
      <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
        <span>📅</span> Financial Forecast
      </h3>

      {/* Date Picker */}
      <div>
        <label className="block text-gray-300 font-semibold mb-3">
          Select Date to Check Balance
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full bg-slate-700 border border-purple-500/30 rounded-lg px-4 py-3 text-white font-semibold text-lg focus:outline-none focus:border-purple-500/60"
        />
      </div>

      {/* Forecast Display */}
      <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-lg p-6">
        <div className="text-center space-y-4">
          <p className="text-purple-300 font-semibold text-sm">
            {isToday
              ? "Today's Balance"
              : isFuture
              ? 'Projected Balance on:'
              : 'Balance on:'}
          </p>
          <p className="text-gray-400 text-lg mb-4">
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {formatBDT(forecastAmount)}
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-purple-300">Breakdown:</h4>

        {/* Current Balance */}
        <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
          <div>
            <p className="text-gray-300 font-semibold">Current Balance</p>
            <p className="text-xs text-gray-500">All accounts combined</p>
          </div>
          <p className="text-xl font-bold text-cyan-400">
            {formatBDT(breakdown.currentBalance)}
          </p>
        </div>

        {/* Monthly Deposits */}
        {monthlyConfig && monthlyConfig.enabled && breakdown.count.monthly > 0 && (
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-green-500/20">
            <div>
              <p className="text-green-400 font-semibold">Monthly Deposits</p>
              <p className="text-xs text-gray-500">
                {breakdown.count.monthly} deposit{breakdown.count.monthly > 1 ? 's' : ''}
              </p>
            </div>
            <p className="text-xl font-bold text-green-400">
              +{formatBDT(breakdown.monthlyDeposits)}
            </p>
          </div>
        )}

        {/* Scheduled Deposits */}
        {breakdown.count.scheduled > 0 && (
          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-orange-500/20">
            <div>
              <p className="text-orange-400 font-semibold">Scheduled Deposits</p>
              <p className="text-xs text-gray-500">
                {breakdown.count.scheduled} deposit{breakdown.count.scheduled > 1 ? 's' : ''}
              </p>
            </div>
            <p className="text-xl font-bold text-orange-400">
              +{formatBDT(breakdown.scheduledDeposits)}
            </p>
          </div>
        )}

        {/* No Future Deposits */}
        {breakdown.count.monthly === 0 &&
          breakdown.count.scheduled === 0 &&
          isFuture && (
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div>
                <p className="text-gray-300 font-semibold">No Deposits Scheduled</p>
                <p className="text-xs text-gray-500">
                  No monthly or scheduled deposits on this date
                </p>
              </div>
              <p className="text-lg text-gray-400">+৳0</p>
            </div>
          )}
      </div>

      {/* Summary Info */}
      <div className="bg-slate-700/20 border border-slate-600/30 rounded-lg p-4">
        <p className="text-gray-400 text-sm">
          💡 <strong>How it works:</strong> This forecast adds your current balance
          with all monthly auto-deposits and scheduled deposits up to the selected
          date. Use it to plan future expenses or savings goals.
        </p>
      </div>

      {/* Note about past dates */}
      {!isFuture && !isToday && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            📌 <strong>Note:</strong> This shows the balance as of that date based on
            current data. Actual balance may have been different due to expenses not
            shown here.
          </p>
        </div>
      )}
    </div>
  );
}
