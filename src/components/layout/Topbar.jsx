import { css, T } from '../../styles/tokens';

export function Topbar({ nav, activeCount, monthLabel, onAddExpense, onPrevMonth, onNextMonth, isCurrentMonth, isMobile, user, onLogout }) {
  const titles = { expenses: 'Expenses', analytics: 'Analytics', settings: 'Settings' };

  return (
    <div style={{ ...css.topbar, padding: isMobile ? '12px 16px' : '16px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {isMobile && (
          <div style={{ ...css.userAvatar, flexShrink: 0 }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <div>
          <div style={{ ...css.pageTitle, fontSize: isMobile ? '15px' : '16px' }}>{titles[nav]}</div>
          {nav === 'expenses' ? (
            /* Month navigator */
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <button onClick={onPrevMonth} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer', fontSize: '12px', padding: '0 2px', lineHeight: 1 }}>‹</button>
              <span style={{ fontSize: '11px', color: T.textMuted, fontFamily: "'DM Mono', monospace" }}>{monthLabel}</span>
              <button onClick={onNextMonth} style={{ background: 'none', border: 'none', color: isCurrentMonth ? T.textFaint : T.textMuted, cursor: isCurrentMonth ? 'default' : 'pointer', fontSize: '12px', padding: '0 2px', lineHeight: 1, opacity: isCurrentMonth ? 0.3 : 1 }} disabled={isCurrentMonth}>›</button>
              <span style={{ fontSize: '10px', color: T.textFaint, marginLeft: '2px' }}>· {activeCount} entries</span>
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '1px' }}>
              {nav === 'analytics' ? 'Spend breakdown' : 'Categories & methods'}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {nav === 'expenses' && (
          <button style={{ ...css.btnPrimary, padding: isMobile ? '7px 12px' : '8px 16px', fontSize: '12px' }} onClick={onAddExpense}>
            {isMobile ? '+ Add' : '+ Add expense'}
          </button>
        )}
        {!isMobile && (
          <button onClick={onLogout} style={{ ...css.btnGhost, fontSize: '11px', padding: '6px 10px' }}>
            Sign out
          </button>
        )}
      </div>
    </div>
  );
}
