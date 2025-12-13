import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import DriveLahLogo from '../../assets/logo.png';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Mobile menu button */}
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="1" x2="24" y2="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="0" y1="6" x2="24" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="0" y1="11" x2="24" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <Link to="/" className="header-logo">
            <img src={DriveLahLogo} alt="Drive lah" />
          </Link>

          <div className="right-header-nav">
            <nav className="header-nav">
              <Link to="/" className="nav-link">
                Learn more
              </Link>
              <Link to="/" className="nav-link">
                List your car
              </Link>
              <Link to="/" className="nav-link">
                Inbox
              </Link>
            </nav>
            <div className="user-avatar">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="24" cy="18" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M10 40c0-8 6-14 14-14s14 6 14 14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu">
          <div className="mobile-menu-header">
            <Link to="/" className="mobile-menu-logo" onClick={closeMobileMenu}>
              <img src={DriveLahLogo} alt="Drive lah" />
            </Link>
            <button
              className="mobile-menu-close"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav className="mobile-menu-nav">
            <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
              Learn more
            </Link>
            <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
              List your car
            </Link>
            <Link to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
              Inbox
            </Link>
          </nav>
        </div>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={closeMobileMenu} />
      )}
    </>
  );
}

export default Header;
