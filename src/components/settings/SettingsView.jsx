import { useState } from 'react';
import { css, T } from '../../styles/tokens';
import { CategoryFormModal } from '../modals/CategoryFormModal';
import { PaymentMethodFormModal } from '../modals/PaymentMethodFormModal';

export function SettingsView({
  categories,
  paymentMethods,
  onAddCategory,
  onDeleteCategory,
  onAddPayment,
  onDeletePayment,
  isMobile,
}) {
  const [tab, setTab] = useState('categories');
  const [showCatModal, setShowCatModal] = useState(false);
  const [showPmModal,  setShowPmModal]  = useState(false);

  return (
    <div>
      {showCatModal && (
        <CategoryFormModal
          categories={categories}
          onSave={onAddCategory}
          onClose={() => setShowCatModal(false)}
          isMobile={isMobile}
        />
      )}
      {showPmModal && (
        <PaymentMethodFormModal
          onSave={onAddPayment}
          onClose={() => setShowPmModal(false)}
          isMobile={isMobile}
        />
      )}

      <div style={css.tabBar}>
        <button style={css.tab(tab === 'categories')} onClick={() => setTab('categories')}>
          Categories
        </button>
        <button style={css.tab(tab === 'payments')} onClick={() => setTab('payments')}>
          Payment methods
        </button>
      </div>

      {tab === 'categories' && (
        <div>
          <div style={css.sectionHeader}>
            <div style={css.sectionTitle}>Categories</div>
            <button style={css.btnPrimary} onClick={() => setShowCatModal(true)}>
              + New
            </button>
          </div>
          {categories.map((c) => (
            <div key={c.categoryId} style={{ ...css.expenseCard, alignItems: 'center' }}>
              <div style={css.expenseLeft}>
                <div style={{ fontSize: '13px', color: T.text }}>{c.categoryName}</div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                  {c.isDefaultCategory && <span style={css.chip(T.accent + '22', T.accent)}>Default</span>}
                  <span style={css.chip(T.surfaceRaised, c.categoryStatus === 'active' ? T.success : T.danger)}>
                    {c.categoryStatus}
                  </span>
                </div>
              </div>
              {!c.isDefaultCategory && (
                <button style={css.btnDanger} onClick={() => onDeleteCategory(c.categoryId)}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'payments' && (
        <div>
          <div style={css.sectionHeader}>
            <div style={css.sectionTitle}>Payment methods</div>
            <button style={css.btnPrimary} onClick={() => setShowPmModal(true)}>
              + New
            </button>
          </div>
          {paymentMethods.map((p) => (
            <div key={p.paymentId} style={{ ...css.expenseCard, alignItems: 'center' }}>
              <div style={css.expenseLeft}>
                <div style={{ fontSize: '13px', color: T.text }}>{p.paymentName}</div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                  <span style={css.chip(T.surfaceRaised, T.textMuted)}>{p.type.replace('_', ' ')}</span>
                  <span style={css.chip(T.surfaceRaised, p.paymentMethodStatus === 'active' ? T.success : T.danger)}>
                    {p.paymentMethodStatus}
                  </span>
                </div>
              </div>
              <button style={css.btnDanger} onClick={() => onDeletePayment(p.paymentId)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
