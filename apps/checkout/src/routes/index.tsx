import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { LoadingFallback } from '../components/LoadingFallback';

/**
 * Lazy Loading Configuration
 * 
 * Code Splitting Benefits:
 * - Checkout loaded in separate chunk (~100KB)
 * - Smaller initial bundle (~170KB)
 * - Better vendor caching
 * - Easy to add new routes without increasing initial bundle
 */

const CheckoutPage = lazy(() => 
  import('../pages/CheckoutPage/CheckoutPage').then(module => ({
    default: module.CheckoutPage
  }))
);

/**
 * Router Configuration
 * 
 * Structure:
 * - / → CheckoutPage (lazy loaded)
 * - /checkout → CheckoutPage (lazy loaded alias)
 * 
 * Future routes can be easily added as independent chunks
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CheckoutPage />
          </Suspense>
        ),
      },
      {
        path: 'checkout',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CheckoutPage />
          </Suspense>
        ),
      },
      // {
      //   path: 'payment',
      //   element: (
      //     <Suspense fallback={<LoadingFallback />}>
      //       <PaymentPage />
      //     </Suspense>
      //   ),
      // },
      // {
      //   path: 'confirmation/:orderId',
      //   element: (
      //     <Suspense fallback={<LoadingFallback />}>
      //       <ConfirmationPage />
      //     </Suspense>
      //   ),
      // },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
