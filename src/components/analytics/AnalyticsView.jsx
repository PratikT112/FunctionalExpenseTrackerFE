import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { css, T } from '../../styles/tokens';
import { formatINR } from '../../utils/formatters';

const CHART_COLORS = [
  T.accent, '#5CB88A', '#7B8DE0', '#E0875C',
  '#C07BE0', '#5CB8C0', '#E0C05C', '#E07BA0',
];

const tooltipStyle = {
  backgroundColor: T.surfaceRaised,
  border: `1px solid ${T.border}`,
  borderRadius: '6px',
  color: T.text,
  fontSize: '12px',
};

export function AnalyticsView({ expenses, categories, isMobile }) {
  const active = expenses.filter((e) => !e.isDeleted);

  const byCat = categories
    .map((c) => ({
      name: c.categoryName,
      value: active
        .filter((e) => e.expenseCategory === c.categoryId)
        .reduce((s, e) => s + e.netExpenseAmount, 0),
    }))
    .filter((c) => c.value > 0)
    .sort((a, b) => b.value - a.value);

  const byDay = (() => {
    const map = {};
    active.forEach((e) => {
      map[e.expenseDate] = (map[e.expenseDate] || 0) + e.netExpenseAmount;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, value]) => ({ date: date.slice(5), value }));
  })();

  return (
    // Always single-column stack — cleaner on both mobile and desktop for charts
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Category breakdown */}
      <div style={{ ...css.summaryCard, padding: isMobile ? '16px' : '24px 28px' }}>
        <div style={css.bigNumberLabel}>Spend by category</div>
        <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
          <PieChart>
            <Pie data={byCat} cx="50%" cy="50%" outerRadius={isMobile ? 65 : 80} dataKey="value" nameKey="name">
              {byCat.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatINR(v)} contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '8px' }}>
          {byCat.slice(0, 6).map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 0',
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '2px',
                    flexShrink: 0,
                    backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                />
                <span style={{ fontSize: '12px', color: T.text }}>{c.name}</span>
              </div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: T.textMuted }}>
                {formatINR(c.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily spend bar chart */}
      <div style={{ ...css.summaryCard, padding: isMobile ? '16px' : '24px 28px' }}>
        <div style={css.bigNumberLabel}>Daily spend (last 14 days)</div>
        <ResponsiveContainer width="100%" height={isMobile ? 160 : 220}>
          <BarChart
            data={byDay}
            margin={{ top: 5, right: 5, left: isMobile ? -28 : -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis
              dataKey="date"
              tick={{ fill: T.textMuted, fontSize: isMobile ? 9 : 10 }}
              interval={isMobile ? 2 : 0}
            />
            <YAxis
              tick={{ fill: T.textMuted, fontSize: isMobile ? 9 : 10 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip formatter={(v) => formatINR(v)} contentStyle={tooltipStyle} />
            <Bar dataKey="value" fill={T.accent} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Personal vs Family */}
      <div style={{ ...css.summaryCard, padding: isMobile ? '16px' : '24px 28px' }}>
        <div style={css.bigNumberLabel}>By expense type</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
          {['PERSONAL', 'FAMILY'].map((type) => {
            const total = active
              .filter((e) => e.expenseType === type)
              .reduce((s, e) => s + e.netExpenseAmount, 0);
            const count = active.filter((e) => e.expenseType === type).length;
            return (
              <div key={type} style={css.statCard}>
                <div style={{ fontSize: '10px', color: T.type, marginBottom: '6px', letterSpacing: '0.06em' }}>
                  {type === 'PERSONAL' ? '○ Personal' : '◎ Family'}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: isMobile ? '16px' : '18px', color: T.text }}>
                  {formatINR(total)}
                </div>
                <div style={{ fontSize: '11px', color: T.textMuted, marginTop: '3px' }}>
                  {count} {count === 1 ? 'expense' : 'expenses'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
