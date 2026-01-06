'use client';

import { useState } from 'react';

const MONEY_SOURCES = {
  mobile: { label: '📱 Mobile Money', icon: '📱', color: 'from-blue-500 to-cyan-500' },
  cash: { label: '💵 Cash', icon: '💵', color: 'from-green-500 to-emerald-500' },
  card: { label: '💳 Card', icon: '💳', color: 'from-purple-500 to-pink-500' },
};

const formatBDT = (amount) => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function MoneyGivenForm({ 
  moneyGivenPeople, 
  transactions,
  onAddPerson, 
  onAddMoneyGiven,
  onAddMoneyReceived
}) {
  const [selectedPersonId, setSelectedPersonId] = useState(null);
  const [newPersonName, setNewPersonName] = useState('');
  const [showNewPerson, setShowNewPerson] = useState(false);
  
  const [givenAmount, setGivenAmount] = useState('');
  const [givenSource, setGivenSource] = useState('mobile');
  const [givenDescription, setGivenDescription] = useState('');
  
  const [receivedAmount, setReceivedAmount] = useState('');
  const [receivedSource, setReceivedSource] = useState('mobile');
  const [receivedDescription, setReceivedDescription] = useState('');
  
  const [error, setError] = useState('');

  const handleAddNewPerson = () => {
    if (!newPersonName.trim()) {
      setError('Please enter a person name');
      return;
    }
    onAddPerson(newPersonName);
    setNewPersonName('');
    setShowNewPerson(false);
    setError('');
  };

  const handleAddMoneyGiven = () => {
    if (!selectedPersonId) {
      setError('Please select a person');
      return;
    }
    if (!givenAmount || parseFloat(givenAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const person = moneyGivenPeople.find(p => p.id === selectedPersonId);
    onAddMoneyGiven(person.id, parseFloat(givenAmount), givenSource, givenDescription);
    setGivenAmount('');
    setGivenSource('mobile');
    setGivenDescription('');
    setError('');
  };

  const handleAddMoneyReceived = () => {
    if (!selectedPersonId) {
      setError('Please select a person');
      return;
    }
    if (!receivedAmount || parseFloat(receivedAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const person = moneyGivenPeople.find(p => p.id === selectedPersonId);
    onAddMoneyReceived(person.id, parseFloat(receivedAmount), receivedSource, receivedDescription);
    setReceivedAmount('');
    setReceivedSource('mobile');
    setReceivedDescription('');
    setError('');
  };

  const selectedPerson = moneyGivenPeople.find(p => p.id === selectedPersonId);
  
  const personTransactions = selectedPersonId 
    ? transactions.filter(t => t.personId === selectedPersonId && (t.type === 'moneyGiven' || t.type === 'moneyReceived'))
    : [];

  const moneyGivenTotal = personTransactions
    .filter(t => t.type === 'moneyGiven')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const moneyReceivedTotal = personTransactions
    .filter(t => t.type === 'moneyReceived')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = moneyGivenTotal - moneyReceivedTotal;

  return (
    <div className="space-y-6">
      {/* Person Selection */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-orange-500/20 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-2">
          <span>🤝</span> Money Given / Received
        </h3>

        <div className="space-y-3">
          <label className="text-gray-400 text-sm font-semibold">Select Person</label>
          <div className="flex gap-2">
            <select
              value={selectedPersonId || ''}
              onChange={(e) => {
                setSelectedPersonId(e.target.value ? parseInt(e.target.value) : null);
                setError('');
              }}
              className="flex-1 bg-slate-700 border-2 border-orange-500/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-400 transition-colors"
            >
              <option value="">Choose a person...</option>
              {moneyGivenPeople.map(person => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowNewPerson(!showNewPerson)}
              className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg font-semibold transition-colors"
            >
              +
            </button>
          </div>

          {showNewPerson && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                placeholder="Person name"
                className="flex-1 bg-slate-700 border-2 border-orange-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-400 transition-colors"
              />
              <button
                onClick={handleAddNewPerson}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-semibold transition-colors"
              >
                Add
              </button>
            </div>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>

      {selectedPerson && (
        <>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-green-500/20 rounded-xl p-6">
            <h4 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span>💸</span> Give Money to {selectedPerson.name}
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm font-semibold">Amount</label>
                <input
                  type="number"
                  value={givenAmount}
                  onChange={(e) => {
                    setGivenAmount(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter amount"
                  className="w-full bg-slate-700 border-2 border-green-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-semibold">From Source</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(MONEY_SOURCES).map(([key, { label }]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setGivenSource(key);
                        setError('');
                      }}
                      className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                        givenSource === key
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-700 text-gray-300 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-semibold">Description (optional)</label>
                <input
                  type="text"
                  value={givenDescription}
                  onChange={(e) => setGivenDescription(e.target.value)}
                  placeholder="What for?"
                  className="w-full bg-slate-700 border-2 border-green-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 transition-colors"
                />
              </div>

              <button
                onClick={handleAddMoneyGiven}
                className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all"
              >
                Add Money Given
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-blue-500/20 rounded-xl p-6">
            <h4 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span>💰</span> Money Received from {selectedPerson.name}
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm font-semibold">Amount</label>
                <input
                  type="number"
                  value={receivedAmount}
                  onChange={(e) => {
                    setReceivedAmount(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter amount"
                  className="w-full bg-slate-700 border-2 border-blue-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-semibold">Received To</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(MONEY_SOURCES).map(([key, { label }]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setReceivedSource(key);
                        setError('');
                      }}
                      className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                        receivedSource === key
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-700 text-gray-300 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-semibold">Description (optional)</label>
                <input
                  type="text"
                  value={receivedDescription}
                  onChange={(e) => setReceivedDescription(e.target.value)}
                  placeholder="What for?"
                  className="w-full bg-slate-700 border-2 border-blue-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 transition-colors"
                />
              </div>

              <button
                onClick={handleAddMoneyReceived}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-lg transition-all"
              >
                Add Money Received
              </button>
            </div>
          </div>

          {personTransactions.length > 0 && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/20 rounded-xl p-6">
              <h4 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                <span>📋</span> Transaction History with {selectedPerson.name}
              </h4>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <p className="text-green-400 text-xs font-semibold uppercase">Given</p>
                  <p className="text-xl font-bold text-white mt-1">{formatBDT(moneyGivenTotal)}</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-xs font-semibold uppercase">Received</p>
                  <p className="text-xl font-bold text-white mt-1">{formatBDT(moneyReceivedTotal)}</p>
                </div>
                <div className={`${balance > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'} border rounded-lg p-3`}>
                  <p className={`${balance > 0 ? 'text-red-400' : 'text-green-400'} text-xs font-semibold uppercase`}>
                    {balance > 0 ? 'You Owe' : 'Owed to You'}
                  </p>
                  <p className={`text-xl font-bold mt-1 ${balance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {formatBDT(Math.abs(balance))}
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {personTransactions.map(transaction => (
                  <div key={transaction.id} className="bg-slate-700/50 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-white font-semibold">
                        {transaction.type === 'moneyGiven' ? '💸 Gave' : '💰 Received'}
                      </p>
                      {transaction.description && (
                        <p className="text-gray-400 text-sm">{transaction.description}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(transaction.date).toLocaleDateString()} • {MONEY_SOURCES[transaction.source]?.label}
                      </p>
                    </div>
                    <p className={`text-lg font-bold ${transaction.type === 'moneyGiven' ? 'text-red-400' : 'text-green-400'}`}>
                      {transaction.type === 'moneyGiven' ? '−' : '+'} {formatBDT(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {personTransactions.length === 0 && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-purple-500/20 rounded-xl p-6 text-center">
              <p className="text-gray-400">No transactions with {selectedPerson.name} yet</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
