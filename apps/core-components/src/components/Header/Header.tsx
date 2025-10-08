import { type ReactNode } from 'react';
import './Header.css';

export interface HeaderProps {
  /** Logo text */
  logoText?: string;
  /** Security badge */
  showSecurityBadge?: boolean;
  /** Additional content on the right */
  rightContent?: ReactNode;
}

/**
 * Header Component - Main checkout navbar
 * 
 * Architectural Decisions:
 * 
 * 1. Flexible composition:
 *    - Customizable logo (SVG or image)
 *    - Dynamic breadcrumb
 *    - Optional security badge
 *    - Slot for additional content
 * 
 * 2. Responsive:
 *    - Mobile: Centered logo, breadcrumb below
 *    - Desktop: Everything inline
 * 
 * @example
 * ```tsx
 * <Header
 *   logoText="Inspire"
 *   showSecurityBadge
 * />
 * ```
 */
export const Header = ({
  logoText = 'Inspire',
  showSecurityBadge = true,
  rightContent,
}: HeaderProps) => {
  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <div className="header__logo">
          <svg 
            className="header__logo-icon" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
          <span className="header__logo-text">{logoText}</span>
        </div>

        {/* Right content (Security badge or custom) */}
        <div className="header__right">
          {rightContent ? (
            rightContent
          ) : showSecurityBadge ? (
            <div className="security-badge">
              <div className="security-badge__icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <circle cx="12" cy="11" r="2" fill="currentColor" />
                </svg>
              </div>
              <div className="security-badge__content">
                <span className="security-badge__title">COMPRA SEGURA</span>
                <span className="security-badge__subtitle">100% PROTEGIDO</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

