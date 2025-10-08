import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Button,
  SecureInput,
  Input,
  Checkbox,
  Header,
  CustomSelect,
} from '@inspire/core-components';
import { useCheckoutStore } from '../../store/checkoutStore';
import { useCheckoutForm, useDeliveryOptions } from '../../hooks';
import { COUNTRY_OPTIONS, ANIMATION } from '../../constants';
import { checkoutWordings } from '../../wordings';
import { checkoutLogger, sanitizePII } from '../../services/logger';
import { OrderSummary } from '../../components/OrderSummary';
import { CEPModal } from '../../components/CEPModal';
import './CheckoutPage.scss';

/**
 * CheckoutPage - Main checkout form
 * 
 * Architecture:
 * - Custom hooks for form logic (useCheckoutForm, useDeliveryOptions)
 * - Memoized handlers to prevent unnecessary re-renders
 * - Centralized validation and state management via Zustand
 * - Observability via logger service
 */

export const CheckoutPage = () => {
  const w = checkoutWordings;
  
  const form = useCheckoutForm();
  const delivery = useDeliveryOptions();
  
  const { loadProducts, updatePayer, updateFiscal, products, getTotal, getSubtotal, getShipping, discountAmount, discountCode } = useCheckoutStore();
  
  const [showPickupPersonFields, setShowPickupPersonFields] = useState(false);
  const [showCEPModal, setShowCEPModal] = useState(false);
  
  // Track page load time for analytics
  const pageLoadTimeRef = useRef<number>(Date.now());
  
  useEffect(() => {
    loadProducts().then(() => {
      checkoutLogger.started({
        productsCount: products.length,
      });
    });
  }, [loadProducts]);
  
  const handlePickupPersonToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setShowPickupPersonFields(checked);
    updatePayer({ isAnotherPersonPickup: checked });
  }, [updatePayer]);

  const handleClearAddressAndOpenModal = useCallback(() => {
    form.handleClearAddress();
    setShowCEPModal(true);
  }, [form]);

  const handleSelectCEP = useCallback(async (cep: string) => {
    await form.handleSelectCEP(cep);
    setShowCEPModal(false);
  }, [form]);

  /**
   * Critical logging point: logs complete checkout payload
   * Sanitizes PII before logging for LGPD/GDPR compliance
   */
  const handleCheckoutSubmit = useCallback(async (e: React.FormEvent) => {
    const timeOnPage = Math.floor((Date.now() - pageLoadTimeRef.current) / 1000);
    const emailDomain = form.contact.email.split('@')[1] || 'unknown';
    const cepRegion = form.payer.address?.cep 
      ? sanitizePII.cep(form.payer.address.cep) 
      : 'unknown';

    checkoutLogger.submitted({
      subtotal: getSubtotal(),
      shipping: getShipping(),
      discount: discountAmount,
      total: getTotal(),
      itemsCount: products.length,
      deliveryOption: form.delivery?.name || 'unknown',
      hasCoupon: !!discountCode,
      couponCode: discountCode || undefined,
      emailDomain,
      cepRegion,
      timeOnPage,
    });

    await form.handleSubmit(e);
  }, [
    form,
    products.length,
    getSubtotal,
    getShipping,
    getTotal,
    discountAmount,
    discountCode,
    pageLoadTimeRef,
  ]);
  
  const isSubmitting = form.formState.status === 'submitting';
  const hasAddress = Boolean(
    form.payer.address?.street &&
    form.payer.address?.city &&
    !form.cepError
  );
  
  return (
    <div className="checkout-page">
      {/* Header */}
      <Header logoText="Inspire" showSecurityBadge />

      <div className="checkout-page__container">
        {/* Breadcrumb */}
        <nav className="checkout-page__breadcrumb">
          <span className="breadcrumb-item active">{w.breadcrumb.delivery}</span>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-item">{w.breadcrumb.payment}</span>
        </nav>

        <div className="checkout-page__content">
          {/* Form */}
          <form className="checkout-page__form" onSubmit={handleCheckoutSubmit} noValidate>
            
            <section className="checkout-section checkout-section--contact">
              <h2 className="checkout-section__title">{w.sections.contact}</h2>
              
              <SecureInput
                ref={form.refs.emailRef}
                type="email"
                label={w.fields.email}
                defaultValue={form.contact.email}
                onValueChange={form.handleEmailChange}
                error={form.attemptedSubmit && !form.contact.email ? w.messages.requiredField : undefined}
                successMessage={
                  form.contact.email && form.successCheckers.isEmailValid(form.contact.email)
                    ? 'valid'
                    : undefined
                }
                validator={form.validators.emailValidator}
              />
              
              <Checkbox
                label={w.fields.newsletter}
                checked={form.contact.receiveNewsletter}
                onChange={form.handleNewsletterChange}
              />
            </section>

            <section className="checkout-section checkout-section--delivery">
              <h2 className="checkout-section__title">{w.sections.delivery}</h2>
              
              {delivery.isLoading ? (
                <div>{w.delivery.loading}</div>
              ) : delivery.error ? (
                <div className="error">{delivery.error}</div>
              ) : (
                <div className="delivery-options">
                  {delivery.firstOption && (
                    <label
                      className={`delivery-option ${
                        delivery.selectedDelivery?.id === delivery.firstOption.id
                          ? 'delivery-option--selected'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={delivery.firstOption.id}
                        checked={delivery.selectedDelivery?.id === delivery.firstOption.id}
                        onChange={() => delivery.handleSelect(delivery.firstOption!)}
                      />
                      <div className="delivery-option__content">
                        <div className="delivery-option__info">
                          <strong>{delivery.firstOption.name}</strong>
                          <span>{delivery.firstOption.address}</span>
                        </div>
                        <div className="delivery-option__price">
                          {delivery.firstOption.isFree ? (
                            <span className="delivery-option__free">{w.delivery.free}</span>
                          ) : (
                            <span>R$ {(delivery.firstOption.price / 100).toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </label>
                  )}

                  {/* Opciones adicionales (animadas) */}
                  <AnimatePresence>
                    {delivery.showAll && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: ANIMATION.DURATION, ease: ANIMATION.EASING }}
                        style={{ overflow: 'hidden' }}
                      >
                        {delivery.additionalOptions.map((option) => (
                          <label
                            key={option.id}
                            className={`delivery-option ${
                              delivery.selectedDelivery?.id === option.id
                                ? 'delivery-option--selected'
                                : ''
                            }`}
                            style={{ marginTop: '0.75rem' }}
                          >
                            <input
                              type="radio"
                              name="delivery"
                              value={option.id}
                              checked={delivery.selectedDelivery?.id === option.id}
                              onChange={() => delivery.handleSelect(option)}
                            />
                            <div className="delivery-option__content">
                              <div className="delivery-option__info">
                                <strong>{option.name}</strong>
                                <span>{option.address}</span>
                              </div>
                            <div className="delivery-option__price">
                              {option.isFree ? (
                                <span className="delivery-option__free">{w.delivery.free}</span>
                              ) : (
                                <span>R$ {(option.price / 100).toFixed(2)}</span>
                              )}
                            </div>
                            </div>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              
              {delivery.hasMoreOptions && (
                <button
                  type="button"
                  className={`checkout-section__expand ${
                    delivery.showAll ? 'checkout-section__expand--open' : ''
                  }`}
                  onClick={delivery.toggleShowAll}
                >
                  {delivery.showAll ? w.delivery.lessOptions : w.delivery.moreOptions}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              )}
            </section>

            <section className="checkout-section checkout-section--form">
              <h2 className="checkout-section__title">{w.sections.fiscalData}</h2>
              
              <div className="form-grid">
                <CustomSelect
                  label={w.fields.country}
                  options={COUNTRY_OPTIONS}
                  value={form.fiscal.country || 'BR'}
                  onChange={(value: string) => updateFiscal({ country: value })}
                  wrapperClassName="form-grid__full"
                />
                
                <SecureInput
                  ref={form.refs.cpfRef}
                  label={w.fields.cpfCnpj}
                  mask="cpf"
                  defaultValue={form.fiscal.cpfCnpj}
                  onValueChange={form.handleCPFChange}
                  error={
                    form.attemptedSubmit && !form.fiscal.cpfCnpj
                      ? w.messages.requiredField
                      : undefined
                  }
                  successMessage={
                    form.fiscal.cpfCnpj && form.successCheckers.isCPFValid(form.fiscal.cpfCnpj)
                      ? 'valid'
                      : undefined
                  }
                  validator={form.validators.cpfValidator}
                  wrapperClassName="form-grid__full"
                />
              </div>

              <h2 className="checkout-section__title" style={{ marginTop: '1rem', textAlign: 'left' }}>
                {w.sections.payerData}
              </h2>
              
              <Input
                label={w.fields.firstName}
                value={form.payer.firstName || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.updatePayer({ firstName: e.target.value })}
                error={
                  form.attemptedSubmit && !form.payer.firstName
                    ? w.messages.requiredField
                    : undefined
                }
                successMessage={form.payer.firstName ? 'valid' : undefined}
                required
              />
              
              <Input
                label={w.fields.lastName}
                value={form.payer.lastName || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.updatePayer({ lastName: e.target.value })}
                error={
                  form.attemptedSubmit && !form.payer.lastName
                    ? w.messages.requiredField
                    : undefined
                }
                successMessage={form.payer.lastName ? 'valid' : undefined}
                required
              />
              
              <SecureInput
                ref={form.refs.phoneRef}
                label={w.fields.phone}
                mask="phone"
                defaultValue={form.payer.phone}
                onValueChange={(value: string) => form.updatePayer({ phone: value })}
                error={
                  form.attemptedSubmit && !form.payer.phone
                    ? w.messages.requiredField
                    : undefined
                }
                successMessage={
                  form.payer.phone && form.successCheckers.isPhoneValid(form.payer.phone)
                    ? 'valid'
                    : undefined
                }
                validator={form.validators.phoneValidator}
              />
              
              {hasAddress ? (
                <div className="cep-field-wrapper">
                  <label className="input-label">{w.fields.cep}</label>
                  <div className="address-display">
                    <div className="address-display__icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div className="address-display__content">
                      <div className="address-display__street">{form.payer.address?.street}</div>
                      <div className="address-display__details">
                        {w.address.cepPrefix} {form.payer.address?.cep} - {form.payer.address?.neighborhood}
                      </div>
                      <div className="address-display__city">
                        {form.payer.address?.city} - Distrito Federal
                      </div>
                    </div>
                    <button
                      type="button"
                      className="address-display__change"
                      onClick={handleClearAddressAndOpenModal}
                    >
                      {w.address.change}
                    </button>
                  </div>
                </div>
              ) : (
                // Mostrar input normal
                <SecureInput
                  ref={form.refs.cepRef}
                  label={w.fields.cep}
                  mask="cep"
                  defaultValue={form.payer.address?.cep}
                  onValueChange={(value: string) =>
                    form.updatePayer({
                      address: { ...form.payer.address, cep: value } as any,
                    })
                  }
                  error={
                    form.cepError ||
                    (form.attemptedSubmit && !form.payer.address?.cep
                      ? w.messages.requiredField
                      : undefined)
                  }
                  successMessage={
                    form.payer.address?.cep &&
                    form.successCheckers.isCEPValid(form.payer.address.cep) &&
                    !form.cepError
                      ? 'valid'
                      : undefined
                  }
                  showErrorIcon={false}
                  endIcon={
                    form.isLoadingCEP ? (
                      <div className="spinner" />
                    ) : (
                      <button
                        type="button"
                        className="cep-modal-link"
                        onClick={() => setShowCEPModal(true)}
                      >
                        {w.fields.cepHelper}
                      </button>
                    )
                  }
                  onBlur={form.handleCEPBlur}
                />
              )}
              
              <div className="form-grid">
                <Input
                  label={w.fields.number}
                  value={form.payer.address?.number || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    form.updatePayer({
                      address: { ...form.payer.address, number: e.target.value } as any,
                    })
                  }
                  error={
                    form.attemptedSubmit && !form.payer.address?.number
                      ? w.messages.requiredField
                      : undefined
                  }
                  successMessage={form.payer.address?.number ? 'valid' : undefined}
                  required
                />
                
                <Input
                  label={w.fields.complement}
                  value={form.payer.address?.complement || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    form.updatePayer({
                      address: { ...form.payer.address, complement: e.target.value } as any,
                    })
                  }
                  successMessage={form.payer.address?.complement ? 'valid' : undefined}
                />
              </div>
              
              <Checkbox
                label={w.fields.pickupPerson}
                checked={showPickupPersonFields}
                onChange={handlePickupPersonToggle}
              />
              
              {/* Pickup Person Fields (animados) */}
              <AnimatePresence>
                {showPickupPersonFields && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: ANIMATION.DURATION, ease: ANIMATION.EASING }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="form-grid" style={{ marginTop: '1rem' }}>
                      <Input
                        label={w.fields.firstName}
                        value={form.payer.pickupPerson?.firstName || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          form.updatePayer({
                            pickupPerson: {
                              ...form.payer.pickupPerson,
                              firstName: e.target.value,
                            } as any,
                          })
                        }
                        successMessage={form.payer.pickupPerson?.firstName ? 'valid' : undefined}
                      />
                      
                      <Input
                        label={w.fields.lastName}
                        value={form.payer.pickupPerson?.lastName || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          form.updatePayer({
                            pickupPerson: {
                              ...form.payer.pickupPerson,
                              lastName: e.target.value,
                            } as any,
                          })
                        }
                        successMessage={form.payer.pickupPerson?.lastName ? 'valid' : undefined}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Submit Button */}
            <div className="checkout-page__submit">
              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? w.buttons.processing : w.buttons.submit}
              </Button>
            </div>
            
            {/* Form Status Messages */}
            {form.formState.status === 'error' && (
              <div className="checkout-page__error" role="alert">
                {form.formState.error}
              </div>
            )}
            
            {form.formState.status === 'success' && (
              <div className="checkout-page__success" role="alert">
                {w.messages.successPrefix} {form.formState.orderId}
              </div>
            )}
          </form>

          {/* Order Summary */}
          <OrderSummary />
        </div>
      </div>

      {/* CEP Modal */}
      <CEPModal
        isOpen={showCEPModal}
        onClose={() => setShowCEPModal(false)}
        onSelectCEP={handleSelectCEP}
      />
    </div>
  );
};