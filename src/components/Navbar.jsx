import { Heart, ShoppingBag, Search } from 'lucide-react';

const NAV_LINKS = ['Home', 'Shop', 'Build Bouquet', 'My Account'];

const styles = {
  navbar: {
    background: '#f7e9ee',
    padding: '12px 24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    position: 'relative',
    zIndex: 10,
  },

  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    fontFamily: "'Poppins', sans-serif",
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    flexShrink: 0,
  },

  logoImg: {
    height: 60,
    width: 'auto',
    display: 'block',
  },

  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    flex: 1,
    justifyContent: 'center',
  },

  link: {
    fontSize: 15,
    fontWeight: 400,
    color: '#4a4a4a',
    textDecoration: 'none',
    transition: '0.3s',
  },

  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },

  search: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#f0d9e3',
    borderRadius: 999,
    padding: '8px 14px',
    minWidth: 180,
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
};

export default function Navbar() {
  return (
    <header style={styles.navbar}>
      <div style={styles.inner}>
        {/* Logo */}
        <a href="/" style={styles.logo}>
          <img
            src="/image/florafy-logo.png"
            alt="Florafy"
            style={styles.logoImg}
          />
        </a>

        {/* Navigation Links */}
        <nav style={styles.links} aria-label="Main navigation">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href={`/${label.toLowerCase().replace(/\s+/g, '-')}`}
              style={styles.link}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={styles.actions}>
          <div style={styles.search}>
            <Search size={16} color="#5c534d" />
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              style={styles.searchInput}
            />
          </div>

          <button style={styles.iconBtn} aria-label="Wishlist">
            <Heart size={20} />
          </button>

          <button style={styles.iconBtn} aria-label="Cart">
            <ShoppingBag size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}