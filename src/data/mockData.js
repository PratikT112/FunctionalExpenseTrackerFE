import { fmt, daysAgo } from '../utils/formatters';

export const MOCK_USER = {
  username: 'pratik',
  email: 'pratik@example.com',
  role: 'user',
};

export const MOCK_CATEGORIES = [
  { categoryId: 'c1', categoryName: 'Food & Dining',  isDefaultCategory: true,  categoryStatus: 'active' },
  { categoryId: 'c2', categoryName: 'Transport',      isDefaultCategory: true,  categoryStatus: 'active' },
  { categoryId: 'c3', categoryName: 'Utilities',      isDefaultCategory: true,  categoryStatus: 'active' },
  { categoryId: 'c4', categoryName: 'Entertainment',  isDefaultCategory: true,  categoryStatus: 'active' },
  { categoryId: 'c5', categoryName: 'Health',         isDefaultCategory: true,  categoryStatus: 'active' },
  { categoryId: 'c6', categoryName: 'Groceries',      isDefaultCategory: true,  categoryStatus: 'active' },
  { categoryId: 'c7', categoryName: 'Shopping',       isDefaultCategory: true,  categoryStatus: 'active' },
  { categoryId: 'c8', categoryName: 'Subscriptions',  isDefaultCategory: false, categoryStatus: 'active' },
];

export const MOCK_PAYMENT_METHODS = [
  { paymentId: 'p1', paymentName: 'CC-ICICI-3004', type: 'CREDIT_CARD', paymentMethodStatus: 'active' },
  { paymentId: 'p2', paymentName: 'DC-ICICI-4003', type: 'DEBIT_CARD', paymentMethodStatus: 'active' },
  { paymentId: 'p3', paymentName: 'UPI-HDFC-ACC1', type: 'UPI',         paymentMethodStatus: 'active' },
  { paymentId: 'p4', paymentName: 'CASH',           type: 'CASH',        paymentMethodStatus: 'active' },
];

const today = new Date();

export const MOCK_EXPENSES_INIT = [
  {
    expenseId: 'e1', expenseAmount: 1200, expenseDate: fmt(today),
    expenseDescription: 'Team lunch at Mainland China',
    expenseCategory: 'c1', paymentMethod: 'p1',
    expenseNecessity: 'UNNECESSARY', expenseType: 'PERSONAL',
    reconciledAmount: 1200, netExpenseAmount: 0,
    isDeleted: false, createdAt: new Date().toISOString(),
    recons: [{ reconId: 'r1', reconAmount: 1200, reconDescription: 'Full payment', reconDate: fmt(today) }],
  },
  {
    expenseId: 'e2', expenseAmount: 450, expenseDate: fmt(today),
    expenseDescription: 'Uber to office',
    expenseCategory: 'c2', paymentMethod: 'p3',
    expenseNecessity: 'NECESSARY', expenseType: 'PERSONAL',
    reconciledAmount: 0, netExpenseAmount: 450,
    isDeleted: false, createdAt: new Date().toISOString(),
    recons: [],
  },
  {
    expenseId: 'e3', expenseAmount: 5999, expenseDate: daysAgo(2),
    expenseDescription: 'Monthly electricity bill',
    expenseCategory: 'c3', paymentMethod: 'p2',
    expenseNecessity: 'NECESSARY', expenseType: 'FAMILY',
    reconciledAmount: 5999, netExpenseAmount: 0,
    isDeleted: false, createdAt: new Date().toISOString(),
    recons: [{ reconId: 'r2', reconAmount: 5999, reconDescription: 'Full bill', reconDate: daysAgo(2) }],
  },
  {
    expenseId: 'e4', expenseAmount: 899, expenseDate: daysAgo(3),
    expenseDescription: 'Netflix + Spotify bundle',
    expenseCategory: 'c8', paymentMethod: 'p1',
    expenseNecessity: 'UNNECESSARY', expenseType: 'PERSONAL',
    reconciledAmount: 0, netExpenseAmount: 899,
    isDeleted: false, createdAt: new Date().toISOString(),
    recons: [],
  },
  {
    expenseId: 'e5', expenseAmount: 2400, expenseDate: daysAgo(4),
    expenseDescription: 'Weekly grocery run',
    expenseCategory: 'c6', paymentMethod: 'p2',
    expenseNecessity: 'NECESSARY', expenseType: 'FAMILY',
    reconciledAmount: 750, netExpenseAmount: 1650,
    isDeleted: false, createdAt: new Date().toISOString(),
    recons: [{ reconId: 'r3', reconAmount: 750, reconDescription: 'Partial split with flatmate', reconDate: daysAgo(4) }],
  },
  {
    expenseId: 'e6', expenseAmount: 3200, expenseDate: daysAgo(5),
    expenseDescription: 'Gym membership renewal',
    expenseCategory: 'c5', paymentMethod: 'p1',
    expenseNecessity: 'NECESSARY', expenseType: 'PERSONAL',
    reconciledAmount: 0, netExpenseAmount: 3200,
    isDeleted: false, createdAt: new Date().toISOString(),
    recons: [],
  },
  {
    expenseId: 'e7', expenseAmount: 650, expenseDate: daysAgo(6),
    expenseDescription: 'Movie tickets - Kalki',
    expenseCategory: 'c4', paymentMethod: 'p3',
    expenseNecessity: 'UNNECESSARY', expenseType: 'PERSONAL',
    reconciledAmount: 325, netExpenseAmount: 325,
    isDeleted: false, createdAt: new Date().toISOString(),
    recons: [{ reconId: 'r4', reconAmount: 325, reconDescription: 'Split with friend', reconDate: daysAgo(6) }],
  },
  {
    expenseId: 'e8', expenseAmount: 180, expenseDate: daysAgo(7),
    expenseDescription: 'Auto to station',
    expenseCategory: 'c2', paymentMethod: 'p4',
    expenseNecessity: 'NECESSARY', expenseType: 'FAMILY',
    reconciledAmount: 0, netExpenseAmount: 180,
    isDeleted: false, createdAt: new Date().toISOString(),
    recons: [],
  },
];
