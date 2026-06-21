import { useState } from 'react';
import { css, T } from '../../styles/tokens';

export function PaymentMethodFormModal({ onSave, onClose, isMobile }) {
  const [form,       setForm]       = useState({ paymentName: '', type: 'UPI' });
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!form.paymentName) return;
    setSubmitting(true);
    setError('');
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add payment method');
    } finally {
      setSubmitting(false);
    }
  };

  const overlayStyle = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent: 'center', zIndex: 1000, padding: isMobile ? '0' : '20px',
  };
  const boxStyle = isMobile
    ? { backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: '14px 14px 0 0', padding: '20px 18px 32px', width: '100%' }
    : css.modalBox;

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={boxStyle}>
        {isMobile && <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: T.border, margin: '0 auto 16px' }} />}
        <div style={css.modalTitle}>New payment method</div>

        {error && (
          <div style={{ backgroundColor: T.dangerDim, border: `1px solid ${T.danger}`, borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: T.danger, marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <div style={css.formRow}>
          <label style={css.label}>Display name</label>
          <input style={{ ...css.input, fontSize: '16px' }} type="text"
            value={form.paymentName} onChange={e => set('paymentName', e.target.value)}
            placeholder="e.g. CC-HDFC-9001"
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus />
        </div>
        <div style={css.formRow}>
          <label style={css.label}>Type</label>
          <select style={{ ...css.select, fontSize: '16px' }} value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="UPI">UPI</option>
            <option value="CASH">Cash</option>
          </select>
        </div>
        <div style={{ ...css.formActions, flexDirection: isMobile ? 'column-reverse' : 'row', gap: '8px' }}>
          <button style={{ ...css.btnGhost, ...(isMobile ? { width: '100%', padding: '12px' } : {}) }} onClick={onClose} disabled={submitting}>Cancel</button>
          <button style={{ ...css.btnPrimary, ...(isMobile ? { width: '100%', padding: '12px' } : {}), opacity: submitting ? 0.6 : 1 }}
            onClick={handleSave} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add method'}
          </button>
        </div>
      </div>
    </div>
  );
}
