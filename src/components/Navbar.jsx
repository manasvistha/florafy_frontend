import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Search, User } from 'lucide-react';

const NAV_LINKS = ['Home', 'Shop', 'Build Bouquet', 'My Account'];

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
  },
};

export default function Navbar() {
  return (
    <header style={styles.navbar}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <img src="/image/florafy-logo.png" alt="Florafy" style={styles.logoImg} />
        </Link>

        <nav style={styles.links} aria-label="Main navigation">
          {NAV_LINKS.map((label) => (
            <Link
              key={label}
              to={`/${label.toLowerCase().replace(/\s+/g, '-')}`}
              style={styles.link}
            >
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
          <button style={styles.iconBtn} aria-label="Wishlist">
            <Heart size={20} />
          </button>
          <button style={styles.iconBtn} aria-label="Cart">
            <ShoppingBag size={20} />
          </button>
          <Link to="/my-account" style={styles.iconBtn} aria-label="My Account">
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}