import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Search, User, LogOut, Menu, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const NAV_LINKS_BY_VARIANT = {
  landing: [
    { label: 'Home', to: '/' },
    { label: 'Shop', to: '/shop' },
    { label: 'Build Bouquet', to: '/build-bouquet' },
    { label: 'My Account', to: '/my-account' },
  ],
  dashboard: [
    { label: 'Home', to: '/dashboard' },
    { label: 'Shop', to: '/shop' },
    { label: 'Build Bouquet', to: '/build-bouquet' },
    { label: 'My Account', to: '/my-account' },
  ],
};

// Premium rose/blush palette
const C = {
  glass: 'rgba(255,255,255,0.65)',
  glassStrong: 'rgba(255,255,255,0.8)',
  primary: '#6F2940',
  hover: '#8C3B55',
  border: 'rgba(111,41,64,0.12)',
  borderStrong: 'rgba(111,41,64,0.22)',
  text: '#3D2A2A',
  textSecondary: '#7B6B6B',
};

// Small, self-contained animated nav link (underline grows from centre, lifts,
// darkens and thickens on hover/focus; stays lit when it's the active page).
function NavItem({ to, label, active, onNavigate }) {
  const [on, setOn] = useState(false);
  const lit = on || active;
  return (
    <Link
      to={to}
      onClick={onNavigate}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      onFocus={() => setOn(true)}
      onBlur={() => setOn(false)}
      className="fnav-link"
      style={{
        position: 'relative',
        display: 'inline-block',
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: lit ? 600 : 500,
        color: lit ? C.primary : C.textSecondary,
        transform: on ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'color 300ms ease, transform 300ms ease',
        whiteSpace: 'nowrap',
        padding: '4px 2px',
      }}
    >
      {label}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -3,
          height: 2,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${C.primary}, ${C.hover})`,
          transform: `scaleX(${lit ? 1 : 0})`,
          transformOrigin: 'center',
          transition: 'transform 300ms ease',
        }}
      />
    </Link>
  );
}

// Circular glass icon button (wishlist / cart / account). Lifts + scales on hover.
function IconButton({ to, label, badge, children }) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.08 }} whileTap={{ scale: 0.92 }}>
      <Link
        to={to}
        aria-label={label}
        className="fnav-icon"
        style={{
          position: 'relative',
          width: 42,
          height: 42,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: C.primary,
          background: C.glass,
          border: `1px solid ${C.border}`,
          boxShadow: '0 4px 14px rgba(111,41,64,0.08)',
          transition: 'background 250ms ease, box-shadow 250ms ease',
          textDecoration: 'none',
        }}
      >
        {children}
        {badge > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              minWidth: 17,
              height: 17,
              padding: '0 4px',
              borderRadius: 999,
              background: `linear-gradient(135deg, ${C.hover}, ${C.primary})`,
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              boxShadow: '0 2px 6px rgba(111,41,64,0.35)',
            }}
          >
            {badge}
          </span>
        )}
      </Link>
    </motion.div>
  );
}

// Premium gradient logout pill with an animated shine sweep on hover.
function LogoutButton({ onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Log out"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="fnav-logout"
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        border: 'none',
        borderRadius: 999,
        padding: '10px 20px',
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: 0.2,
        color: '#fff',
        cursor: 'pointer',
        fontFamily: 'inherit',
        background: `linear-gradient(135deg, ${C.hover} 0%, ${C.primary} 60%, #4f1c2d 100%)`,
        boxShadow: '0 10px 24px rgba(111,41,64,0.32)',
        transition: 'box-shadow 250ms ease',
      }}
    >
      {/* shine */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '60%',
          height: '100%',
          background:
            'linear-gradient(100deg, transparent, rgba(255,255,255,0.45), transparent)',
          transform: `translateX(${hover ? '220%' : '-120%'}) skewX(-12deg)`,
          transition: 'transform 700ms ease',
          pointerEvents: 'none',
        }}
      />
      <LogOut size={15} />
      Logout
    </motion.button>
  );
}

export default function Navbar({ variant = 'landing' }) {
  const navigate = useNavigate();
  const navLinks = NAV_LINKS_BY_VARIANT[variant] || NAV_LINKS_BY_VARIANT.landing;
  const isDashboard = variant === 'dashboard';
  const { count, refresh } = useWishlist();
  const { count: cartCount, refresh: refreshCart } = useCart();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const [scrolled, setScrolled] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1400
  );

  const isMobile = width <= 860;
  const isTablet = width <= 1120;

  // Keep the search box showing whatever's in the URL (e.g. after navigating
  // straight to a /shop?search=... link, or after it's cleared elsewhere).
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    const onResize = () => setWidth(window.innerWidth);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Close the mobile menu whenever we navigate.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // While already on the Shop page, filter results live as you type —
    // no need to press Enter. Only Enter is needed to *get to* the Shop
    // page in the first place from somewhere else.
    if (location.pathname === '/shop') {
      if (value) {
        searchParams.set('search', value);
      } else {
        searchParams.delete('search');
      }
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    refresh();
    refreshCart();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
  };

  // Reusable glass search field (shared by desktop bar and mobile panel).
  const searchField = (fullWidth = false) => (
    <form
      onSubmit={handleSearch}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        background: C.glassStrong,
        borderRadius: 999,
        padding: '9px 16px',
        width: fullWidth ? '100%' : searchFocus ? 320 : 288,
        border: `1px solid ${searchFocus ? C.borderStrong : C.border}`,
        boxShadow: searchFocus
          ? `0 0 0 4px rgba(140,59,85,0.12), 0 6px 18px rgba(111,41,64,0.10)`
          : '0 2px 10px rgba(111,41,64,0.06)',
        transition: 'width 300ms ease, box-shadow 250ms ease, border-color 250ms ease',
      }}
    >
      <motion.span
        animate={{ rotate: searchFocus ? -8 : 0, scale: searchFocus ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        style={{ display: 'flex', flexShrink: 0 }}
      >
        <Search size={16} color={C.primary} />
      </motion.span>
      <input
        type="text"
        placeholder="Search for blooms..."
        aria-label="Search for blooms"
        className="fnav-search-input"
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 13,
          width: '100%',
          color: C.text,
          fontFamily: 'inherit',
        }}
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={() => setSearchFocus(true)}
        onBlur={() => setSearchFocus(false)}
      />
    </form>
  );

  return (
    <>
      {/* Tiny stylesheet for things inline styles can't express: placeholder
          colour, keyboard focus rings, and reduced-motion safety. */}
      <style>{`
        .fnav-search-input::placeholder { color: ${C.textSecondary}; opacity: 1; }
        .fnav-link:focus-visible,
        .fnav-icon:focus-visible,
        .fnav-logout:focus-visible,
        .fnav-hamburger:focus-visible {
          outline: 2px solid ${C.hover};
          outline-offset: 3px;
          border-radius: 8px;
        }
        @media (prefers-reduced-motion: reduce) {
          .fnav-link, .fnav-icon, .fnav-logout, .fnav-logout span { transition: none !important; }
        }
      `}</style>

      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.75)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(16px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          boxShadow: scrolled
            ? '0 6px 24px rgba(111,41,64,0.10)'
            : '0 2px 12px rgba(111,41,64,0.05)',
          transition:
            'background 350ms ease, backdrop-filter 350ms ease, box-shadow 350ms ease',
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 18,
            padding: isMobile
              ? (scrolled ? '6px 18px' : '8px 18px')
              : (scrolled ? '6px 36px' : '10px 40px'),
            transition: 'padding 350ms ease',
          }}
        >
          {/* Logo (left) */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            style={{ flex: isMobile ? '0 0 auto' : '1 1 0', display: 'flex', justifyContent: 'flex-start' }}
          >
            <Link
              to={isDashboard ? '/dashboard' : '/'}
              aria-label="Florafy home"
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <img
                src="/image/florafy-logo.png"
                alt="Florafy"
                style={{ height: scrolled ? 46 : 56, width: 'auto', display: 'block', transition: 'height 350ms ease' }}
              />
            </Link>
          </motion.div>

          {/* Desktop / tablet: centered links + right-aligned actions */}
          {!isMobile && (
            <>
              <nav
                aria-label="Main navigation"
                style={{
                  flex: '0 0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: isTablet ? 20 : 34,
                }}
              >
                {navLinks.map(({ label, to }) => (
                  <NavItem
                    key={label}
                    to={to}
                    label={label}
                    active={location.pathname === to}
                  />
                ))}
              </nav>

              <div
                style={{
                  flex: '1 1 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: isTablet ? 8 : 12,
                }}
              >
                {!isTablet && searchField()}

                <IconButton to="/wishlist" label="Wishlist" badge={count}>
                  <Heart size={18} />
                </IconButton>
                <IconButton to="/checkout" label="Cart" badge={cartCount}>
                  <ShoppingBag size={18} />
                </IconButton>

                {isDashboard ? (
                  <LogoutButton onClick={handleLogout} />
                ) : (
                  <IconButton to="/my-account" label="My Account" badge={0}>
                    <User size={18} />
                  </IconButton>
                )}
              </div>
            </>
          )}

          {/* Mobile: hamburger */}
          {isMobile && (
            <motion.button
              type="button"
              className="fnav-hamburger"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              whileTap={{ scale: 0.9 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: C.primary,
                background: C.glassStrong,
                border: `1px solid ${C.border}`,
                cursor: 'pointer',
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex' }}
                >
                  {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          )}
        </div>

        {/* Mobile dropdown glass panel */}
        <AnimatePresence>
          {isMobile && menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{
                width: '100%',
                padding: 18,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 18px 44px rgba(111,41,64,0.14)',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              <nav
                aria-label="Mobile navigation"
                style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}
              >
                {navLinks.map(({ label, to }) => {
                  const activeLink = location.pathname === to;
                  return (
                    <Link
                      key={label}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        textDecoration: 'none',
                        fontSize: 15,
                        fontWeight: activeLink ? 600 : 500,
                        color: activeLink ? C.primary : C.text,
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: activeLink ? 'rgba(111,41,64,0.08)' : 'transparent',
                      }}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>

              <div style={{ marginBottom: 14 }}>{searchField(true)}</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <IconButton to="/wishlist" label="Wishlist" badge={count}>
                  <Heart size={18} />
                </IconButton>
                <IconButton to="/checkout" label="Cart" badge={cartCount}>
                  <ShoppingBag size={18} />
                </IconButton>
                {isDashboard ? (
                  <LogoutButton onClick={handleLogout} />
                ) : (
                  <IconButton to="/my-account" label="My Account" badge={0}>
                    <User size={18} />
                  </IconButton>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
