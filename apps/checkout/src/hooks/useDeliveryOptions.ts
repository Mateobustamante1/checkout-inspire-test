import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchDeliveryOptions } from '../services/api';
import { useCheckoutStore } from '../store/checkoutStore';
import type { DeliveryOption } from '../types';

/**
 * Custom Hook: Delivery options logic
 * 
 * Architecture:
 * - Separates delivery logic from UI
 * - Memoized callbacks and computed values
 * - Cleanup to prevent memory leaks
 */
export const useDeliveryOptions = () => {
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { delivery, selectDelivery } = useCheckoutStore();

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const options = await fetchDeliveryOptions();
        if (isMounted) {
          setDeliveryOptions(options);
        }
      } catch (err) {
        if (isMounted) {
          setError('Erro ao carregar opções de entrega');
          console.error('Error loading delivery options:', err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = useCallback((option: DeliveryOption) => {
    selectDelivery(option);
  }, [selectDelivery]);

  const toggleShowAll = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  const firstOption = useMemo(
    () => deliveryOptions[0] || null,
    [deliveryOptions]
  );

  const additionalOptions = useMemo(
    () => deliveryOptions.slice(1),
    [deliveryOptions]
  );

  const hasMoreOptions = useMemo(
    () => additionalOptions.length > 0,
    [additionalOptions]
  );

  return {
    firstOption,
    additionalOptions,
    selectedDelivery: delivery,
    showAll,
    isLoading,
    error,
    hasMoreOptions,
    handleSelect,
    toggleShowAll,
  };
};
