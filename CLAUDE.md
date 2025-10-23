# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 expense tracking application built with TypeScript and Tailwind CSS. The app demonstrates different architectural approaches to implementing export functionality, with three feature branches showcasing progressively complex implementations.

## Development Commands

### Essential Commands
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Create production build
npm start            # Run production server
npm run lint         # Run ESLint
```

### Testing Export Features
The app has three different export implementations on separate branches:
```bash
git checkout main                        # Simple CSV export (baseline)
git checkout feature-data-export-v1      # Same as main
git checkout feature-data-export-v2      # Advanced modal with CSV/JSON/PDF
git checkout feature-data-export-v3      # Cloud-integrated mockup
```

## Architecture Overview

### Data Flow Pattern
This is a **client-side only** application with no backend:
```
User → React Components → Custom Hooks → LocalStorage
                       ↓
                  State Management (useState)
```

### Core Architecture Layers

1. **UI Layer** (`app/page.tsx`)
   - Single-page application serving as the main container
   - Manages top-level state and coordinates all child components
   - Uses client-side rendering (`'use client'`)

2. **Component Layer** (`components/`)
   - Self-contained, reusable React components
   - Each component handles its own local UI state
   - Props drilling for data from parent

3. **Business Logic Layer** (`hooks/`)
   - `useExpenses`: CRUD operations for expenses (add, update, delete, clear)
   - `useFilters`: Filter state management (date range, category, search)
   - Custom hooks encapsulate data operations and side effects

4. **Utilities Layer** (`utils/`)
   - `storage.ts`: LocalStorage abstraction (getExpenses, saveExpenses, etc.)
   - `format.ts`: Date and currency formatting utilities
   - `analytics.ts`: Summary calculations, export functions, filtering logic

5. **Type System** (`types/`)
   - Central type definitions for Expense, Category, Filters, Summary
   - Constants: CATEGORIES array, CATEGORY_COLORS, CATEGORY_ICONS

### State Management Strategy

**Pattern**: Local Component State (no Redux/Zustand)
- Main state lives in `app/page.tsx`
- Passed down via props to child components
- Custom hooks manage their own state and sync with localStorage
- `useEffect` in `useExpenses` loads data from localStorage on mount

**State Flow Example**:
```typescript
app/page.tsx (expenses state)
  ↓ props
ExpenseList (displays)
ExpenseForm → useExpenses.addExpense()
  ↓ updates
storage.addExpense()
  ↓ triggers
useExpenses setState
  ↓ re-renders
app/page.tsx
```

### LocalStorage Architecture

**Key**: `'expense-tracker-expenses'`
**Format**: JSON array of Expense objects
**SSR Safety**: All storage operations check `typeof window !== 'undefined'`

**Important**: When adding new features that modify data structure:
1. Consider migration strategy for existing localStorage data
2. Handle cases where data format might be old
3. Always validate data coming from localStorage

### Export Feature Implementations

The repository showcases three different architectural approaches to the same feature:

#### Version 1 (main branch): Simple CSV Export
- **Pattern**: Functional/Procedural
- **Code**: ~20 lines total
- **Implementation**: Single button → utility function → blob download
- **Use case**: MVP, internal tools, simple needs

#### Version 2 (feature-data-export-v2): Advanced Modal
- **Pattern**: Component-based architecture
- **Code**: ~835 lines (445 component + 375 utility + 15 page)
- **Key files**: `components/ExportModal.tsx`, `utils/exportAdvanced.ts`
- **Features**: Multiple formats (CSV/JSON/PDF), advanced filters, preview, custom filename
- **Implementation**: Modal UI with controlled form state → format-specific export functions
- **Security note**: PDF export has XSS vulnerability - descriptions are not HTML-escaped
- **Use case**: Professional applications, user-facing products

#### Version 3 (feature-data-export-v3): Cloud Integration Mockup
- **Pattern**: Multi-view container with tab navigation
- **Code**: ~692 lines (540 component + 152 types)
- **Key files**: `components/CloudExportPanel.tsx`, `types/cloud-export.ts`
- **Features**: Export templates, cloud provider mockups, history tracking, scheduled exports, share links
- **Implementation**: Tabbed side panel with mock data and simulated cloud integrations
- **Important**: This is a UI mockup - no actual backend integration
- **Use case**: SaaS products with backend infrastructure

See `code-analysis.md` for detailed technical comparison of all three approaches.

## Key Design Patterns

### 1. localStorage Wrapper Pattern
Instead of calling localStorage directly, all access goes through `utils/storage.ts`:
```typescript
// Good
storage.getExpenses()
storage.addExpense(expense)

// Avoid
localStorage.getItem('expense-tracker-expenses')
```
**Why**: Centralized error handling, SSR safety, consistent data format

### 2. Custom Hook Pattern for Data Operations
Business logic is encapsulated in custom hooks (`hooks/useExpenses.ts`):
```typescript
const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
```
**Why**: Reusable, testable, separates concerns, manages side effects

### 3. Controlled Components
All form inputs are controlled via React state:
```typescript
<input value={formData.amount} onChange={handleAmountChange} />
```
**Why**: Single source of truth, validation on change, predictable behavior

### 4. Derived State with useMemo
Filtered/computed data is derived rather than stored:
```typescript
const filteredExpenses = useMemo(() =>
  filterExpenses(expenses, filters),
  [expenses, filters]
);
```
**Why**: Prevents stale data, optimizes performance, reduces bugs

## Important Technical Constraints

### 1. Client-Side Only (No Backend)
- All data storage uses localStorage (max ~5-10MB per domain)
- No user authentication or multi-user support
- No server-side rendering for data-dependent pages
- Export features that require backend (V3 cloud integrations) are UI mockups only

### 2. Next.js App Router
- This uses Next.js 14 **App Router** (not Pages Router)
- All interactive components need `'use client'` directive
- File-based routing: `app/page.tsx` is the root route
- Server components by default, opt into client components explicitly

### 3. TypeScript Strict Mode
- All types defined in `types/expense.ts`
- Category is a union type: `'Food' | 'Transportation' | ...`
- No `any` types - use proper type definitions

### 4. Tailwind CSS for Styling
- No CSS modules or styled-components
- Utility-first approach with Tailwind classes
- Responsive design using Tailwind breakpoints (sm, md, lg)
- Custom colors defined in `tailwind.config.ts`

## Common Development Scenarios

### Adding a New Category
1. Update `Category` type in `types/expense.ts`
2. Add to `CATEGORIES` array
3. Add color to `CATEGORY_COLORS`
4. Add icon to `CATEGORY_ICONS`

### Adding a New Field to Expense
1. Update `Expense` interface in `types/expense.ts`
2. Update form in `components/ExpenseForm.tsx`
3. Update display in `components/ExpenseList.tsx`
4. Update export functions in `utils/analytics.ts` (CSV headers and mapping)
5. Consider localStorage migration for existing data

### Implementing a New Export Format
If on main branch (V1), follow the simple pattern:
1. Add export function to `utils/analytics.ts`
2. Add handler in `app/page.tsx`
3. Add button in UI

If starting fresh with advanced features, use V2 pattern as reference:
1. Create/update `components/ExportModal.tsx`
2. Add format-specific export function to utilities
3. Update format selector UI

### Adding a New Filter
1. Update `ExpenseFilters` interface in `types/expense.ts`
2. Add state in `hooks/useFilters.ts`
3. Update `filterExpenses` function in `utils/analytics.ts`
4. Add UI control in `components/ExpenseFilters.tsx`

## Code Quality Notes

### Current State
- No unit tests (test framework not set up)
- No error boundaries
- Minimal error handling (mostly console.error)
- No accessibility attributes (ARIA labels)
- No internationalization (i18n)

### Known Issues

**Security**:
- CSV export: Potential formula injection (descriptions starting with `=`, `+`, `-`, `@`)
- V2 PDF export: XSS vulnerability - HTML in descriptions not escaped
- No data sanitization on input

**Performance**:
- No pagination for large expense lists
- No virtual scrolling
- CSV export builds entire file in memory (could fail with 10k+ records)

**UX**:
- No keyboard shortcuts
- Delete uses browser `confirm()` (not a custom modal)
- No undo functionality
- No loading states for localStorage operations (they're fast but not instant)

### When Making Changes

**Before modifying storage format**:
- Check existing data structure in localStorage
- Write migration code if changing schema
- Test with existing data in localStorage

**When adding new components**:
- Use `'use client'` directive if component uses hooks, events, or browser APIs
- Follow existing naming conventions (PascalCase for components)
- Keep components focused and single-purpose

**When working with branches**:
- The three export branches intentionally have divergent implementations
- Don't merge them together - they're meant to showcase different approaches
- Each branch should remain independent for comparison purposes

## Project Context

This codebase was created as a demonstration of different architectural approaches to the same feature (data export). The three branches show:
1. How a simple implementation can meet basic needs with minimal code
2. How to build a professional, feature-rich version
3. How to design for future cloud/SaaS features (even if backend doesn't exist yet)

When working in this repository, be mindful of which branch you're on and what architectural philosophy that branch represents.
