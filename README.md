# 💰 Expense & Savings Tracker Website

A complete, standalone Next.js web application for managing your daily expenses, tracking savings across multiple accounts, and keeping track of money given to people.

**🚀 Live & Ready to Deploy!**

## ✨ Features

### 💸 Expense Tracking
- Add daily expenses with categories (Food, Entertainment, Vehicle, Extra)
- Select payment source (Mobile Money, Cash, Card)
- Add optional descriptions for every expense
- Automatic balance deduction from selected source

### 💰 Savings Management
- Track savings across 3 different sources:
  - 📱 Mobile Money (bKash, Nagad, Rocket, etc.)
  - 💵 Cash (Physical money)
  - 💳 Card (Bank accounts)
- View current balance for each source
- Add optional descriptions
- Progress bars showing savings distribution

### 🤝 Money Given / Received
- Create a list of people you've lent money to
- Record money given with source selection
- Record money received back
- Automatic balance calculations
- View complete transaction history per person
- Shows "You Owe" vs "Owed to You" balance

### 📊 Transaction History
- View all transactions with detailed information
- Filter by type (All, Expenses, Savings, Money Given, Money Received)
- Shows transaction date, amount, source, and description
- Delete transactions with automatic balance reversal
- Hover to delete - smooth UX

### 🎯 Summary Dashboard
- Total Savings across all sources
- Total Expenses by category
- Transaction Count
- Net Balance (Savings - Expenses)
- Real-time updates

### 💾 Data Persistence
- All data saved to browser localStorage
- Automatic saving on every transaction
- No internet required after loading
- Complete data privacy - no cloud sync

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14.2+ | React framework |
| **React** | 18 | UI library |
| **Tailwind CSS** | 3.4+ | Styling |
| **JavaScript** | ES6+ | Logic |

## 📦 Installation

### Prerequisites
- Node.js 16+ or higher
- npm or yarn

### Quick Start

```bash
# 1. Clone or download the project
cd ExpenseTrackerWebsite

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# Navigate to http://localhost:3000
```

## 🚀 Usage

### Add Expense
1. Click "Add Expense" tab
2. Select expense category
3. Choose payment source
4. Enter amount (in Bangladeshi Taka - ৳)
5. Add optional description
6. Click "Add Expense"

### Add Savings
1. Click "Add Savings" tab
2. Select source (Mobile, Cash, or Card)
3. View current balance
4. Enter amount to add
5. Add optional description (where money came from)
6. Click "Add Savings"

### Track Money Given
1. Click "Money Given" tab
2. Click "+" to add a new person (or select existing)
3. Enter person's name
4. Select person from dropdown
5. Choose amount and source
6. Click "Add Money Given"
7. View transaction history with person

### View History
1. Click "History" tab
2. Use filter buttons to view specific transaction types
3. Hover over transaction to delete
4. Click "Delete" to remove (balance auto-reverses)

## 📊 Dashboard Components

### Summary Cards
- **Total Savings**: Sum of all accounts
- **Total Spent**: Total expenses
- **Transactions**: Transaction count
- **Net Balance**: Savings minus Expenses

### Savings Balance (Right Sidebar)
- Individual source balances
- Progress bars showing distribution
- Percentage breakdown

### Expense Breakdown (Right Sidebar)
- Expenses by category with progress bars
- Statistics (avg transaction, total transactions, highest category)

## 🎨 Theme & Colors

**Cyberpunk Neon Theme:**

| Element | Color |
|---------|-------|
| Background | #0f172a (Dark Navy) |
| Primary Accent | #00ffff (Cyan) |
| Secondary Accent | #a78bfa (Purple) |
| Money Given | #ff8c00 (Orange) |
| Savings | #20b2aa (Teal) |
| Expenses | #ff6b6b (Red) |
| Text | #ffffff (White) |

## 💾 Data Structure

### Savings Data
```javascript
{
  mobile: 10000,    // Mobile Money Balance
  cash: 5000,       // Cash Balance
  card: 25000       // Card Balance
}
```

### Transaction
```javascript
{
  id: 1702729200000,
  type: 'expense',     // 'expense' | 'savings' | 'moneyGiven' | 'moneyReceived'
  category: 'food',    // Only for expenses
  source: 'mobile',    // mobile | cash | card
  amount: 500,
  description: 'Lunch',
  date: '2025-12-16T10:30:00.000Z',
  personId: 12345      // Only for money given/received
}
```

### Money Given People
```javascript
{
  id: 1702729200000,
  name: 'Ahmed'
}
```

## 📱 Responsive Design

- **Mobile**: 320px - 640px (optimized for phones)
- **Tablet**: 641px - 1024px (side-by-side layout)
- **Desktop**: 1025px+ (full layout with sidebars)

## 🔄 How It Works

### State Management
1. React useState for local state
2. useEffect hooks for localStorage sync
3. Automatic save on every change
4. Auto-load on page refresh

### Balance Management
1. Add Expense: Deduct from selected source
2. Add Savings: Add to selected source
3. Money Given: Deduct from selected source
4. Money Received: Add to selected source
5. Delete Transaction: Reverse all changes

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to vercel.com
# 3. Import project from GitHub
# 4. Click Deploy
# 5. Done! Your site is live
```

### Deploy to Netlify

```bash
# 1. Build for production
npm run build

# 2. Deploy with Netlify CLI
netlify deploy --prod --dir=.next
```

### Self-Hosted Deployment

```bash
# 1. Build
npm run build

# 2. Start production server
npm start

# 3. Run on port 3000 (or configure)
```

## 🔒 Privacy & Security

✅ All data stored locally (browser localStorage)
✅ No user tracking
✅ No analytics
✅ No cloud storage
✅ No data sent to servers
✅ Complete privacy guaranteed

## 🐛 Troubleshooting

### Data not saving?
- Check browser localStorage limits
- Clear cache and reload
- Check console for errors

### App not loading?
- Clear browser cache
- Try incognito window
- Check JavaScript is enabled

### Currency not displaying?
- Browser supports Intl.NumberFormat
- Check locale is set to 'bn-BD' for Bengali

## 📞 Support

**Having issues?** Check these:

1. **Data lost after refresh?**
   - localStorage might be disabled
   - Try a different browser
   - Check Storage settings

2. **Numbers not formatting?**
   - Refresh the page
   - Clear browser cache
   - Check browser supports Intl API

3. **UI looks broken?**
   - Update Tailwind CSS
   - Rebuild: `npm run build`
   - Check CSS is loading

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Features Checklist

- [x] Expense tracking with categories
- [x] Multiple payment sources
- [x] Savings management
- [x] Money given tracking
- [x] Money received tracking
- [x] Transaction history with filters
- [x] Delete transactions
- [x] Balance calculations
- [x] Data persistence (localStorage)
- [x] Bangladeshi Taka formatting
- [x] Responsive mobile/desktop UI
- [x] Dark cyberpunk theme
- [x] Error handling & validation
- [x] Smooth animations
- [x] Real-time updates

## 📈 Future Enhancements

- 📈 Charts and analytics
- 📧 Email reports
- 🔐 User accounts & sync
- 💳 Bank API integration
- 📊 Monthly/yearly reports
- 🎯 Budget planning
- 📱 Progressive Web App
- 🔔 Notifications

---

**Created**: December 2025
**Status**: ✅ Production Ready
**Version**: 1.0.0

---

## Quick Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Intl NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

---

**Enjoy managing your expenses! 💰**
