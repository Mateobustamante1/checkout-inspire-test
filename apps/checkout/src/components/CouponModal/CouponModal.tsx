import { useState, useEffect } from 'react';
import { Button, Input } from '@inspire/core-components';
import { getAvailableCoupons, validateCoupon, type Coupon } from '../../services/api';
import { useCheckoutStore } from '../../store/checkoutStore';
import { checkoutLogger } from '../../services/logger';
import './CouponModal.scss';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CouponModal = ({ isOpen, onClose }: CouponModalProps) => {
  const [couponCode, setCouponCode] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoadingList, setIsLoadingList] = useState(true);
  
  const { applyDiscount, getSubtotal } = useCheckoutStore();

  useEffect(() => {
    if (isOpen) {
      loadCoupons();
    }
  }, [isOpen]);

  const loadCoupons = async () => {
    setIsLoadingList(true);
    try {
      const coupons = await getAvailableCoupons();
      setAvailableCoupons(coupons);
    } catch (error) {
      console.error('Error loading coupons:', error);
    } finally {
      setIsLoadingList(false);
    }
  };

  const handleApplyCoupon = async (code: string) => {
    setIsLoading(true);
    setError('');

    try {
      const subtotal = getSubtotal();
      const coupon = await validateCoupon(code, subtotal);
      
      // Calcular el monto del descuento
      const discountAmount = Math.round((subtotal * coupon.discount) / 100);
      
      // Aplicar descuento en el store
      applyDiscount(coupon.code, discountAmount);
      
      // Cerrar modal
      onClose();
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao aplicar cupom';
      setError(errorMessage);

      checkoutLogger.couponError(code, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      handleApplyCoupon(couponCode.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="coupon-modal-overlay" onClick={onClose}>
      <div className="coupon-modal" onClick={(e) => e.stopPropagation()}>
        <div className="coupon-modal__header">
          <h2 className="coupon-modal__title">Cupons de desconto</h2>
          <button
            className="coupon-modal__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="coupon-modal__body">
          <form onSubmit={handleSubmit} className="coupon-modal__form">
            <Input
              label="Código do cupom"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setError('');
              }}
              error={error}
              placeholder=""
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="md"
              isLoading={isLoading}
              disabled={!couponCode.trim() || isLoading}
            >
              Aplicar
            </Button>
          </form>

          <div className="coupon-modal__divider">
            <span>ou escolha um cupom</span>
          </div>

          <div className="coupon-modal__list">
            {isLoadingList ? (
              <div className="coupon-modal__loading">
                <div className="spinner" />
                <p>Carregando cupons...</p>
              </div>
            ) : (
              availableCoupons.map((coupon) => (
                <button
                  key={coupon.code}
                  className="coupon-card"
                  onClick={() => handleApplyCoupon(coupon.code)}
                  disabled={isLoading}
                >
                  <div className="coupon-card__badge">
                    {coupon.discount}% OFF
                  </div>
                  <div className="coupon-card__content">
                    <div className="coupon-card__code">{coupon.code}</div>
                    <div className="coupon-card__description">
                      {coupon.description}
                    </div>
                    {coupon.minPurchase && coupon.minPurchase > 0 && (
                      <div className="coupon-card__min">
                        Compra mínima: R$ {(coupon.minPurchase / 100).toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div className="coupon-card__arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="9 18 15 12 9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
