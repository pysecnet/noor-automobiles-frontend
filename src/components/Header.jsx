import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const isHomePage = location.pathname === '/';
  const shouldHaveSolidBg = isScrolled || !isHomePage || isMobileMenuOpen;

  const headerBg = shouldHaveSolidBg
  ? 'rgba(255, 255, 255, 0.98)'
  : 'transparent';
  const textColor = shouldHaveSolidBg ? '#0a0a0a' : '#ffffff';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/collection' },
    { name: 'Parts', path: '/parts' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: headerBg,
      backdropFilter: shouldHaveSolidBg ? 'blur(20px)' : 'none',
          borderBottom: shouldHaveSolidBg ? '1px solid rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.4s ease',
          boxShadow: shouldHaveSolidBg ? '0 2px 20px rgba(0,0,0,0.08)' : 'none'
    }}>
    <div className="container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '90px',
      padding: '0 20px'
    }}>
    {/* Logo */}
    <Link to="/">
    <Logo size={50} textColor={textColor} />
    </Link>

    {/* Desktop Navigation */}
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '40px'
    }} className="desktop-nav">
    {navLinks.map(link => (
      <Link
      key={link.path}
      to={link.path}
      style={{
        fontSize: '0.9rem',
        fontWeight: '500',
        color: location.pathname === link.path ? '#c41e3a' : textColor,
        position: 'relative',
        padding: '8px 0'
      }}
      >
      {link.name}
      {location.pathname === link.path && (
        <span style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(135deg, #c41e3a 0%, #e63950 100%)',
                                           borderRadius: '10px'
        }} />
      )}
      </Link>
    ))}
    </nav>

    {/* Call Button */}

    <a href="tel:03241344368"
    className="btn desktop-nav"
    style={{
      background: 'linear-gradient(135deg, #c41e3a 0%, #e63950 100%)',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: '50px',
          fontSize: '0.85rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 8px 25px rgba(196, 30, 58, 0.3)',
          transition: 'all 0.3s ease'
    }}
    >
    <Phone size={18} />
    Call Now
    </a>

    {/* Mobile Menu Toggle */}
    <button
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    className="mobile-menu-toggle"
    style={{
      display: 'none',
      padding: '12px',
      color: isMobileMenuOpen ? '#0a0a0a' : textColor,
      background: isMobileMenuOpen
      ? 'rgba(196, 30, 58, 0.1)'
      : (shouldHaveSolidBg ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.15)'),
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
    }}
    >
    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
    </div>
    </header>

    {/* Mobile Menu - Full Screen Overlay */}
    {isMobileMenuOpen && (
      <div
      className="mobile-menu-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: '#ffffff',
        zIndex: 999,
        paddingTop: '90px',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
      >
      <div style={{ padding: '30px 24px', minHeight: 'calc(100vh - 90px)' }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {navLinks.map(link => (
        <Link
        key={link.path}
        to={link.path}
        onClick={() => setIsMobileMenuOpen(false)}
        style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: location.pathname === link.path ? '#c41e3a' : '#0a0a0a',
          padding: '18px 20px',
          background: location.pathname === link.path ? 'rgba(196,30,58,0.08)' : 'transparent',
                             borderRadius: '16px',
                             transition: 'all 0.2s ease',
                             display: 'block'
        }}
        >
        {link.name}
        </Link>
      ))}

      {/* WhatsApp Button */}

      <a href="https://wa.me/923241344368?text=Hello!%20I%20am%20interested%20in%20your%20cars%20at%20Noor%20Automobiles."
      target="_blank"
      rel="noopener noreferrer"
      style={{
        marginTop: '20px',
        padding: '18px',
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                          color: '#fff',
                          borderRadius: '16px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px'
      }}
      >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      WhatsApp Us
      </a>

      {/* Call Button */}

      <a href="tel:03241344368"
      style={{
        marginTop: '10px',
        padding: '18px',
        background: 'linear-gradient(135deg, #c41e3a 0%, #e63950 100%)',
                          color: '#fff',
                          borderRadius: '16px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px'
      }}
      >
      <Phone size={20} />
      Call: 0324-1344368
      </a>
      </nav>

      {/* Business Hours */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#f8f8f8',
        borderRadius: '16px'
      }}>
      <h4 style={{
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#737373',
        marginBottom: '12px'
      }}>Business Hours</h4>
      <p style={{ fontSize: '0.95rem', color: '#0a0a0a', marginBottom: '6px' }}>
      <strong>Mon - Thu, Sat - Sun:</strong> 11 AM - 10 PM
      </p>
      <p style={{ fontSize: '0.95rem', color: '#c41e3a' }}>
      <strong>Friday:</strong> Closed
      </p>
      </div>

      {/* Address */}
      <div style={{
        marginTop: '16px',
        padding: '20px',
        background: '#f8f8f8',
        borderRadius: '16px'
      }}>
      <h4 style={{
        fontSize: '0.75rem',
        fontWeight: '700',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#737373',
        marginBottom: '12px'
      }}>Location</h4>
      <p style={{ fontSize: '0.95rem', color: '#0a0a0a', lineHeight: 1.6 }}>
      Honda Palace, Opp. Taj Pump,<br />
      Jamshoro Road, Hyderabad
      </p>
      </div>
      </div>
      </div>
    )}

    <style>{`
      @media (max-width: 900px) {
        .desktop-nav { display: none !important; }
        .mobile-menu-toggle { display: flex !important; align-items: center; justify-content: center; }
      }
      `}</style>
      </>
  );
};

export default Header;
