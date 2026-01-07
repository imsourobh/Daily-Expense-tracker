'use client';

import ExpenseSavingsTracker from '@/components/expense-tracker/ExpenseSavingsTracker';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-4 md:py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <ExpenseSavingsTracker />
      </div>
    </main>
  )
}
