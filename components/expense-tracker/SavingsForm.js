'use client';

import { useState } from 'react';

const SAVINGS_SOURCES = {
  mobile: { label: '📱 Mobile Money', icon: '📲' },
  cash: { label: '💵 Cash', icon: '💸' },
  card: { label: '💳 Card', icon: '🏦' },
  moneyGiven: { label: '🤝 Money Given', icon: '👤' },
};

export default function SavingsForm({ onAddSavings, savingsData }) {
  const [formData, setFormData] = useState({
    source: 'mobile',
    amount: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.source) {
      newErrors.source = 'Please select a source';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onAddSavings({
      source: formData.source,
      amount: parseFloat(formData.amount),
      description: formData.description,
    });

    setFormData({
      source: 'mobile',
      amount: '',
      description: '',
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors">
      <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
        <span>💰</span> Add Savings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Source Selection */}
        <div>
          <label className="block text-gray-300 font-semibold mb-3">Select Source</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(SAVINGS_SOURCES).map(([key, { label, icon }]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, source: key }));
                  setErrors(prev => ({ ...prev, source: '' }));
                }}
                className={`p-3 rounded-lg border-2 transition-all duration-300 text-left font-semibold ${
                  formData.source === key
                    ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                    : 'border-purple-500/20 bg-slate-800/50 text-gray-300 hover:border-purple-500/40'
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-xs block mt-1">{label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
          {errors.source && <p className="text-red-400 text-sm mt-2">{errors.source}</p>}
        </div>

        {/* Current Balance Display */}
        <div className="bg-slate-800/50 rounded-lg p-3 border border-purple-500/20">
          <p className="text-gray-400 text-sm">Current Balance in {SAVINGS_SOURCES[formData.source].label}</p>
          <p className="text-2xl font-bold text-purple-300">
            ৳{(savingsData[formData.source] || 0).toFixed(0)}
          </p>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2">Amount (৳)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount to add"
            step="0.01"
            min="0"
            className={`w-full bg-slate-800 border-2 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
              errors.amount
                ? 'border-red-500 focus:border-red-400'
                : 'border-purple-500/30 focus:border-purple-400'
            }`}
          />
          {errors.amount && <p className="text-red-400 text-sm mt-2">{errors.amount}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2">Description (Optional)</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Where did this money come from?"
            className="w-full bg-slate-800 border-2 border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-colors"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-black font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:shadow-xl"
        >
          ➕ Add Savings
        </button>
      </form>
    </div>
  );
}
