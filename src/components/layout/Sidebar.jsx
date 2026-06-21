import { css, T } from '../../styles/tokens';

const NAV_ITEMS = [
  { id: 'expenses',  label: 'Expenses',  icon: '◈' },
  { id: 'analytics', label: 'Analytics', icon: '◉' },
  { id: 'settings',  label: 'Settings',  icon: '◎' },
];

export function Sidebar({ nav, onNav, user, onLogout }) {
  return (
    <aside style={css.sidebar}>
      <div style={css.sidebarHeader}>
        <div style={css.logo}>SPNDX</div>
        <div style={css.logoSub}>expense tracker</div>
      </div>

      <div style={css.navSection}>
        <div style={css.navLabel}>Menu</div>
        {NAV_ITEMS.map(item => (
          <div key={item.id} style={css.navItem(nav === item.id)} onClick={() => onNav(item.id)}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '14px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={css.sidebarFooter}>
        <div style={css.userChip}>
          <div style={css.userAvatar}>{user?.username?.[0]?.toUpperCase() || 'U'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '500', color: T.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.username || 'User'}
            </div>
            <div style={{ fontSize: '10px', color: T.textMuted }}>{user?.role?.toLowerCase() || 'user'}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ ...css.btnGhost, width: '100%', marginTop: '8px', fontSize: '11px', textAlign: 'center' }}>
          Sign out
        </button>
      </div>
    </aside>
  );
}

export function BottomNav({ nav, onNav }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: '60px',
      backgroundColor: T.surface, borderTop: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'stretch', zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {NAV_ITEMS.map(item => {
        const active = nav === item.id;
        return (
          <div key={item.id} onClick={() => onNav(item.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '3px', cursor: 'pointer',
            color: active ? T.accent : T.textMuted,
            borderTop: active ? `2px solid ${T.accent}` : '2px solid transparent',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '16px' }}>{item.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: active ? '600' : '400', letterSpacing: '0.03em' }}>{item.label}</span>
          </div>
        );
      })}
    </nav>
  );
}
