import { css } from '../../styles/tokens';
import { ExpenseOverview } from './ExpenseOverview';
import { ExpenseList }     from './ExpenseList';

export function ExpensesView({ activeExpenses, stats, onEdit, onDelete, onRecon, isMobile, isLoading }) {
  return (
    <div style={{ ...css.content, padding: isMobile ? '16px 14px' : '24px 28px', paddingBottom: isMobile ? '80px' : '24px' }}>
      <ExpenseOverview stats={stats} activeExpenses={activeExpenses} isMobile={isMobile} />
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '32px', color: '#4A4845', fontSize: '13px' }}>
          Loading expenses...
        </div>
      ) : (
        <ExpenseList
          activeExpenses={activeExpenses}
          onEdit={onEdit} onDelete={onDelete} onRecon={onRecon}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}
