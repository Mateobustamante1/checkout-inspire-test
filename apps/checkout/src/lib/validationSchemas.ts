import { z } from 'zod';
import { validateCPF, validateCEP, validateEmail, validatePhone } from '@inspire/core-components';

/**
 * Zod Validation Schemas
 * 
 * Why Zod:
 * - Automatic type inference
 * - Schema composition
 * - Async validation support
 * - Smaller bundle than Joi, more type-safe than Yup
 */

export const addressSchema = z.object({
  cep: z
    .string()
    .min(1, 'CEP é obrigatório')
    .refine(validateCEP, 'CEP inválido'),
  
  street: z
    .string()
    .min(3, 'Rua é obrigatória')
    .max(200, 'Rua muito longa'),
  
  number: z
    .string()
    .min(1, 'Número é obrigatório'),
  
  complement: z
    .string()
    .max(100, 'Complemento muito longo')
    .optional(),
  
  neighborhood: z
    .string()
    .min(2, 'Bairro é obrigatório')
    .max(100, 'Bairro muito longo'),
  
  city: z
    .string()
    .min(2, 'Cidade é obrigatória')
    .max(100, 'Cidade muito longa'),
  
  state: z
    .string()
    .length(2, 'Estado deve ter 2 caracteres')
    .toUpperCase(),
  
  country: z
    .string()
    .default('BR'),
});

export const contactSchema = z.object({
  email: z
    .string()
    .min(1, 'E-mail é obrigatório')
    .refine(validateEmail, 'E-mail inválido')
    .transform((email) => email.toLowerCase().trim()),
  
  receiveNewsletter: z.boolean().default(false),
});

export const fiscalSchema = z.object({
  country: z.string().default('Brasil'),
  
  cpfCnpj: z
    .string()
    .min(1, 'CPF ou CNPJ é obrigatório')
    .refine(validateCPF, 'CPF inválido'),
});

const pickupPersonSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Nome é obrigatório')
    .max(50, 'Nome muito longo'),
  
  lastName: z
    .string()
    .min(2, 'Sobrenome é obrigatório')
    .max(50, 'Sobrenome muito longo'),
});

export const payerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Nome é obrigatório')
    .max(50, 'Nome muito longo')
    .transform((name) => name.trim()),
  
  lastName: z
    .string()
    .min(2, 'Sobrenome é obrigatório')
    .max(50, 'Sobrenome muito longo')
    .transform((name) => name.trim()),
  
  phone: z
    .string()
    .min(1, 'Telefone é obrigatório')
    .refine(validatePhone, 'Telefone inválido'),
  
  address: addressSchema,
  
  isAnotherPersonPickup: z.boolean().default(false),
  
  pickupPerson: pickupPersonSchema.optional(),
});

export const deliveryOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  price: z.number().nonnegative(),
  isFree: z.boolean(),
});

/**
 * Complete Checkout Schema - Composed from smaller schemas
 * 
 * Architecture:
 * - Modular and maintainable
 * - Reusable sub-schemas
 * - Easier independent testing
 */
export const checkoutSchema = z.object({
  contact: contactSchema,
  delivery: deliveryOptionSchema.nullable(),
  fiscal: fiscalSchema,
  payer: payerSchema,
}).refine(
  (data) => {
    if (data.payer.isAnotherPersonPickup) {
      return !!data.payer.pickupPerson;
    }
    return true;
  },
  {
    message: 'Dados da pessoa que buscará são obrigatórios',
    path: ['payer', 'pickupPerson'],
  }
).refine(
  (data) => {
    return data.delivery !== null;
  },
  {
    message: 'Selecione uma opção de entrega',
    path: ['delivery'],
  }
);

/**
 * Type inference from Zod schemas
 * Single source of truth - types auto-update when schemas change
 */
export type ContactData = z.infer<typeof contactSchema>;
export type FiscalData = z.infer<typeof fiscalSchema>;
export type PayerData = z.infer<typeof payerSchema>;
export type DeliveryOption = z.infer<typeof deliveryOptionSchema>;
export type Address = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

