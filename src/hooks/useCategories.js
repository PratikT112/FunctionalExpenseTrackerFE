import { useState, useCallback } from 'react';
import { categoriesApi } from '../api/resources';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading,  setIsLoading]  = useState(false);

  const mapCategory = (c) => ({
    categoryId:       c.categoryId,
    categoryName:     c.categoryName,
    isDefaultCategory: c.defaultCategory,
    categoryStatus:   c.status?.toLowerCase() || 'active',
  });

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories((data || []).map(mapCategory));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (name) => {
    const created = await categoriesApi.create(name);
    const mapped  = mapCategory(created);
    setCategories(prev => [...prev, mapped]);
    return mapped;
  }, []);

  const deleteCategory = useCallback(async (categoryId) => {
    await categoriesApi.delete(categoryId);
    setCategories(prev => prev.filter(c => c.categoryId !== categoryId));
  }, []);

  return { categories, isLoading, loadCategories, addCategory, deleteCategory };
}
