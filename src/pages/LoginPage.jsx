import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { T } from '../styles/tokens';

export function LoginPage({ onSuccess }) {
  const { login, register } = useAuth();
  const [tab, setTab]         = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]     = useState('');

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // Register form state
  const [regForm, setRegForm] = useState({ username: '', email: '', password: '', confirm: '' });

  const setLogin = (k, v) => setLoginForm(f => ({ ...f, [k]: v }));
  const setReg   = (k, v) => setRegForm(f => ({ ...f, [k]: v }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regForm.password !== regForm.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (regForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register(regForm.username, regForm.email, regForm.password);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    backgroundColor: T.surfaceRaised,
    border: `1px solid ${T.border}`,
    borderRadius: '7px',
    color: T.text,
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Inter', sans-serif",
    marginBottom: '12px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    color: T.textMuted,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: '6px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: T.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '28px',
            fontWeight: '500',
            color: T.accent,
            letterSpacing: '0.08em',
          }}>
            SPNDX
          </div>
          <div style={{ fontSize: '12px', color: T.textMuted, marginTop: '4px', letterSpacing: '0.04em' }}>
            expense tracker
          </div>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: T.surface,
          border: `1px solid ${T.border}`,
          borderRadius: '12px',
          padding: '28px 28px 24px',
        }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${T.border}`,
            marginBottom: '24px',
          }}>
            {[
              { id: 'login',    label: 'Sign in' },
              { id: 'register', label: 'Create account' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setError(''); }}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontSize: '13px',
                  fontWeight: tab === t.id ? '600' : '400',
                  color: tab === t.id ? T.accent : T.textMuted,
                  background: 'none',
                  border: 'none',
                  borderBottom: tab === t.id ? `2px solid ${T.accent}` : '2px solid transparent',
                  marginBottom: '-1px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: T.dangerDim,
              border: `1px solid ${T.danger}`,
              borderRadius: '6px',
              padding: '10px 14px',
              fontSize: '12px',
              color: T.danger,
              marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  value={loginForm.email}
                  onChange={e => setLogin('email', e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  style={inputStyle}
                  type="password"
                  value={loginForm.password}
                  onChange={e => setLogin('password', e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '4px',
                  backgroundColor: isLoading ? T.accentDim : T.accent,
                  color: '#0F0F0F',
                  border: 'none',
                  borderRadius: '7px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={regForm.username}
                  onChange={e => setReg('username', e.target.value)}
                  placeholder="pratik"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  value={regForm.email}
                  onChange={e => setReg('email', e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  style={inputStyle}
                  type="password"
                  value={regForm.password}
                  onChange={e => setReg('password', e.target.value)}
                  placeholder="Min 6 characters"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm password</label>
                <input
                  style={{ ...inputStyle, marginBottom: 0 }}
                  type="password"
                  value={regForm.confirm}
                  onChange={e => setReg('confirm', e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '16px',
                  backgroundColor: isLoading ? T.accentDim : T.accent,
                  color: '#0F0F0F',
                  border: 'none',
                  borderRadius: '7px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '11px', color: T.textFaint }}>
          Your data is scoped to your account only.
        </div>
      </div>
    </div>
  );
}
