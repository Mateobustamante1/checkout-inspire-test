import './LoadingFallback.scss';

/**
 * LoadingFallback - Shown while lazy-loaded chunks are loading
 * 
 * Appears during React.lazy() code loading, typically <500ms on good connections.
 * Improves perceived performance vs blank screen.
 */
export const LoadingFallback = () => {
  return (
    <div className="loading-fallback">
      <div className="loading-fallback__spinner">
        <div className="spinner"></div>
      </div>
      <p className="loading-fallback__text">Carregando...</p>
    </div>
  );
};
