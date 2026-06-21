import { useState } from 'react';
import { css, T } from '../../styles/tokens';
import { formatINR } from '../../utils/formatters';

export function ReconModal({ expense, onAddRecon, onRemoveRecon, onClose, isMobile }) {
  const [reconAmount,  setReconAmount]  = useState('');
  const [reconDesc,    setReconDesc]    = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [removing,     setRemoving]     = useState(null); // reconId being removed
  const [error,        setError]        = useState('');

  // expense prop is kept in sync by parent (updated after each API call)
  const remaining = expense.expenseAmount - expense.reconciledAmount;

  const handleAdd = async () => {
    const amt = parseFloat(reconAmount);
    if (!amt || amt > remaining || amt <= 0) return;
    setSubmitting(true);
    setError('');
    try {
      await onAddRecon(expense, amt, reconDesc);
      setReconAmount('');
      setReconDesc('');
    } catch (err) {
      setError(err.message || 'Failed to add recon entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (reconId) => {
    setRemoving(reconId);
    setError('');
    try {
      await onRemoveRecon(expense, reconId);
    } catch (err) {
      setError(err.message || 'Failed to remove recon entry');
    } finally {
      setRemoving(null);
    }
  };

  const overlayStyle = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent: 'center', zIndex: 1000, padding: isMobile ? '0' : '20px',
  };
  const boxStyle = isMobile
    ? { backgroundColor: T.surface, border: `1px solid ${T.border}`, borderRadius: '14px 14px 0 0', padding: '20px 18px 32px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }
    : css.modalBox;

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={boxStyle}>
        {isMobile && <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: T.border, margin: '0 auto 16px' }} />}

        <div style={css.modalTitle}>{isMobile ? 'Reconcile' : `Reconcile — ${expense.expenseDescription}`}</div>
        {isMobile && <div style={{ fontSize: '12px', color: T.textMuted, marginTop: '-12px', marginBottom: '16px' }}>{expense.expenseDescription}</div>}

        {error && (
          <div style={{ backgroundColor: T.dangerDim, border: `1px solid ${T.danger}`, borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: T.danger, marginBottom: '14px' }}>
            {error}
          </div>
        )}

        {/* Summary row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={css.bigNumberLabel}>Original</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: isMobile ? '16px' : '20px', color: T.text }}>{formatINR(expense.expenseAmount)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={css.bigNumberLabel}>Reconciled</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: isMobile ? '16px' : '20px', color: T.success }}>{formatINR(expense.reconciledAmount)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={css.bigNumberLabel}>Remaining</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: isMobile ? '16px' : '20px', color: remaining > 0 ? T.danger : T.textMuted }}>{formatINR(remaining)}</div>
          </div>
        </div>

        <div style={css.splitBar}>
          <div style={{ width: `${(expense.reconciledAmount / expense.expenseAmount) * 100}%`, backgroundColor: T.success, transition: 'width 0.3s ease' }} />
        </div>

        <div style={css.hr} />

        {/* Existing entries — from backend via expense.recons */}
        {expense.recons.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div style={{ ...css.label, marginBottom: '10px' }}>Existing entries</div>
            {expense.recons.map(r => (
              <div key={r.reconId} style={css.reconEntry}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: T.text }}>{r.reconDescription || '—'}</div>
                    <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '2px' }}>{r.reconDate}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: T.success }}>{formatINR(r.reconAmount)}</div>
                    <button
                      style={{ ...css.btnDanger, opacity: removing === r.reconId ? 0.5 : 1 }}
                      disabled={removing === r.reconId}
                      onClick={() => handleRemove(r.reconId)}>
                      {removing === r.reconId ? '...' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new entry */}
        {remaining > 0 && (
          <>
            <div style={{ ...css.label, marginBottom: '10px' }}>Add entry</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <div>
                <label style={css.label}>Amount</label>
                <input style={{ ...css.input, fontSize: '16px' }} type="number" inputMode="decimal"
                  value={reconAmount} onChange={e => setReconAmount(e.target.value)}
                  placeholder={`Max ${formatINR(remaining)}`} />
              </div>
              <div>
                <label style={css.label}>Note</label>
                <input style={{ ...css.input, fontSize: '16px' }} type="text"
                  value={reconDesc} onChange={e => setReconDesc(e.target.value)}
                  placeholder="e.g. split with Aman" />
              </div>
            </div>
            <button
              style={{ ...css.btnPrimary, width: '100%', padding: isMobile ? '12px' : '9px', opacity: submitting ? 0.6 : 1 }}
              onClick={handleAdd} disabled={submitting}>
              {submitting ? 'Saving...' : 'Add recon entry'}
            </button>
          </>
        )}

        <div style={{ marginTop: '12px' }}>
          <button style={{ ...css.btnGhost, width: '100%', padding: isMobile ? '12px' : '8px' }} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
