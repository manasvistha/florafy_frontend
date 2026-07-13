import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Search, User, LogOut } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

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
    { label: 'My Orders', to: '/my-orders' },
    { label: 'Wishlist', to: '/wishlist' },
  ],
};

const styles = {
  navbar: {
    background: '#f7e9ee',
    padding: '20px 40px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    position: 'relative',
    zIndex: 10,
  },
  inner: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 32,
    fontFamily: "'Poppins', sans-serif",
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
    gap: 40,
  },
  link: {
    fontSize: 16,
    fontWeight: 400,
    color: '#4a4a4a',
    textDecoration: 'none',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#f0d9e3',
    borderRadius: 999,
    padding: '10px 18px',
    minWidth: 220,
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 13,
    width: '100%',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: '#2a2420',
    cursor: 'pointer',
    display: 'flex',
    padding: 4,
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
    gap: 6,
    background: '#5c2436',
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '9px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default function Navbar({ variant = 'landing' }) {
  const navigate = useNavigate();
  const navLinks = NAV_LINKS_BY_VARIANT[variant] || NAV_LINKS_BY_VARIANT.landing;
  const isDashboard = variant === 'dashboard';
  const { count, refresh } = useWishlist();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    refresh();
    navigate('/login');
  };

  return (
    <header style={styles.navbar}>
      <div style={styles.inner}>
        <Link to={isDashboard ? '/dashboard' : '/'} style={styles.logo}>
          <img src="/image/florafy-logo.png" alt="Florafy" style={styles.logoImg} />
        </Link>

        <nav style={styles.links} aria-label="Main navigation">
          {navLinks.map(({ label, to }) => (
            <Link key={label} to={to} style={styles.link}>
              {label}
            </Link>
          ))}
        </nav>

        <div style={styles.actions}>
          <div style={styles.search}>
            <Search size={16} color="#5c534d" />
            <input
              type="text"
              placeholder="Search for blooms..."
              aria-label="Search for blooms"
              style={styles.searchInput}
            />
          </div>
          <Link to="/wishlist" style={styles.iconBtn} aria-label="Wishlist">
            <Heart size={20} />
            {count > 0 && <span style={styles.badge}>{count}</span>}
          </Link>
          <button style={styles.iconBtn} aria-label="Cart">
            <ShoppingBag size={20} />
          </button>

          {isDashboard ? (
            <button style={styles.logoutBtn} onClick={handleLogout} aria-label="Log out">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link to="/my-account" style={styles.iconBtn} aria-label="My Account">
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}