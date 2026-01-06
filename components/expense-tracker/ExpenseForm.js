'use client';

import { useState } from 'react';

const EXPENSE_CATEGORIES = {
  food: { label: '🍽️ Food & Cloth', icon: '👕' },
  entertainment: { label: '🎮 Entertainment', icon: '🎬' },
  vehicle: { label: '🚗 Vehicle', icon: '⛽' },
  extra: { label: '✨ Extra', icon: '🎁' },
};

const EXPENSE_SOURCES = {
  mobile: { label: '📱 Mobile Money', color: 'from-blue-500 to-cyan-500' },
  cash: { label: '💵 Cash', color: 'from-green-500 to-emerald-500' },
  card: { label: '💳 Card', color: 'from-purple-500 to-pink-500' },
  loan: { label: '🏦 Loan', color: 'from-red-500 to-orange-500' },
};

export default function ExpenseForm({ onAddExpense }) {
  const [formData, setFormData] = useState({
    category: 'food',
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
    if (!formData.category) {
      newErrors.category = 'Please select a category';
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

    onAddExpense({
      category: formData.category,
      source: formData.source,
      amount: parseFloat(formData.amount),
      description: formData.description,
    });

    setFormData({
      category: 'food',
      source: 'mobile',
      amount: '',
      description: '',
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/20 rounded-xl p-6 hover:border-cyan-500/40 transition-colors">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
        <span>💸</span> Add Expense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Category Selection */}
        <div>
          <label className="block text-gray-300 font-semibold mb-3">Select Category</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(EXPENSE_CATEGORIES).map(([key, { label, icon }]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, category: key }));
                  setErrors(prev => ({ ...prev, category: '' }));
                }}
                className={`p-3 rounded-lg border-2 transition-all duration-300 text-left font-semibold ${
                  formData.category === key
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                    : 'border-cyan-500/20 bg-slate-800/50 text-gray-300 hover:border-cyan-500/40'
                }`}
              >
                <span className="text-lg">{icon}</span>
                <span className="text-xs block mt-1">{label}</span>
              </button>
            ))}
          </div>
          {errors.category && <p className="text-red-400 text-sm mt-2">{errors.category}</p>}
        </div>

        {/* Source Selection */}
        <div>
          <label className="block text-gray-300 font-semibold mb-3">Pay From</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(EXPENSE_SOURCES).map(([key, { label }]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, source: key }));
                  setErrors(prev => ({ ...prev, source: '' }));
                }}
                className={`p-3 rounded-lg border-2 transition-all duration-300 text-left font-semibold ${
                  formData.source === key
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                    : 'border-cyan-500/20 bg-slate-800/50 text-gray-300 hover:border-cyan-500/40'
                }`}
              >
                <span className="text-lg">{label.split(' ')[0]}</span>
                <span className="text-xs block mt-1">{label.split(' ')[1]}</span>
              </button>
            ))}
          </div>
          {errors.source && <p className="text-red-400 text-sm mt-2">{errors.source}</p>}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-gray-300 font-semibold mb-2">Amount (৳)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            step="0.01"
            min="0"
            className={`w-full bg-slate-800 border-2 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors ${
              errors.amount
                ? 'border-red-500 focus:border-red-400'
                : 'border-cyan-500/30 focus:border-cyan-400'
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
            placeholder="What did you spend on?"
            className="w-full bg-slate-800 border-2 border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 hover:shadow-xl"
        >
          ➕ Add Expense
        </button>
      </form>
    </div>
  );
}
