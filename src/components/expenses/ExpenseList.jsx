import { useState } from 'react';
import { css, T } from '../../styles/tokens';
import { ExpenseCard } from './ExpenseCard';

const FILTERS = [
  { value: 'ALL',          label: 'All'         , listHeading: 'ALL EXPENSES'},
  { value: 'NECESSARY',   label: 'Necessary'   , listHeading: 'NECESSARY EXPENSES'},
  { value: 'UNNECESSARY', label: 'Unnecessary' , listHeading: 'UNNECESSARY EXPENSES'}
];

export function ExpenseList({ activeExpenses, onEdit, onDelete, onRecon, isMobile }) {
  const [filter, setFilter] = useState('ALL');

  const visible = (
    filter === 'ALL'
      ? activeExpenses
      : activeExpenses.filter(e => e.expenseNecessity === filter)
  ).sort((a, b) => b.expenseDate.localeCompare(a.expenseDate));

  return (
    <>
      <div style={css.sectionHeader}>
        <div style={css.sectionTitle}>{FILTERS.find(x=>x.value === filter).listHeading}</div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {FILTERS.map(f => (
            <button key={f.value}
              style={{ ...css.btnGhost, color: filter === f.value ? T.accent : T.textMuted, borderColor: filter === f.value ? T.accent : T.border, padding: isMobile ? '5px 8px' : '6px 10px', fontSize: isMobile ? '10px' : '11px' }}
              onClick={() => setFilter(f.value)}>
              {isMobile && f.value !== 'ALL' ? f.label.slice(0, 3) : f.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div style={css.emptyState}>
          <div style={css.emptyStateTitle}>No expenses here</div>
          <div style={css.emptyStateHint}>Add your first expense using the button above.</div>
        </div>
      ) : (
        visible.map(e => (
          <ExpenseCard key={e.expenseId} expense={e}
            onEdit={onEdit} onDelete={onDelete} onRecon={onRecon} isMobile={isMobile} />
        ))
      )}
    </>
  );
}
