import { useState } from 'react';
import { css, T } from '../../styles/tokens';
import { formatINR } from '../../utils/formatters';
import { AnimatedNumber } from './AnimatedNumber';

export function ExpenseOverview({ stats, activeExpenses, isMobile }) {
  const [expanded, setExpanded] = useState(false);
  const { totalSpend, necessarySpend, unnecessarySpend, reconSaved, necPct } = stats;
  
  return (
    <div
      style={{
        ...css.summaryCard,
        padding: isMobile ? '16px 18px' : '24px 28px',
      }}
    >
      <div onClick={() => setExpanded((v) => !v)} style={{ cursor: 'pointer' }}>
        <div style={css.bigNumberLabel}>Total this month</div>
        <div style={{ ...css.bigNumber, fontSize: isMobile ? '32px' : '42px' }}>
          <AnimatedNumber value={totalSpend} />
        </div>

        {reconSaved > 0 && (
          <div style={{ fontSize: '11px', color: T.success, marginTop: '6px' }}>
            ↓ {formatINR(reconSaved)} recovered via reconciliation
          </div>
        )}

        <div style={css.splitBar}>
          <div
            style={{
              width: `${necPct}%`,
              backgroundColor: T.necessary,
              transition: 'width 0.6s ease',
            }}
          />
          <div style={{ width: `${100 - necPct}%`, backgroundColor: T.unnecessary }} />
        </div>
        <div style={css.splitLabels}>
          <div style={css.splitLabel(T.necessary)}>
            <span style={css.badge(T.necessary)} />
            {isMobile ? formatINR(necessarySpend) : `Necessary · ${formatINR(necessarySpend)} (${necPct.toFixed(2)}%)`}
          </div>
          <div style={css.splitLabel(T.unnecessary)}>
            <span style={css.badge(T.unnecessary)} />
            {isMobile ? formatINR(unnecessarySpend) : `Unnecessary · ${formatINR(unnecessarySpend)} (${(100-necPct).toFixed(2)}%)`}
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${T.border}` }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
              gap: isMobile ? '8px' : '12px',
            }}
          >
            <div style={css.statCard}>
              <div style={{ ...css.statValue, fontSize: isMobile ? '16px' : '20px' }}>
                {activeExpenses.length}
              </div>
              <div style={css.statLabel}>Total</div>
            </div>
            <div style={css.statCard}>
              <div style={{ ...css.statValue, fontSize: isMobile ? '14px' : '20px' }}>
                {formatINR(totalSpend / (activeExpenses.length || 1))}
              </div>
              <div style={css.statLabel}>Avg</div>
            </div>
            <div style={css.statCard}>
              <div style={{ ...css.statValue, fontSize: isMobile ? '16px' : '20px' }}>
                {activeExpenses.filter((e) => e.reconciledAmount > 0).length}
              </div>
              <div style={css.statLabel}>Recon</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
