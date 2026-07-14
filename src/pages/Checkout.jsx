import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

const styles = {
  page: { background: '#f7e9ee', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 360px',
    gap: 28,
    maxWidth: 1000,
    margin: '0 auto',
    padding: '40px 20px 80px',
    alignItems: 'start',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 38,
    color: '#5c2436',
    margin: '0 0 24px',
    gridColumn: '1 / -1',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 6px 22px rgba(92,36,54,0.09)',
    padding: '22px 22px',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#8a3a4d',
    margin: '0 0 16px',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 0',
    borderBottom: '1px solid #f4e6ec',
  },
  thumb: { width: 48, height: 48, borderRadius: 10, objectFit: 'cover', background: '#f4e6ec' },
  itemName: { fontSize: 14, fontWeight: 600, color: '#2a2420', margin: '0 0 2px' },
  itemMeta: { fontSize: 12, color: '#8a8a8a', margin: 0 },
  itemPrice: { fontSize: 14, fontWeight: 600, color: '#2a2420', marginLeft: 'auto', whiteSpace: 'nowrap' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#c0392b', display: 'flex' },

  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#5c534d', margin: '0 0 6px' },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d9b8c4',
    fontSize: 14,
    outline: 'none',
    marginBottom: 14,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  row2: { display: 'flex', gap: 12 },
  errorBox: {
    background: '#fdecea',
    border: '1px solid #f5c2c0',
    color: '#c62828',
    fontSize: 13,
    padding: '10px 14px',
    borderRadius: 10,
    marginBottom: 14,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTop: '1px solid #f0dae2',
  },
  totalLabel: { fontSize: 15, fontWeight: 700, color: '#2a2420' },
  totalValue: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: 24,
    color: '#8a3a4d',
  },
  placeBtn: {
    width: '100%',
    padding: '14px',
    background: '#2e5d2f',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 18,
  },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontSize: 30,
    color: '#5c2436',
    margin: '0 0 10px',
  },
  emptyText: { fontSize: 14, color: '#8a3a4d', marginBottom: 22 },
  shopBtn: {
    display: 'inline-block',
    background: '#5c2436',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 999,
    padding: '12px 28px',
    fontSize: 14,
    fontWeight: 600,
  },
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, removeItem, clear, total } = useCart();

  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '', notes: '' });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // Flatten every bouquet's stems into { product, quantity } lines for the API.
  const buildOrderItems = () => {
    const map = new Map();
    items.forEach((ci) => {
      (ci.stems || []).forEach((s) => {
        map.set(s.id, (map.get(s.id) || 0) + s.qty);
      });
    });
    return Array.from(map.entries()).map(([product, quantity]) => ({ product, quantity }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.phone || !form.street || !form.city) {
      setError('Please fill in your name, phone, street and city.');
      return;
    }
    const orderItems = buildOrderItems();
    if (orderItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    // Carry any bouquet messages along in the delivery notes.
    const messages = items.map((ci) => ci.message).filter(Boolean);
    const notes = [form.notes, ...messages].filter(Boolean).join(' | ');

    setPlacing(true);
    try {
      await createOrder({
        items: orderItems,
        deliveryAddress: { ...form, notes },
      });
      clear();
      navigate('/my-orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={styles.page}>
        <Navbar variant="dashboard" />
        <div style={styles.empty}>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>Build a bouquet or browse the shop to get started.</p>
          <Link to="/build-bouquet" style={styles.shopBtn}>
            Build a Bouquet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Navbar variant="dashboard" />
      <div style={styles.layout}>
        <h1 style={styles.title}>Checkout</h1>

        {/* Order summary */}
        <div style={styles.card}>
          <p style={styles.sectionTitle}>Your Order</p>
          {items.map((ci) => (
            <div key={ci.cartId} style={styles.itemRow}>
              {ci.thumbnail ? (
                <img src={ci.thumbnail} alt={ci.name} style={styles.thumb} />
              ) : (
                <div style={styles.thumb} />
              )}
              <div style={{ minWidth: 0 }}>
                <p style={styles.itemName}>{ci.name}</p>
                <p style={styles.itemMeta}>
                  {ci.stemCount} stems ·{' '}
                  {(ci.stems || []).map((s) => `${s.qty}× ${s.name}`).join(', ')}
                </p>
                {ci.delivery && (
                  <p style={styles.itemMeta}>{ci.delivery.label}</p>
                )}
              </div>
              <span style={styles.itemPrice}>Rs. {ci.total}</span>
              <button
                style={styles.removeBtn}
                onClick={() => removeItem(ci.cartId)}
                aria-label="Remove"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>Rs. {total}</span>
          </div>
        </div>

        {/* Delivery details */}
        <div style={styles.card}>
          <p style={styles.sectionTitle}>Delivery Details</p>
          {error && <div style={styles.errorBox}>{error}</div>}
          <form onSubmit={placeOrder}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} value={form.fullName} onChange={setField('fullName')} />

            <label style={styles.label}>Phone</label>
            <input style={styles.input} value={form.phone} onChange={setField('phone')} />

            <label style={styles.label}>Street Address</label>
            <input style={styles.input} value={form.street} onChange={setField('street')} />

            <label style={styles.label}>City</label>
            <input style={styles.input} value={form.city} onChange={setField('city')} />

            <label style={styles.label}>Delivery Notes (optional)</label>
            <input style={styles.input} value={form.notes} onChange={setField('notes')} />

            <button
              type="submit"
              style={{ ...styles.placeBtn, ...(placing ? styles.btnDisabled : {}) }}
              disabled={placing}
            >
              <ShoppingBag size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              {placing ? 'Placing Order…' : `Place Order · Rs. ${total}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
