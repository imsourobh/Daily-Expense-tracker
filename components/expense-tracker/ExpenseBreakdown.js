'use client';

const EXPENSE_CATEGORIES = {
  food: { label: 'Food & Cloth', icon: '🍽️', color: 'from-orange-500 to-red-500' },
  entertainment: { label: 'Entertainment', icon: '🎮', color: 'from-pink-500 to-purple-500' },
  vehicle: { label: 'Vehicle', icon: '🚗', color: 'from-blue-500 to-cyan-500' },
  extra: { label: 'Extra', icon: '✨', color: 'from-yellow-500 to-orange-500' },
};

const formatBDT = (amount) => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ExpenseBreakdown({ transactions }) {
  const expenses = transactions.filter(t => t.type === 'expense');

  const breakdown = Object.keys(EXPENSE_CATEGORIES).reduce((acc, category) => {
    acc[category] = expenses
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
    return acc;
  }, {});

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-pink-500/20 rounded-xl p-6 hover:border-pink-500/40 transition-colors">
      <h3 className="text-2xl font-bold text-pink-400 mb-6 flex items-center gap-2">
        <span>📊</span> Expense Breakdown
      </h3>

      <div className="space-y-4">
        {Object.entries(EXPENSE_CATEGORIES).map(([key, { label, icon, color }]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{icon}</span>
                <span className="text-gray-300 font-semibold text-sm">{label}</span>
              </div>
              <span className="text-lg font-bold text-white">{formatBDT(breakdown[key])}</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
                style={{ width: `${Math.min((breakdown[key] / Math.max(total, 1)) * 100, 100)}%` }}
              ></div>
            </div>
            {/* Percentage */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{expenses.filter(t => t.category === key).length} transactions</span>
              <span>{total > 0 ? ((breakdown[key] / total) * 100).toFixed(1) : 0}%</span>
            </div>
          </div>
        ))}

        {/* Total Expenses */}
        <div className="mt-6 pt-6 border-t border-pink-500/20">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-semibold">Total Expenses</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
              {formatBDT(total)}
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        {expenses.length > 0 && (
          <div className="mt-4 pt-4 border-t border-pink-500/20">
            <p className="text-gray-400 text-sm font-semibold mb-3">Statistics</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-400">
                <span>Total Transactions</span>
                <span className="font-semibold text-pink-400">{expenses.length}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Average Transaction</span>
                <span className="font-semibold text-pink-400">
                  {formatBDT(total / expenses.length)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Highest Category</span>
                <span className="font-semibold text-pink-400">
                  {Object.entries(breakdown).sort(([, a], [, b]) => b - a)[0]
                    ? EXPENSE_CATEGORIES[
                        Object.entries(breakdown).sort(([, a], [, b]) => b - a)[0][0]
                      ]?.label || 'N/A'
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
