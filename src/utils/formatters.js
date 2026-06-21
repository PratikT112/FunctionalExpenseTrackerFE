export const formatINR = (n) =>
  `₹${Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export const getCategoryName = (id, cats) =>
  cats.find((c) => c.categoryId === id)?.categoryName || '—';

export const getPaymentName = (id, pms) =>
  pms.find((p) => p.paymentId === id)?.paymentName || '—';

export const genId = () => Math.random().toString(36).slice(2, 10);

export const today = new Date();

export const fmt = (d) => d.toISOString().split('T')[0];

export const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return fmt(d);
};
