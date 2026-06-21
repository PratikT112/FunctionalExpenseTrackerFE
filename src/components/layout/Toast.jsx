import { useEffect } from 'react';
import { T } from '../../styles/tokens';

export function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: T.surfaceRaised,
        border: `1px solid ${T.border}`,
        borderRadius: '8px',
        padding: '12px 18px',
        fontSize: '13px',
        color: T.text,
        zIndex: 2000,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      {message}
    </div>
  );
}
