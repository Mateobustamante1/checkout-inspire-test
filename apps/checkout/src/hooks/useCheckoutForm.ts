import { useRef, useState, useCallback } from 'react';
import type { SecureInputRef } from '@inspire/core-components';
import { useCheckoutStore } from '../store/checkoutStore';
import { fetchAddressByCEP } from '../services/api';
import { FIELD_LENGTHS, SCROLL_CONFIG } from '../constants';
import {
  emailValidator,
  cpfValidator,
  phoneValidator,
  cepValidator,
  requiredValidator,
  isEmailValid,
  isCPFValid,
  isPhoneValid,
  isCEPValid,
} from '../utils/validators';
import { checkoutLogger } from '../services/logger';

/**
 * Custom Hook: Checkout form logic and validation
 * 
 * Architecture:
 * - Separates form logic from UI presentation
 * - Memoized handlers for performance
 * - Centralized validation
 * - Testable independently
 */
export const useCheckoutForm = () => {
  const emailRef = useRef<SecureInputRef>(null);
  const cpfRef = useRef<SecureInputRef>(null);
  const phoneRef = useRef<SecureInputRef>(null);
  const cepRef = useRef<SecureInputRef>(null);

  const {
    contact,
    delivery,
    fiscal,
    payer,
    updateContact,
    updateFiscal,
    updatePayer,
    submitCheckout,
    formState,
  } = useCheckoutStore();

  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
  const [cepError, setCepError] = useState<string>('');
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleEmailChange = useCallback((value: string) => {
    updateContact({ email: value });
  }, [updateContact]);

  const handleNewsletterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateContact({ receiveNewsletter: e.target.checked });
  }, [updateContact]);

  const handleCPFChange = useCallback((value: string) => {
    updateFiscal({ cpfCnpj: value });
  }, [updateFiscal]);

  const handleCEPBlur = useCallback(async () => {
    const cep = cepRef.current?.getValue();
    if (!cep || cep.length !== FIELD_LENGTHS.CEP) return;

    setIsLoadingCEP(true);
    setCepError('');

    try {
      const addressData = await fetchAddressByCEP(cep);

      updatePayer({
        address: {
          ...payer.address,
          cep: addressData.cep,
          street: addressData.logradouro,
          neighborhood: addressData.bairro,
          city: addressData.localidade,
          state: addressData.uf,
          number: payer.address?.number || '',
          country: 'BR',
        },
      });

      checkoutLogger.cepLookupSuccess(cep, {
        city: addressData.localidade,
        state: addressData.uf,
      });
    } catch (error) {
      const errorMessage = 'CEP não encontrado';
      setCepError(errorMessage);
      checkoutLogger.cepLookupError(cep, errorMessage);
    } finally {
      setIsLoadingCEP(false);
    }
  }, [payer.address, updatePayer]);

  const handleSelectCEP = useCallback(async (cep: string) => {
    if (cepRef.current) {
      cepRef.current.setValue(cep);
    }

    updatePayer({
      address: { ...payer.address, cep } as any,
    });
    setIsLoadingCEP(true);
    setCepError('');
    try {
      const address = await fetchAddressByCEP(cep);
      updatePayer({
        address: {
          ...payer.address,
          cep: address.cep,
          street: address.logradouro,
          neighborhood: address.bairro,
          city: address.localidade,
          state: address.uf,
        },
      });

      checkoutLogger.cepLookupSuccess(cep, {
        city: address.localidade,
        state: address.uf,
      });
    } catch (error: any) {
      setCepError(error.message);
      checkoutLogger.cepLookupError(cep, error.message);
    } finally {
      setIsLoadingCEP(false);
    }
  }, [payer.address, updatePayer]);

  const handleClearAddress = useCallback(() => {
    updatePayer({
      address: {
        ...payer.address,
        cep: '',
        street: '',
        neighborhood: '',
        city: '',
        state: '',
      } as any,
    });
    cepRef.current?.clear();
  }, [payer.address, updatePayer]);

  const validateAllFields = useCallback(() => {
    const errors = [];

    const emailError = emailRef.current?.validate();
    const cpfError = cpfRef.current?.validate();
    const phoneError = phoneRef.current?.validate();
    const cepError = cepRef.current?.validate();

    if (emailError || !contact.email) {
      errors.push('Email é obrigatório');
    }

    if (!delivery) {
      errors.push('Selecione uma opção de entrega');
    }

    if (cpfError || !fiscal.cpfCnpj) {
      errors.push('CPF/CNPJ é obrigatório');
    }

    if (!payer.firstName) {
      errors.push('Nome é obrigatório');
    }

    if (!payer.lastName) {
      errors.push('Sobrenome é obrigatório');
    }

    if (phoneError || !payer.phone) {
      errors.push('Telefone é obrigatório');
    }

    if (cepError || !payer.address?.cep) {
      errors.push('CEP é obrigatório');
    }

    if (!payer.address?.number) {
      errors.push('Número é obrigatório');
    }

    if (errors.length > 0) {
      checkoutLogger.validationError(errors);
    }

    return errors;
  }, [contact.email, delivery, fiscal.cpfCnpj, payer]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    setAttemptedSubmit(true);

    const errors = validateAllFields();

    if (errors.length > 0) {
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: SCROLL_CONFIG.BEHAVIOR, block: 'center' });
      } else {
        window.scrollTo({ top: SCROLL_CONFIG.TOP, behavior: SCROLL_CONFIG.BEHAVIOR });
      }
      return;
    }

    await submitCheckout();
  }, [validateAllFields, submitCheckout]);

  return {
    refs: { emailRef, cpfRef, phoneRef, cepRef },
    isLoadingCEP,
    cepError,
    attemptedSubmit,
    formState,
    contact,
    delivery,
    fiscal,
    payer,
    handleEmailChange,
    handleNewsletterChange,
    handleCPFChange,
    handleCEPBlur,
    handleSelectCEP,
    handleClearAddress,
    handleSubmit,
    updateContact,
    updateFiscal,
    updatePayer,
    setCepError,
    validators: {
      emailValidator,
      cpfValidator,
      phoneValidator,
      cepValidator,
      requiredValidator,
    },
    successCheckers: {
      isEmailValid,
      isCPFValid,
      isPhoneValid,
      isCEPValid,
    },
  };
};
