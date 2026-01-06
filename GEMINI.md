# GEMINI.md

## Project Overview

This is a Next.js-based expense and savings tracker web application. It allows users to manage daily expenses, track savings across different accounts, and keep a record of money lent or borrowed. The application is designed to be a standalone, client-side-only tool, using the browser's `localStorage` for data persistence via Capacitor's Preferences API. The project is styled with Tailwind CSS and has a modern, dark, cyberpunk-inspired theme. It's also configured for static site generation and can be wrapped as an Android app using Capacitor.

## Building and Running

### Prerequisites
- Node.js 16+
- npm or yarn

### Development
To run the application in development mode:
```bash
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

### Production
To build and run the application in production mode:
```bash
npm run build
npm run start
```

### Linting
To run the linter and check for code quality issues:
```bash
npm run lint
```

## Development Conventions

*   **State Management:** The application uses React's built-in `useState` and `useEffect` hooks for state management. There is no external state management library like Redux or Zustand.
*   **Data Persistence:** All data is stored in the browser's `localStorage` using the `@capacitor/preferences` plugin. This makes the application work offline and ensures data privacy.
*   **Styling:** The project uses Tailwind CSS for styling. The color palette and theme are defined in `README.md` and applied throughout the application.
*   **Component Structure:** The application is built with a modular component structure. The main component is `ExpenseSavingsTracker`, which is composed of several smaller components like `ExpenseForm`, `SavingsManagement`, and `TransactionHistory`. All components are located in the `components` directory.
*   **Code Style:** The code follows standard JavaScript and React conventions. The use of `eslint-config-next` ensures a consistent code style.
