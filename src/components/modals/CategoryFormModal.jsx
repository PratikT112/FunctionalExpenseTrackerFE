import { useState } from 'react';
import { css, T } from '../../styles/tokens';

export function CategoryFormModal({ categories, onSave, onClose, isMobile }) {
  const [name,       setName]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  const existsLocally = categories.some(c => c.categoryName.toLowerCase() === name.toLowerCase());

  const handleSave = async () => {
    if (!name || existsLocally) return;
    setSubmitting(true);
    setError('');
    try {
      await onSave(name);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add category');
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
        <div style={css.modalTitle}>New category</div>

        {error && (
          <div style={{ backgroundColor: T.dangerDim, border: `1px solid ${T.danger}`, borderRadius: '6px', padding: '10px 14px', fontSize: '12px', color: T.danger, marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <div style={css.formRow}>
          <label style={css.label}>Category name</label>
          <input
            style={{ ...css.input, fontSize: '16px', borderColor: existsLocally ? T.danger : T.border }}
            type="text" value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Fuel, Books"
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            autoFocus
          />
          {existsLocally && <div style={{ fontSize: '11px', color: T.danger, marginTop: '4px' }}>Category already exists</div>}
        </div>

        <div style={{ ...css.formActions, flexDirection: isMobile ? 'column-reverse' : 'row', gap: '8px' }}>
          <button style={{ ...css.btnGhost, ...(isMobile ? { width: '100%', padding: '12px' } : {}) }} onClick={onClose} disabled={submitting}>Cancel</button>
          <button
            style={{ ...css.btnPrimary, opacity: existsLocally || !name || submitting ? 0.5 : 1, ...(isMobile ? { width: '100%', padding: '12px' } : {}) }}
            onClick={handleSave} disabled={existsLocally || !name || submitting}>
            {submitting ? 'Adding...' : 'Add category'}
          </button>
        </div>
      </div>
    </div>
  );
}
