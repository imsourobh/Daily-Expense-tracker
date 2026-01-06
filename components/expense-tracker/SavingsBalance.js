'use client';

const SAVINGS_SOURCES = {
  mobile: { label: 'Mobile Money', icon: '📱', color: '#06B6D4', bgColor: 'from-blue-500 to-cyan-500' },
  cash: { label: 'Cash', icon: '💵', color: '#10B981', bgColor: 'from-green-500 to-emerald-500' },
  card: { label: 'Card', icon: '💳', color: '#A78BFA', bgColor: 'from-purple-500 to-pink-500' },
  loan: { label: 'Loan', icon: '🏦', color: '#EF4444', bgColor: 'from-red-500 to-orange-500' },
};

const formatBDT = (amount) => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Pie Chart Component
function PieChart({ savingsData }) {
  const total = Object.values(savingsData).reduce((a, b) => a + b, 0);
  
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        No data to display
      </div>
    );
  }

  // Calculate pie slices
  let currentAngle = -90; // Start from top
  const slices = [];

  Object.entries(SAVINGS_SOURCES).forEach(([key, config]) => {
    const amount = savingsData[key] || 0;
    const percentage = (amount / total) * 100;
    const sliceAngle = (percentage / 100) * 360;

    slices.push({
      key,
      amount,
      percentage,
      color: config.color,
      label: config.label,
      startAngle: currentAngle,
      endAngle: currentAngle + sliceAngle,
    });

    currentAngle += sliceAngle;
  });

  // Convert angle to SVG path
  const angleToRadian = (angle) => (angle * Math.PI) / 180;
  const polarToCartesian = (centerX, centerY, radius, angle) => {
    const radian = angleToRadian(angle);
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian),
    };
  };

  const describePie = (startAngle, endAngle, radius = 120) => {
    const centerX = 150;
    const centerY = 150;

    const start = polarToCartesian(centerX, centerY, radius, endAngle);
    const end = polarToCartesian(centerX, centerY, radius, startAngle);

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${centerX} ${centerY}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        className="drop-shadow-lg"
      >
        {slices.map((slice) => (
          <path
            key={slice.key}
            d={describePie(slice.startAngle, slice.endAngle)}
            fill={slice.color}
            stroke="#1e293b"
            strokeWidth="2"
            opacity="0.8"
            className="hover:opacity-100 transition-opacity"
          />
        ))}
        {/* Center circle for donut effect */}
        <circle cx="150" cy="150" r="70" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <text
          x="150"
          y="150"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-white font-bold text-sm"
          fontSize="14"
        >
          Total
        </text>
        <text
          x="150"
          y="170"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-cyan-400 font-bold"
          fontSize="12"
        >
          {formatBDT(total)}
        </text>
      </svg>

      {/* Legend */}
      <div className="w-full grid grid-cols-2 gap-3">
        {slices.map((slice) => (
          <div key={slice.key} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: slice.color }}
            ></div>
            <div className="flex-1">
              <p className="text-gray-300 text-xs">{slice.label}</p>
              <p className="text-white font-semibold">{slice.percentage.toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SavingsBalance({ savingsData }) {
  const total = Object.values(savingsData).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
          <span>📊</span> Money Breakdown
        </h3>

        {/* Pie Chart */}
        <PieChart savingsData={savingsData} />
      </div>

      {/* Detailed List */}
      <div className="border-t border-purple-500/20 pt-6">
        <h4 className="text-lg font-semibold text-purple-300 mb-4">Account Details</h4>
        <div className="space-y-3">
          {Object.entries(SAVINGS_SOURCES).map(([key, { label, icon, bgColor }]) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-gray-300 font-semibold">{label}</span>
                </div>
                <span className="text-xl font-bold text-white">{formatBDT(savingsData[key] || 0)}</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${bgColor} transition-all duration-500`}
                  style={{ width: `${Math.min((savingsData[key] / Math.max(total, 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}

          {/* Total Savings */}
          <div className="mt-6 pt-6 border-t border-cyan-500/20">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-cyan-400">Total Balance</span>
              <span className="text-2xl font-bold text-white">{formatBDT(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
