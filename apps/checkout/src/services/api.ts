import type { DeliveryOption, Product } from '../types';

export const fetchDeliveryOptions = async (): Promise<DeliveryOption[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [
    {
      id: '1',
      name: 'Retirar na loja Inspire - Castelo',
      address: 'Avenida Miguel Pereira, 455 - Castelo',
      price: 0,
      isFree: true,
    },
    {
      id: '2',
      name: 'Entrega Express',
      address: 'Receba em até 2 horas',
      price: 1500,
      isFree: false,
    },
    {
      id: '3',
      name: 'Entrega Padrão',
      address: 'Receba em até 5 dias úteis',
      price: 500,
      isFree: false,
    },
  ];
};

/**
 * Fetch address by CEP using ViaCEP API
 */
export const fetchAddressByCEP = async (cep: string) => {
  const cleanCEP = cep.replace(/\D/g, '');

  if (cleanCEP.length !== 8) {
    throw new Error('CEP inválido');
  }

  const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);

  if (!response.ok) {
    throw new Error('Erro ao buscar CEP');
  }

  const data = await response.json();

  if (data.erro) {
    throw new Error('CEP não encontrado');
  }

  return data;
};

/**
 * Fetch cart products from Fake Store API
 */
export const fetchCartProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('https://fakestoreapi.com/products?limit=2');
    
    if (!response.ok) {
      throw new Error('Error fetching products');
    }

    const products = await response.json();

    return products.map((product: any) => ({
      id: product.id.toString(),
      name: product.title,
      price: Math.round(product.price * 100),
      quantity: 1,
      imageUrl: product.image,
    }));
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

export interface Coupon {
  code: string;
  discount: number;
  description: string;
  minPurchase?: number;
}

const MOCK_COUPONS: Coupon[] = [
  {
    code: 'PRIMEIRA10',
    discount: 10,
    description: '10% de desconto para primeira compra',
    minPurchase: 0,
  },
  {
    code: 'INSPIRE25',
    discount: 25,
    description: '25% de desconto especial Inspire',
    minPurchase: 10000,
  },
  {
    code: 'FRETE50',
    discount: 50,
    description: '50% de desconto no valor total',
    minPurchase: 15000,
  },
];

export const validateCoupon = async (
  code: string,
  subtotal: number
): Promise<Coupon> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const coupon = MOCK_COUPONS.find(
    (c) => c.code.toLowerCase() === code.toLowerCase()
  );

  if (!coupon) {
    throw new Error('Cupom inválido');
  }

  if (coupon.minPurchase && subtotal < coupon.minPurchase) {
    throw new Error(
      `Compra mínima de R$ ${(coupon.minPurchase / 100).toFixed(2)} necessária`
    );
  }

  return coupon;
};

export const getAvailableCoupons = async (): Promise<Coupon[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_COUPONS;
};