import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingBag, Search, User, LogOut } from 'lucide-react';
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

const styles = {
  navbar: {
    background: '#f7e9ee',
    padding: '6px 32px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.05)',
    position: 'relative',
    zIndex: 10,
  },
  inner: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: "'Poppins', sans-serif",
  },
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
    flexShrink: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logoImg: {
    height: 64,
    width: 'auto',
    display: 'block',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 22,
  },
  link: {
    fontSize: 14,
    fontWeight: 400,
    color: '#4a4a4a',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    background: '#f0d9e3',
    borderRadius: 999,
    padding: '6px 14px',
    minWidth: 150,
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 12,
    width: '100%',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: '#2a2420',
    cursor: 'pointer',
    display: 'flex',
    padding: 3,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    padding: '0 4px',
    borderRadius: 999,
    background: '#5c2436',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  },
  logoutBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    background: '#5c2436',
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default function Navbar({ variant = 'landing' }) {
  const navigate = useNavigate();
  const navLinks = NAV_LINKS_BY_VARIANT[variant] || NAV_LINKS_BY_VARIANT.landing;
  const isDashboard = variant === 'dashboard';
  const { count, refresh } = useWishlist();
  const { count: cartCount, refresh: refreshCart } = useCart();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Keep the search box showing whatever's in the URL (e.g. after navigating
  // straight to a /shop?search=... link, or after it's cleared elsewhere).
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

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

  return (
    <header style={styles.navbar}>
      <div style={styles.inner}>
        <div style={styles.leftGroup}>
          <Link to={isDashboard ? '/dashboard' : '/'} style={styles.logo}>
            <img src="/image/florafy-logo.png" alt="Florafy" style={styles.logoImg} />
          </Link>
        </div>

        <div style={styles.actions}>
          <nav style={styles.links} aria-label="Main navigation">
            {navLinks.map(({ label, to }) => (
              <Link key={label} to={to} style={styles.link}>
                {label}
              </Link>
            ))}
          </nav>

          <form style={styles.search} onSubmit={handleSearch}>
            <Search size={15} color="#5c534d" />
            <input
              type="text"
              placeholder="Search for blooms..."
              aria-label="Search for blooms"
              style={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </form>
          <Link to="/wishlist" style={styles.iconBtn} aria-label="Wishlist">
            <Heart size={18} />
            {count > 0 && <span style={styles.badge}>{count}</span>}
          </Link>
          <Link to="/checkout" style={styles.iconBtn} aria-label="Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>

          {isDashboard ? (
            <button style={styles.logoutBtn} onClick={handleLogout} aria-label="Log out">
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <Link to="/my-account" style={styles.iconBtn} aria-label="My Account">
              <User size={18} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}