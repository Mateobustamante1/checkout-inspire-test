import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import '@inspire/core-components';
import '@inspire/core-components/dist/index.css';
import { router } from './routes';
import './styles/globals.scss';

/**
 * Application entry point
 * 
 * Architecture:
 * - StrictMode for potential issue detection
 * - RouterProvider with lazy loading support
 * - Code splitting per route for optimal performance
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

