# Quick Start Guide - Android App Expense Tracker

**Project Location:** `/home/imsourobh/projects/android-app/ExpenseTrackerWebsite`

---

## 🎯 New Features - Quick Access

### 1. **Export & Import Data**
**Location:** Settings Tab (⚙️ icon)

**Export Your Data:**
- Click "📥 Export to JSON Backup" → File downloads
- Click "📊 Export to CSV" → For spreadsheet analysis
- Keep backups safe (cloud, external drive, email)

**Import Data:**
- Click file picker next to "Import from JSON"
- Select previously exported JSON file
- Data restores instantly

---

### 2. **Loan Account**
**Access:** All account dropdowns

**Use Cases:**
- Borrow money from people: Track in "Loan" account
- Pay loan back: Use "Add Expense" → select "🏦 Loan"
- View loan balance: Check summary cards at top

**Key Point:** Loan transactions affect BOTH the loan account AND your balance!

---

### 3. **"Saving" Tab** (Renamed from "Add Savings")
**Location:** 💰 Saving tab

#### **Tab 1: Add Savings**
Traditional way to add money
- Select account (Mobile, Cash, Card, Loan)
- Enter amount
- Add description (optional)
- Click "Add Savings"

#### **Tab 2: Direct Change**
Set exact balance without calculations
- Select account
- See current amount
- Enter new amount
- Creates adjustment transaction automatically
- Good for corrections or manual imports

#### **Tab 3: Monthly Auto**
Automatic monthly deposits
- Toggle "Enable" ON
- Set amount (e.g., 5000)
- Choose account (Mobile, Cash, Card, Loan)
- Pick day of month (1-28)
- Saves automatically - deposits happen every month!

**Turn Off:** Just toggle OFF

#### **Tab 4: Scheduled**
One-time deposits for future dates
- Enter amount
- Choose account
- Pick date (calendar picker)
- Add description (e.g., "Bonus on Dec 25")
- Click "Schedule Deposit"
- Auto-completes on that date
- See all scheduled deposits below

---

### 4. **Money Exchanged Tab** (Renamed from "Money Given")
**Location:** 💸 Money Exchanged tab

Same functionality, better name!
- Track money given to people
- Track money received from people
- Manage list of people

---

### 5. **Loan Option in Expenses**
**Location:** Add Expense tab → "Pay From" dropdown

**How to Use:**
1. Go "Add Expense" tab
2. Select category (Food, Entertainment, Vehicle, Extra)
3. Select **"🏦 Loan"** from "Pay From"
4. Enter amount and description
5. Submit

---

### 6. **Monthly Auto-Deposits**
**Location:** Saving tab → Monthly Auto

**Setup Example:**
1. Toggle "Enable monthly auto-deposit" ✅
2. Enter amount: 5000
3. Choose account: Mobile Money
4. Pick day: 1
5. Click "Save Config"

**Result:** Every 1st of month, ৳5,000 added to Mobile Money automatically!

**Turn Off:** Just toggle OFF anytime

---

### 7. **Scheduled One-Time Deposits**
**Location:** Saving tab → Scheduled

**Setup Example:**
1. Amount: 10000
2. Account: Cash
3. Date: 2025-12-25 (Christmas bonus)
4. Description: "Year-end bonus"
5. Click "Schedule Deposit"

**Result:** On Dec 25, ৳10,000 automatically added as transaction!

---

### 8. **New Heading & Footer**
- **Heading:** "Remember: Easy money never exist"
  - Motivational message about financial discipline
  
- **Footer:** "contact: soumik@imsourobh.com"
  - Shows at bottom of page

---

## 📊 Account Types Reference

| Name | Icon | What to Use For |
|------|------|-----------------|
| Mobile Money | 📱 | bKash, Nagad, Rocket |
| Cash | 💵 | Physical money |
| Card | 💳 | Credit/Debit card |
| Loan | 🏦 | **NEW** - Borrowed money |

---

## 💡 Pro Tips

**💡 Tip 1: Monthly Salary**
Set monthly auto-deposit to match your salary payday. Always know incoming amount!

**💡 Tip 2: Known Bonuses**
Schedule deposits for bonuses you know are coming (holidays, year-end). Plan expenses accordingly!

**💡 Tip 3: CSV Analysis**
Export to CSV monthly to analyze spending in Excel/Google Sheets. Identify patterns!

**💡 Tip 4: Regular Backups**
Export JSON backup weekly before making big changes. Safety first!

**💡 Tip 5: Loan Tracking**
Borrowing ৳50k from your mobile money?
- Amount goes to "Loan" account
- Amount also increases in "Mobile Money"
- Dual tracking = total money available

**💡 Tip 6: Corrections Easy**
Made a mistake? Use "Direct Change" to fix it. Creates adjustment transaction automatically!

---

## 🔒 Data Backup Strategy

### **Backup Schedule:**
- **After Big Changes:** Always backup first
- **Weekly:** If using regularly
- **Monthly:** For archive/history

### **Where to Save:**
- ☁️ Google Drive / Dropbox
- 💾 External USB drive
- 📧 Email to yourself
- 🔐 Encrypted storage

### **File Names:** 
- `expense-tracker-backup-2025-12-20.json` (auto-named)
- Keep dates in filenames for reference

---

## ⚠️ Important Notes

**Storage Locations:**
- Main data: Capacitor Preferences (mobile storage)
- Monthly config: Saved locally in preferences
- Scheduled deposits: Saved locally in preferences
- All survive app refresh and device restart

**Synchronization:**
- Export/import handles all data types
- Complete backup available anytime
- No cloud sync (all local - your privacy!)

**Monthly Auto:**
- Checks date daily
- Won't duplicate deposits
- Can toggle ON/OFF anytime
- Resets last-run date on first of month

**Scheduled Deposits:**
- Check date on app startup
- Auto-completes when date matches
- Shows pending/completed status
- Can have multiple scheduled at once

---

## 🐛 Troubleshooting

**Q: Can't see new features?**
A: Make sure you're viewing the latest version. Clear cache if needed.

**Q: Loan amount not showing?**
A: Check summary cards at top - should be 4th card showing loan balance.

**Q: Monthly auto not working?**
A: Check toggle is ON. Check day of month is between 1-28. Check amount is set.

**Q: Scheduled deposit didn't trigger?**
A: Make sure date format is correct (YYYY-MM-DD). Check it matches today's date.

**Q: Can't import JSON?**
A: Make sure file is valid JSON. Try exporting again, then importing that file.

**Q: Lost data?**
A: Use Settings tab → Import from backup JSON. Restore previous export!

---

## 📱 Mobile App Notes

This webapp is designed for mobile (Capacitor + Android):
- ✅ All features work on mobile
- ✅ Touch-friendly buttons
- ✅ Responsive design
- ✅ Works offline (uses local storage)
- ✅ Export/import works mobile-to-mobile

---

## 🎨 Tab Structure

```
┌─ Add Expense ───────┐
├─ Money Exchanged ───┤  
├─ Saving ───────────┤
│  ├─ Add Savings     │
│  ├─ Direct Change   │
│  ├─ Monthly Auto    │
│  └─ Scheduled       │
├─ Settings ─────────┤
│  ├─ Export JSON     │
│  ├─ Import JSON     │
│  └─ Export CSV      │
└─ History ──────────┘
```

---

## 📞 Support & Contact

**Email:** soumik@imsourobh.com

(Also shown in footer)

---

**Happy Tracking!** 💰
Use these features to better manage your money and plan for the future!

---

**Last Updated:** All modifications complete ✅
