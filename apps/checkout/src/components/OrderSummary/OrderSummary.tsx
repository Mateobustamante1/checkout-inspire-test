import { useState } from 'react';
import { useCheckoutStore, useCheckoutSelectors } from '../../store/checkoutStore';
import { formatCurrency } from '../../utils/formatters';
import { CouponModal } from '../CouponModal';
import './OrderSummary.scss';

/**
 * OrderSummary - Displays cart summary
 * 
 * Architecture:
 * - Sticky positioning for visibility during scroll
 * - Zustand selectors for granular re-renders
 */
export const OrderSummary = () => {
  const [showCouponModal, setShowCouponModal] = useState(false);
  
  const products = useCheckoutStore((state) => state.products);
  const discountCode = useCheckoutStore((state) => state.discountCode);
  const discountAmount = useCheckoutStore((state) => state.discountAmount);
  const removeDiscount = useCheckoutStore((state) => state.removeDiscount);
  const { subtotal, shipping, total } = useCheckoutSelectors();

  return (
    <aside className="order-summary">
      {/* Products */}
      <div className="order-summary__products">
        {products.map((product) => (
          <div key={product.id} className="order-summary__product">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="order-summary__product-image"
            />
            <div className="order-summary__product-info">
              <h4 className="order-summary__product-name">{product.name}</h4>
              <p className="order-summary__product-price">
                {formatCurrency(product.price)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="order-summary__pricing">
        <div className="order-summary__line">
          <span className="order-summary__label">Subtotal</span>
          <span className="order-summary__value">{formatCurrency(subtotal)}</span>
        </div>

        <div className="order-summary__line">
          <span className="order-summary__label">Frete</span>
          <span className="order-summary__value">
            {shipping === 0 ? 'Grátis' : formatCurrency(shipping)}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="order-summary__line order-summary__line--discount">
            <span className="order-summary__label">
              Desconto {discountCode && `(${discountCode})`}
            </span>
            <span className="order-summary__value">
              -{formatCurrency(discountAmount)}
            </span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="order-summary__total">
        <span className="order-summary__total-label">Total</span>
        <span className="order-summary__total-value">
          {formatCurrency(total)}
        </span>
      </div>

      {/* Discount Button */}
      <div className="order-summary__discount">
        {discountCode ? (
          <div className="order-summary__discount-applied">
            <div className="order-summary__discount-info">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span>Cupom <strong>{discountCode}</strong> aplicado</span>
            </div>
            <button
              type="button"
              className="order-summary__discount-remove"
              onClick={removeDiscount}
              aria-label="Remover cupom"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="order-summary__discount-button"
            onClick={() => setShowCouponModal(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            Adicionar cupom de desconto
          </button>
        )}
      </div>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
      />
    </aside>
  );
};

