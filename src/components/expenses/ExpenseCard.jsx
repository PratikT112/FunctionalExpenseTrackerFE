import { css, T } from '../../styles/tokens';
import { formatINR } from '../../utils/formatters';

// Backend now returns categoryName and paymentMethodName directly on each expense
// No need to look them up from lists
export function ExpenseCard({ expense, onEdit, onDelete, onRecon, isMobile }) {
  const cat          = expense.categoryName       || '—';
  const pm           = expense.paymentMethodName  || '—';
  const hasRecon     = expense.reconciledAmount > 0;
  const isFullyRecon = expense.reconciledAmount >= expense.expenseAmount;
  const [deleting, setDeleting] = [false, () => {}]; // placeholder — managed by parent

  if (isMobile) {
    return (
      <div style={css.expenseCard}>
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <div style={{
            width: '3px', borderRadius: '2px', flexShrink: 0,
            backgroundColor: expense.expenseNecessity === 'NECESSARY' ? T.necessary : T.unnecessary,
            alignSelf: 'stretch',
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ ...css.expenseDesc, fontSize: '13px' }}>{expense.expenseDescription}</div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px', color: T.text, textDecoration: isFullyRecon ? 'line-through' : 'none', textDecorationColor: T.textFaint }}>
                  {formatINR(expense.expenseAmount)}
                </div>
                {hasRecon && (
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '11px', color: T.success }}>
                    net {formatINR(expense.netExpenseAmount)}
                  </div>
                )}
              </div>
            </div>
            <div style={{ ...css.expenseMeta, marginTop: '6px' }}>
              <span style={css.chip(T.surfaceRaised, T.textMuted)}>{cat}</span>
              <span style={css.chip(T.typeDim, T.type)}>{expense.expenseType === 'FAMILY' ? '◎ Family' : '○ Personal'}</span>
              <span style={{ fontSize: '11px', color: T.textFaint }}>{expense.expenseDate}</span>
              {isFullyRecon && <span style={css.chip(T.success + '22', T.success)}>Recon</span>}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
              <button style={{ ...css.btnGhost, flex: 1, padding: '7px', fontSize: '11px' }} onClick={() => onRecon(expense)}>Reconcile</button>
              <button style={{ ...css.btnGhost, flex: 1, padding: '7px', fontSize: '11px' }} onClick={() => onEdit(expense)}>Edit</button>
              <button style={{ ...css.btnDanger, padding: '7px 12px', fontSize: '11px' }} onClick={() => onDelete(expense.expenseId)}>✕</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={css.expenseCard}
      onMouseEnter={e => e.currentTarget.style.borderColor = T.borderLight}
      onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
      <div style={{ width: '3px', borderRadius: '2px', flexShrink: 0, alignSelf: 'stretch', backgroundColor: expense.expenseNecessity === 'NECESSARY' ? T.necessary : T.unnecessary }} />
      <div style={css.expenseLeft}>
        <div style={css.expenseDesc}>{expense.expenseDescription}</div>
        <div style={css.expenseMeta}>
          <span style={css.chip(T.surfaceRaised, T.textMuted)}>{cat}</span>
          <span style={css.chip(T.surfaceRaised, T.textMuted)}>{pm}</span>
          <span style={css.chip(T.typeDim, T.type)}>{expense.expenseType === 'FAMILY' ? '◎ Family' : '○ Personal'}</span>
          <span style={{ fontSize: '11px', color: T.textFaint }}>{expense.expenseDate}</span>
          {isFullyRecon && <span style={css.chip(T.success + '22', T.success)}>Fully recon</span>}
          {hasRecon && !isFullyRecon && <span style={css.chip(T.accent + '22', T.accent)}>Partial recon</span>}
        </div>
      </div>
      <div style={css.expenseRight}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '15px', color: T.text, textDecoration: isFullyRecon ? 'line-through' : 'none', textDecorationColor: T.textFaint }}>
          {formatINR(expense.expenseAmount)}
        </div>
        {hasRecon && (
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: T.success, marginTop: '2px' }}>
            net {formatINR(expense.netExpenseAmount)}
          </div>
        )}
        <div style={{ display: 'flex', gap: '5px', marginTop: '8px', justifyContent: 'flex-end' }}>
          <button style={css.btnGhost} onClick={() => onRecon(expense)}>Recon</button>
          <button style={css.btnGhost} onClick={() => onEdit(expense)}>Edit</button>
          <button style={css.btnDanger} onClick={() => onDelete(expense.expenseId)}>✕</button>
        </div>
      </div>
    </div>
  );
}
