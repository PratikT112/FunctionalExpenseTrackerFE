import { useState, useEffect, useCallback } from 'react';

// Auth
import { useAuth }           from './context/AuthContext';
import { LoginPage }         from './pages/LoginPage';

// Hooks
import { useExpenses }       from './hooks/useExpenses';
import { useCategories }     from './hooks/useCategories';
import { usePaymentMethods } from './hooks/usePaymentMethods';
import { useToast }          from './hooks/useToast';
import { useIsMobile }       from './hooks/useMediaQuery';

// Layout
import { Sidebar, BottomNav } from './components/layout/Sidebar';
import { Topbar }              from './components/layout/Topbar';
import { Toast }               from './components/layout/Toast';

// Views
import { ExpensesView }  from './components/expenses/ExpensesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView }  from './components/settings/SettingsView';

// Modals
import { ExpenseFormModal } from './components/modals/ExpenseFormModal';
import { ReconModal }       from './components/modals/ReconModal';

// Styles
import { css, T } from './styles/tokens';

export default function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useIsMobile();

  // ── Navigation ─────────────────────────────────────────────────────────────
  const [nav, setNav] = useState('expenses');

  // ── Month selector ─────────────────────────────────────────────────────────
  const now = new Date();
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-indexed

  // ── Data hooks ─────────────────────────────────────────────────────────────
  const { expenses, activeExpenses, isLoading: expLoading, error: expError,
          loadExpenses, saveExpense, deleteExpense, addRecon, removeRecon, stats } = useExpenses();

  const { categories, loadCategories, addCategory, deleteCategory }               = useCategories();
  const { paymentMethods, loadPaymentMethods, addPaymentMethod, deletePaymentMethod } = usePaymentMethods();
  const { toast, showToast, clearToast }                                          = useToast();

  // ── Load all data when authenticated or month changes ─────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    loadExpenses(selectedYear, selectedMonth);
  }, [isAuthenticated, selectedYear, selectedMonth, loadExpenses]);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadCategories();
    loadPaymentMethods();
  }, [isAuthenticated, loadCategories, loadPaymentMethods]);

  // ── Month navigation ───────────────────────────────────────────────────────
  const prevMonth = () => {
    if (selectedMonth === 1) { setSelectedYear(y => y - 1); setSelectedMonth(12); }
    else setSelectedMonth(m => m - 1);
  };
  const nextMonth = () => {
    const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1;
    if (isCurrentMonth) return;
    if (selectedMonth === 12) { setSelectedYear(y => y + 1); setSelectedMonth(1); }
    else setSelectedMonth(m => m + 1);
  };
  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1;
  const monthLabel = new Date(selectedYear, selectedMonth - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  // ── Modal state ────────────────────────────────────────────────────────────
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editExpense,    setEditExpense]    = useState(null);
  const [reconExpense,   setReconExpense]   = useState(null);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSaveExpense = useCallback(async (formData, existing) => {
    await saveExpense(formData, existing);
    showToast(existing ? 'Expense updated' : 'Expense added');
    setShowAddExpense(false);
    setEditExpense(null);
  }, [saveExpense, showToast]);

  const handleDeleteExpense = useCallback(async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      showToast('Expense removed');
    } catch (err) {
      showToast('Failed to delete: ' + err.message);
    }
  }, [deleteExpense, showToast]);

  const handleAddRecon = useCallback(async (expense, amount, desc) => {
    const updated = await addRecon(expense, amount, desc);
    setReconExpense(updated); // update modal with fresh data from backend
    showToast('Recon entry added');
    return updated;
  }, [addRecon, showToast]);

  const handleRemoveRecon = useCallback(async (expense, reconId) => {
    const updated = await removeRecon(expense, reconId);
    setReconExpense(updated);
    showToast('Recon entry removed');
    return updated;
  }, [removeRecon, showToast]);

  // ── Not authenticated — show login ─────────────────────────────────────────
  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => {}} />;
  }

  // ── Content padding ────────────────────────────────────────────────────────
  const contentPad = isMobile
    ? { padding: '16px 14px', paddingBottom: '80px' }
    : { padding: '24px 28px' };

  return (
    <div style={css.app}>
      {!isMobile && <Sidebar nav={nav} onNav={setNav} user={user} onLogout={logout} />}

      <main style={css.main}>
        <Topbar
          nav={nav}
          activeCount={activeExpenses.length}
          monthLabel={monthLabel}
          onAddExpense={() => setShowAddExpense(true)}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          isCurrentMonth={isCurrentMonth}
          isMobile={isMobile}
          user={user}
          onLogout={logout}
        />

        {nav === 'expenses' && (
          <ExpensesView
            activeExpenses={activeExpenses}
            stats={stats}
            onEdit={exp => setEditExpense(exp)}
            onDelete={handleDeleteExpense}
            onRecon={exp => setReconExpense(exp)}
            isMobile={isMobile}
            isLoading={expLoading}
          />
        )}

        {nav === 'analytics' && (
          <div style={{ ...css.content, ...contentPad }}>
            <AnalyticsView expenses={expenses} categories={categories} isMobile={isMobile} />
          </div>
        )}

        {nav === 'settings' && (
          <div style={{ ...css.content, ...contentPad }}>
            <SettingsView
              categories={categories}
              paymentMethods={paymentMethods}
              onAddCategory={async (name) => { await addCategory(name); showToast('Category added'); }}
              onDeleteCategory={async (id) => { await deleteCategory(id); showToast('Category removed'); }}
              onAddPayment={async (form) => { await addPaymentMethod(form); showToast('Payment method added'); }}
              onDeletePayment={async (id) => { await deletePaymentMethod(id); showToast('Payment method removed'); }}
              isMobile={isMobile}
            />
          </div>
        )}
      </main>

      {isMobile && <BottomNav nav={nav} onNav={setNav} />}

      {/* Modals */}
      {(showAddExpense || editExpense) && (
        <ExpenseFormModal
          expense={editExpense}
          categories={categories}
          paymentMethods={paymentMethods}
          onSave={handleSaveExpense}
          onClose={() => { setShowAddExpense(false); setEditExpense(null); }}
          isMobile={isMobile}
        />
      )}

      {reconExpense && (
        <ReconModal
          expense={reconExpense}
          onAddRecon={handleAddRecon}
          onRemoveRecon={handleRemoveRecon}
          onClose={() => setReconExpense(null)}
          isMobile={isMobile}
        />
      )}

      {toast && <Toast message={toast} onDone={clearToast} />}
    </div>
  );
}
