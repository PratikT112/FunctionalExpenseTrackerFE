import { useState } from 'react';
import { css, T } from '../../styles/tokens';
import { fmt, today } from '../../utils/formatters';

const EMPTY_FORM = {
  expenseAmount:      '',
  expenseDate:        fmt(today),
  expenseDescription: '',
  categoryName:       '',   // we send name, backend resolves to entity
  paymentMethod:      '',   // paymentId UUID
  expenseNecessity:   'NECESSARY',
  expenseType:        'PERSONAL',
};

export function ExpenseFormModal({ expense, categories, paymentMethods, onSave, onClose, isMobile }) {
  const isEdit    = !!expense;
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  const [form, setForm] = useState(
    isEdit
      ? {
          expenseAmount:      expense.expenseAmount,
          expenseDate:        expense.expenseDate,
          expenseDescription: expense.expenseDescription,
          categoryName:       expense.categoryName || '',
          paymentMethod:      expense.paymentMethod || '',
          expenseNecessity:   expense.expenseNecessity,
          expenseType:        expense.expenseType || 'PERSONAL',
        }
      : {
          ...EMPTY_FORM,
          categoryName:  categories[0]?.categoryName  || '',
          paymentMethod: paymentMethods[0]?.paymentId || '',
        }
  );

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.expenseAmount || !form.expenseDate || !form.expenseDescription || !form.categoryName) return;
    setSubmitting(true);
    setError('');
    try {
      await onSave(form, isEdit ? expense : null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBtn = (field, value, activeColor, activeBg) => {
    const isActive = form[field] === value;
    return {
      flex: 1,
      textAlign: 'center',
      padding: isMobile ? '10px 8px' : '8px',
      borderRadius: '6px',
      cursor: 'pointer',
      border: `1px solid ${isActive ? activeColor : T.border}`,
      backgroundColor: isActive ? activeBg : 'transparent',
      color: isActive ? activeColor : T.textMuted,
      fontSize: '12px',
      fontWeight: '500',
      transition: 'all 0.15s',
    };
  };

  const overlayStyle = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent: 'center', zIndex: 1000, padding: isMobile ? '0' : '20px',
  };
  const boxStyle = isMobile
    ? { backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: '14px 14px 0 0', padding: '20px 18px 32px', width: '100%', maxHeight: '92vh', overflowY: 'auto' }
    : css.modalBox;

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={boxStyle}>
        {isMobile && <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: T.border, margin: '0 auto 16px' }} />}
        <div style={css.modalTitle}>{isEdit ? 'Edit expense' : 'Add expense'}</div>

        {error && (
          <div style={{ backgroundColor: T.dangerDim, border: `1px solid ${T.danger}`, borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: T.danger, marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <div style={css.formRow}>
          <label style={css.label}>Amount (₹)</label>
          <input style={{ ...css.input, fontSize: '16px' }} type="number" inputMode="decimal"
            value={form.expenseAmount} onChange={e => set('expenseAmount', e.target.value)} placeholder="0" />
        </div>

        <div style={css.formRow}>
          <label style={css.label}>Date</label>
          <input style={{ ...css.input, fontSize: '16px' }} type="date"
            value={form.expenseDate} max={fmt(today)} onChange={e => set('expenseDate', e.target.value)} />
        </div>

        <div style={css.formRow}>
          <label style={css.label}>Description</label>
          <input style={{ ...css.input, fontSize: '16px' }} type="text"
            value={form.expenseDescription} onChange={e => set('expenseDescription', e.target.value)}
            placeholder="What was this for?" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
          <div style={css.formRow}>
            <label style={css.label}>Category</label>
            {/* Select by categoryName — backend resolves to entity */}
            <select style={{ ...css.select, fontSize: '16px' }} value={form.categoryName}
              onChange={e => set('categoryName', e.target.value)}>
              <option value="">Select category</option>
              {categories.map(c => (
                <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
              ))}
            </select>
          </div>
          <div style={css.formRow}>
            <label style={css.label}>Payment method</label>
            <select style={{ ...css.select, fontSize: '16px' }} value={form.paymentMethod}
              onChange={e => set('paymentMethod', e.target.value)}>
              <option value="">Select method</option>
              {paymentMethods.map(p => (
                <option key={p.paymentId} value={p.paymentId}>{p.paymentName}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={css.formRow}>
          <label style={css.label}>Necessity</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div onClick={() => set('expenseNecessity', 'NECESSARY')} style={toggleBtn('expenseNecessity', 'NECESSARY', T.accent, T.accentDim + '44')}>Necessary</div>
            <div onClick={() => set('expenseNecessity', 'UNNECESSARY')} style={toggleBtn('expenseNecessity', 'UNNECESSARY', T.danger, T.dangerDim)}>Unnecessary</div>
          </div>
        </div>

        <div style={css.formRow}>
          <label style={css.label}>Expense for</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[{ value: 'PERSONAL', label: 'Personal', icon: '○' }, { value: 'FAMILY', label: 'Family', icon: '◎' }].map(({ value, label, icon }) => (
              <div key={value} onClick={() => set('expenseType', value)}
                style={{ ...toggleBtn('expenseType', value, T.type, T.typeDim), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...css.formActions, flexDirection: isMobile ? 'column-reverse' : 'row', gap: isMobile ? '8px' : '10px' }}>
          <button style={{ ...css.btnGhost, ...(isMobile ? { width: '100%', padding: '12px' } : {}) }} onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button
            style={{ ...css.btnPrimary, ...(isMobile ? { width: '100%', padding: '12px' } : {}), opacity: submitting ? 0.6 : 1 }}
            onClick={handleSave} disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Add expense'}
          </button>
        </div>
      </div>
    </div>
  );
}
