import { Outlet } from 'react-router-dom';
import './AppLayout.scss';

/**
 * AppLayout - Shell principal de la aplicación
 * 
 * Este es el "contenedor" que envuelve todas las páginas/steps.
 * 
 * Benefits:
 * 1. ✅ Shared UI: Header, Footer, etc. se renderizan una sola vez
 * 2. ✅ Layout consistency: Todas las páginas tienen el mismo layout
 * 3. ✅ State persistence: El state del layout se mantiene entre navegaciones
 * 4. ✅ Separation of concerns: Layout vs. Content
 * 
 * Usage:
 * - <Outlet /> es donde se renderizan las rutas hijas (HomePage, CheckoutPage, etc.)
 * - Si necesitas un header/footer global, agrégalo aquí
 */
export const AppLayout = () => {
  return (
    <div className="app-layout">
      {/* 
        Aquí podrías agregar:
        - <GlobalHeader /> (navbar para toda la app)
        - <Breadcrumbs /> (navegación contextual)
        - <GlobalFooter />
        
        Por ahora, solo renderizamos el contenido de cada ruta.
      */}
      
      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  );
};
