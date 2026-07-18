import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, Flower2, Package, LogOut } from 'lucide-react';

const NAV = [
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/products', label: 'Flowers', icon: Flower2 },
  { to: '/admin/orders', label: 'Orders', icon: Package },
];

const styles = {
  shell: {
    display: 'grid',
    gridTemplateColumns: '240px 1fr',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: "'Poppins', sans-serif",
    background: '#f7e9ee',
  },
  sidebar: {
    background: '#5c2436',
    color: '#fff',
    padding: '28px 18px',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflowY: 'auto',
  },
  brand: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: 26,
    color: '#fff',
    textDecoration: 'none',
    padding: '0 10px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    marginBottom: 18,
  },
  brandSub: {
    display: 'block',
    fontFamily: "'Poppins', sans-serif",
    fontStyle: 'normal',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    opacity: 0.6,
    marginTop: 2,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 10,
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
  },
  navItemActive: {
    background: 'rgba(255,255,255,0.14)',
    color: '#fff',
    fontWeight: 600,
  },
  spacer: { flex: 1 },
  footerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 10,
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  },
  content: {
    padding: '36px 40px 60px',
    height: '100vh',
    overflowY: 'auto',
  },
};

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <Link to="/admin/users" style={styles.brand}>
          Florafy
          <span style={styles.brandSub}>Admin Panel</span>
        </Link>

        <nav>
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                style={{ ...styles.navItem, ...(active ? styles.navItemActive : {}) }}
              >
                <Icon size={18} /> {label}
              </Link>
            );
          })}
        </nav>

        <div style={styles.spacer} />

        <button style={styles.footerLink} onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main style={styles.content}>{children}</main>
    </div>
  );
}
