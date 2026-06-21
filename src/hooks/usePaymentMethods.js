import { useState, useCallback } from 'react';
import { paymentMethodsApi } from '../api/resources';

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading,      setIsLoading]      = useState(false);

  const mapPm = (p) => ({
    paymentId:           p.paymentId,
    paymentName:         p.paymentName,
    type:                p.type,
    paymentMethodStatus: p.active ? 'active' : 'inactive',
  });

  const loadPaymentMethods = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await paymentMethodsApi.getAll();
      setPaymentMethods((data || []).map(mapPm));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addPaymentMethod = useCallback(async ({ paymentName, type }) => {
    const created = await paymentMethodsApi.create(paymentName, type);
    const mapped  = mapPm(created);
    setPaymentMethods(prev => [...prev, mapped]);
    return mapped;
  }, []);

  const deletePaymentMethod = useCallback(async (paymentId) => {
    await paymentMethodsApi.delete(paymentId);
    setPaymentMethods(prev => prev.filter(p => p.paymentId !== paymentId));
  }, []);

  return { paymentMethods, isLoading, loadPaymentMethods, addPaymentMethod, deletePaymentMethod };
}
