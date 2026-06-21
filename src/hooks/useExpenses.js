import { useState, useCallback } from 'react';
import { expensesApi } from '../api/expenses';

export function useExpenses() {
  const [expenses,   setExpenses]   = useState([]);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState(null);

  // ── Map backend response shape → frontend shape ─────────────────────────
  // Backend returns: expenseId, description, amount, reconciledAmount,
  //   netExpenseAmount, categoryId, categoryName, paymentMethodId,
  //   paymentMethodName, necessity, expenseType, reconciliationStatus,
  //   expenseDate, recons[]
  const mapExpense = (e) => ({
    expenseId:          e.expenseId,
    expenseAmount:      parseFloat(e.amount),
    expenseDate:        e.expenseDate,
    expenseDescription: e.description,
    expenseCategory:    e.categoryId,
    categoryName:       e.categoryName,
    paymentMethod:      e.paymentMethodId   || null,
    paymentMethodName:  e.paymentMethodName || null,
    expenseNecessity:   e.necessity,
    expenseType:        e.expenseType,
    reconciledAmount:   parseFloat(e.reconciledAmount),
    netExpenseAmount:   parseFloat(e.netExpenseAmount),
    reconciliationStatus: e.reconciliationStatus,
    isDeleted:          false,
    recons: (e.recons || []).map(r => ({
      reconId:         r.reconId,
      reconAmount:     parseFloat(r.reconAmount),
      reconDescription: r.reconDesc,
      reconDate:       r.reconDate,
    })),
  });

  // ── Load expenses for a month ────────────────────────────────────────────
  const loadExpenses = useCallback(async (year, month) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await expensesApi.getByMonth(year, month);
      setExpenses((data || []).map(mapExpense));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Add expense ──────────────────────────────────────────────────────────
  const saveExpense = useCallback(async (formData, existing) => {
    const dto = {
      description:     formData.expenseDescription,
      categoryName:    formData.categoryName,
      paymentMethodId: formData.paymentMethod || null,
      amount:          parseFloat(formData.expenseAmount),
      necessity:       formData.expenseNecessity,
      expenseType:     formData.expenseType,
      expDt:           formData.expenseDate,
    };

    if (existing) {
      const updated = await expensesApi.update(existing.expenseId, dto);
      const mapped  = mapExpense(updated);
      setExpenses(prev => prev.map(e => e.expenseId === mapped.expenseId ? mapped : e));
      return mapped;
    } else {
      const created = await expensesApi.create(dto);
      const mapped  = mapExpense(created);
      setExpenses(prev => [mapped, ...prev]);
      return mapped;
    }
  }, []);

  // ── Soft delete ──────────────────────────────────────────────────────────
  const deleteExpense = useCallback(async (expenseId) => {
    await expensesApi.delete(expenseId);
    setExpenses(prev => prev.filter(e => e.expenseId !== expenseId));
  }, []);

  // ── Add recon ────────────────────────────────────────────────────────────
  const addRecon = useCallback(async (expense, amount, desc) => {
    const updated = await expensesApi.addRecon(expense.expenseId, amount, desc);
    const mapped  = mapExpense(updated);
    setExpenses(prev => prev.map(e => e.expenseId === mapped.expenseId ? mapped : e));
    return mapped;
  }, []);

  // ── Remove recon ─────────────────────────────────────────────────────────
  const removeRecon = useCallback(async (expense, reconId) => {
    const updated = await expensesApi.removeRecon(expense.expenseId, reconId);
    const mapped  = mapExpense(updated);
    setExpenses(prev => prev.map(e => e.expenseId === mapped.expenseId ? mapped : e));
    return mapped;
  }, []);

  // ── Derived stats ─────────────────────────────────────────────────────────
  const activeExpenses     = expenses;
  const totalSpend         = activeExpenses.reduce((s, e) => s + e.netExpenseAmount, 0);
  console.log(totalSpend)
  const necessarySpend     = activeExpenses.filter(e => e.expenseNecessity === 'NECESSARY').reduce((s, e) => s + e.netExpenseAmount, 0);
  const unnecessarySpend   = activeExpenses.filter(e => e.expenseNecessity === 'UNNECESSARY').reduce((s, e) => s + e.netExpenseAmount, 0);
  const reconSaved         = activeExpenses.reduce((s, e) => s + (e.expenseAmount - e.netExpenseAmount), 0);
  const necPct             = totalSpend > 0 ? (necessarySpend / totalSpend) * 100 : 0;

  
  return {
    expenses,
    activeExpenses,
    isLoading,
    error,
    loadExpenses,
    saveExpense,
    deleteExpense,
    addRecon,
    removeRecon,
    stats: { totalSpend, necessarySpend, unnecessarySpend, reconSaved, necPct },
  };
}
