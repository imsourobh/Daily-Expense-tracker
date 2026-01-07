import './globals.css'

export const metadata = {
  title: 'Expense & Savings Tracker',
  description: 'Manage your daily expenses and track your savings with our comprehensive tracker app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        {children}
      </body>
    </html>
  )
}
