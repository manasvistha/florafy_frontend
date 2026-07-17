import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

function itemMeta(ci) {
  const stems = (ci.stems || []).map((s) => `${s.name} x ${s.qty}`).join(', ');
  return [stems, ci.message ? 'with message card' : ''].filter(Boolean).join(', ');
}

const styles = {
  page: { background: '#f7e9ee', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" },
  container: { maxWidth: 760, margin: '0 auto', padding: '36px 20px 80px' },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 40,
    color: '#3a2b2f',
    margin: '0 0 6px',
  },
  subtitle: { fontSize: 13, color: '#8a3a4d', margin: '0 0 24px' },

  // ---- Cart items ----
  itemCard: {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 3px 12px rgba(92,36,54,0.06)',
    padding: '16px 18px',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    objectFit: 'cover',
    background: '#f4e6ec',
    flexShrink: 0,
  },
  itemMid: { flex: 1, minWidth: 0 },
  itemName: { fontSize: 15, fontWeight: 700, color: '#2a2420', margin: '0 0 3px' },
  itemMetaText: { fontSize: 12.5, color: '#8a8a8a', margin: '0 0 6px' },
  removeLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    fontSize: 13,
    fontWeight: 500,
    color: '#b23a52',
    cursor: 'pointer',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    border: '1px solid #eccdd8',
    borderRadius: 999,
    padding: '6px 12px',
  },
  stepBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#8a3a4d',
    display: 'flex',
    padding: 0,
  },
  qtyValue: { fontSize: 14, fontWeight: 600, color: '#2a2420', minWidth: 14, textAlign: 'center' },
  itemPrice: { fontSize: 15, fontWeight: 700, color: '#2a2420', minWidth: 74, textAlign: 'right' },

  // ---- Actions ----
  actions: { marginTop: 26 },
  proceedBtn: {
    width: '100%',
    padding: '14px',
    background: '#8f3a4a',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  continueBtn: {
    width: '100%',
    padding: '13px',
    background: '#fff',
    color: '#8f3a4a',
    border: '1px solid #e2b6c2',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 12,
  },

  // ---- Empty ----
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
  const { items, removeItem, updateQty } = useCart();

  const qtyOf = (ci) => ci.qty || 1;

  // Costs are broken down on the delivery step (My Orders), so the cart itself
  // just lists what's been added.
  const goToDelivery = () => navigate('/my-orders');

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

  const totalUnits = items.reduce((n, ci) => n + qtyOf(ci), 0);

  return (
    <div style={styles.page}>
      <Navbar variant="dashboard" />
      <div style={styles.container}>
        <h1 style={styles.title}>Your Cart</h1>
        <p style={styles.subtitle}>
          {totalUnits} {totalUnits === 1 ? 'item' : 'items'} added
        </p>

        {items.map((ci) => (
          <div key={ci.cartId} style={styles.itemCard}>
            {ci.thumbnail ? (
              <img src={ci.thumbnail} alt={ci.name} style={styles.thumb} />
            ) : (
              <div style={styles.thumb} />
            )}
            <div style={styles.itemMid}>
              <p style={styles.itemName}>{ci.name}</p>
              <p style={styles.itemMetaText}>{itemMeta(ci)}</p>
              <button style={styles.removeLink} onClick={() => removeItem(ci.cartId)}>
                Remove
              </button>
            </div>
            <div style={styles.stepper}>
              <button
                style={styles.stepBtn}
                onClick={() => updateQty(ci.cartId, qtyOf(ci) - 1)}
                aria-label="Decrease"
              >
                <Minus size={15} />
              </button>
              <span style={styles.qtyValue}>{qtyOf(ci)}</span>
              <button
                style={styles.stepBtn}
                onClick={() => updateQty(ci.cartId, qtyOf(ci) + 1)}
                aria-label="Increase"
              >
                <Plus size={15} />
              </button>
            </div>
            <span style={styles.itemPrice}>Rs. {(ci.total || 0) * qtyOf(ci)}</span>
          </div>
        ))}

        <div style={styles.actions}>
          <button style={styles.proceedBtn} onClick={goToDelivery}>
            Proceed to Checkout
          </button>
          <button style={styles.continueBtn} onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
