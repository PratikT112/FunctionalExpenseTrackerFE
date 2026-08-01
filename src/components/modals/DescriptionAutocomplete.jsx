import { useState, useEffect, useRef } from 'react';
import { T } from '../../styles/tokens';

/**
 * DescriptionAutocomplete
 *
 * Wraps the description text input with a live suggestion dropdown.
 * Suggestions are derived from the user's past expenses — no API call.
 *
 * Props:
 *   value          string   — controlled input value
 *   onChange       fn       — called with the new string as the user types
 *   onSelect       fn       — called with the full past expense object when
 *                             the user picks a suggestion; parent auto-fills
 *                             paymentMethod, necessity, expenseType, categoryName
 *   pastExpenses   array    — activeExpenses from useExpenses hook
 *   isMobile       boolean
 *   inputStyle     object   — style object forwarded to the <input>
 *   placeholder    string
 */
export function DescriptionAutocomplete({
  value,
  onChange,
  onSelect,
  pastExpenses = [],
  isMobile,
  inputStyle = {},
  placeholder = 'What was this for?',
}) {
  const [open,        setOpen]        = useState(false);
  const [highlighted, setHighlighted] = useState(-1);   // keyboard nav index
  const inputRef  = useRef(null);
  const listRef   = useRef(null);
  const wrapRef   = useRef(null);

  // ── Build deduplicated suggestion list ─────────────────────────────────────
  // Keep only the most recent expense per unique description (case-insensitive).
  // Filter to descriptions that start with the current input value.
  // Show max 6 suggestions — more than that is noise on a phone screen.
  const suggestions = (() => {
    const q = value.trim().toLowerCase();
    if (q.length < 2) return [];                          // don't suggest on 0-1 chars

    const seen = new Map();                               // description → expense object
    // pastExpenses are already sorted newest-first from the hook
    pastExpenses.forEach(e => {
      const key = e.expenseDescription.toLowerCase();
      if (!seen.has(key)) seen.set(key, e);              // first occurrence = most recent
    });

    return [...seen.values()]
      .filter(e => e.expenseDescription.toLowerCase().startsWith(q))
      .slice(0, 6);
  })();

  // Open the dropdown whenever there are suggestions and the input is non-empty
  useEffect(() => {
    setOpen(suggestions.length > 0 && value.trim().length >= 2);
    setHighlighted(-1);
  }, [suggestions.length, value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll highlighted row into view
  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const row = listRef.current.children[highlighted];
      row?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted]);

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlighted >= 0) {
      e.preventDefault();
      pick(suggestions[highlighted]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlighted(-1);
    }
  };

  const pick = (expense) => {
    onChange(expense.expenseDescription);    // fill in the full description text
    onSelect(expense);                       // parent fills other fields
    setOpen(false);
    setHighlighted(-1);
    inputRef.current?.blur();
  };

  // ── Highlight the matching prefix in the suggestion label ──────────────────
  const renderLabel = (description) => {
    const matchLen = value.trim().length;
    const matched  = description.slice(0, matchLen);
    const rest     = description.slice(matchLen);
    return (
      <>
        <span style={{ color: T.accent, fontWeight: '600' }}>{matched}</span>
        <span>{rest}</span>
      </>
    );
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <input
        ref={inputRef}
        style={{ ...inputStyle }}
        type="text"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0 && value.trim().length >= 2) setOpen(true);
        }}
      />

      {open && (
        <div
          ref={listRef}
          style={{
            position:        'absolute',
            top:             'calc(100% + 4px)',
            left:            0,
            right:           0,
            backgroundColor: T.surfaceRaised,
            border:          `1px solid ${T.borderLight}`,
            borderRadius:    '8px',
            zIndex:          200,
            overflow:        'hidden',
            boxShadow:       '0 8px 24px rgba(0,0,0,0.45)',
          }}
        >
          {suggestions.map((exp, i) => {
            const isHighlighted = i === highlighted;
            return (
              <div
                key={exp.expenseId}
                onMouseDown={() => pick(exp)}           // mousedown fires before blur
                onMouseEnter={() => setHighlighted(i)}
                style={{
                  padding:         '10px 14px',
                  borderBottom:    i < suggestions.length - 1 ? `1px solid ${T.border}` : 'none',
                  backgroundColor: isHighlighted ? T.border : 'transparent',
                  cursor:          'pointer',
                  transition:      'background-color 0.1s',
                }}
              >
                {/* Description with matched prefix highlighted */}
                <div style={{ fontSize: '13px', color: T.text, marginBottom: '4px' }}>
                  {renderLabel(exp.expenseDescription)}
                </div>

                {/* Meta chips — payment method, category, necessity, type */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {exp.categoryName && (
                    <span style={chipStyle(T.surfaceRaised, T.textMuted)}>
                      {exp.categoryName}
                    </span>
                  )}
                  {exp.paymentMethodName && (
                    <span style={chipStyle(T.surfaceRaised, T.textMuted)}>
                      {exp.paymentMethodName}
                    </span>
                  )}
                  <span style={chipStyle(
                    exp.expenseNecessity === 'NECESSARY' ? T.accentDim + '55' : T.dangerDim,
                    exp.expenseNecessity === 'NECESSARY' ? T.accent       : T.danger,
                  )}>
                    {exp.expenseNecessity === 'NECESSARY' ? 'Necessary' : 'Unnecessary'}
                  </span>
                  <span style={chipStyle(T.typeDim, T.type)}>
                    {exp.expenseType === 'FAMILY' ? '◎ Family' : '○ Personal'}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Subtle keyboard hint at the bottom — only on desktop */}
          {!isMobile && (
            <div style={{
              padding:         '6px 14px',
              fontSize:        '10px',
              color:           T.textFaint,
              borderTop:       `1px solid ${T.border}`,
              display:         'flex',
              gap:             '10px',
            }}>
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc dismiss</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Shared chip style — same shape as ExpenseCard chips
function chipStyle(bg, color) {
  return {
    fontSize:        '10px',
    padding:         '2px 7px',
    borderRadius:    '3px',
    backgroundColor: bg,
    color:           color,
    letterSpacing:   '0.04em',
    fontWeight:      '500',
  };
}
