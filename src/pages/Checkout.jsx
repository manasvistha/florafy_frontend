import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Check, Landmark } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

// Simple promo codes (code -> % off the flowers subtotal).
const PROMOS = { FIRST10: 0.1, BLOOM20: 0.2 };

function useIsNarrow(breakpoint = 860) {
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth <= breakpoint);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [breakpoint]);
  return narrow;
}

function itemMeta(ci) {
  const stems = (ci.stems || []).map((s) => `${s.name} x ${s.qty}`).join(', ');
  return [stems, ci.message ? 'with message card' : ''].filter(Boolean).join(', ');
}

const styles = {
  page: { background: '#f7e9ee', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" },
  container: { maxWidth: 1120, margin: '0 auto', padding: '36px 20px 80px' },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 360px',
    gap: 32,
    alignItems: 'start',
  },
  layoutNarrow: { gridTemplateColumns: '1fr' },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 40,
    color: '#3a2b2f',
    margin: '0 0 24px',
  },

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
  thumb: { width: 64, height: 64, borderRadius: 10, objectFit: 'cover', background: '#f4e6ec', flexShrink: 0 },
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

  // ---- Summary panel ----
  panel: {
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 8px 26px rgba(92,36,54,0.10)',
    padding: '24px 24px 28px',
    position: 'sticky',
    top: 24,
  },
  panelTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 24,
    color: '#3a2b2f',
    margin: '0 0 16px',
    paddingBottom: 16,
    borderBottom: '1px solid #f0dae2',
  },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14, color: '#5c534d', marginBottom: 12 },
  rowLabel: { display: 'flex', alignItems: 'center', gap: 8 },
  rowValue: { fontWeight: 700, color: '#2a2420' },
  discountValue: { fontWeight: 700, color: '#b23a52' },
  codeBadge: {
    background: '#e2f5e8',
    color: '#2f8a4d',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.4,
    padding: '3px 8px',
    borderRadius: 6,
    textTransform: 'uppercase',
  },

  promoWrap: { display: 'flex', gap: 8, margin: '14px 0 4px' },
  promoInput: {
    flex: 1,
    minWidth: 0,
    border: '1px solid #e0c4d0',
    borderRadius: 10,
    padding: '9px 12px',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    textTransform: 'uppercase',
  },
  promoBtn: {
    background: '#5c2436',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '0 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  promoError: { fontSize: 12, color: '#c0392b', margin: '2px 2px 0' },
  promoBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    background: '#eaf7ee',
    border: '1px solid #bfe6cb',
    borderRadius: 10,
    padding: '10px 12px',
    margin: '12px 0 4px',
    fontSize: 12.5,
    color: '#2f8a4d',
    fontWeight: 500,
  },
  promoBoxIcon: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#2f8a4d',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  clearPromo: { background: 'none', border: 'none', color: '#8a3a4d', fontSize: 11, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto' },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingTop: 18,
    borderTop: '1px solid #f0dae2',
  },
  totalLabel: { fontSize: 17, fontWeight: 700, color: '#2a2420' },
  totalValue: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: 30,
    color: '#a23a52',
  },
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
    marginTop: 20,
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
  secureLabel: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    color: '#a08a92',
    textTransform: 'uppercase',
    margin: '26px 0 12px',
  },
  payRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12 },
  payChip: {
    background: '#fbeef2',
    borderRadius: 8,
    padding: '7px 12px',
    fontSize: 12,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

  // ---- Address modal ----
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(43,20,28,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 100,
  },
  modal: { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 440, padding: '26px 28px', maxHeight: '90vh', overflowY: 'auto' },
  modalTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 26,
    color: '#5c2436',
    margin: '0 0 18px',
  },
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
  errorBox: {
    background: '#fdecea',
    border: '1px solid #f5c2c0',
    color: '#c62828',
    fontSize: 13,
    padding: '10px 14px',
    borderRadius: 10,
    marginBottom: 14,
  },
  modalActions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 },
  ghostBtn: { background: '#f0d9e1', color: '#5c2436', border: 'none', borderRadius: 10, padding: '11px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  placeBtn: { background: '#2e5d2f', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
};

export default function Checkout() {
  const navigate = useNavigate();
  const { items, removeItem, updateQty, clear } = useCart();
  const isNarrow = useIsNarrow();

  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null); // { code, rate }
  const [promoError, setPromoError] = useState('');

  const [showAddress, setShowAddress] = useState(false);
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '', notes: '' });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const qtyOf = (ci) => ci.qty || 1;

  const { subtotal, deliveryTotal } = useMemo(() => {
    let sub = 0;
    let del = 0;
    items.forEach((ci) => {
      const q = ci.qty || 1;
      sub += (ci.flowersTotal ?? ci.total ?? ci.price ?? 0) * q;
      del += (ci.delivery?.charge || 0) * q;
    });
    return { subtotal: sub, deliveryTotal: del };
  }, [items]);

  const discount = promo ? Math.round(subtotal * promo.rate) : 0;
  const grandTotal = subtotal + deliveryTotal - discount;

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (PROMOS[code]) {
      setPromo({ code, rate: PROMOS[code] });
      setPromoError('');
      setPromoInput('');
    } else {
      setPromo(null);
      setPromoError('Invalid promo code.');
    }
  };

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const placeOrder = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.phone || !form.street || !form.city) {
      setError('Please fill in your name, phone, street and city.');
      return;
    }
    // Flatten every bouquet's stems (× line quantity) into API order items.
    const map = new Map();
    items.forEach((ci) => {
      const q = ci.qty || 1;
      (ci.stems || []).forEach((s) => {
        map.set(s.id, (map.get(s.id) || 0) + s.qty * q);
      });
    });
    const orderItems = Array.from(map.entries()).map(([product, quantity]) => ({ product, quantity }));
    if (orderItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    const messages = items.map((ci) => ci.message).filter(Boolean);
    const notes = [form.notes, ...messages].filter(Boolean).join(' | ');

    setPlacing(true);
    try {
      await createOrder({ items: orderItems, deliveryAddress: { ...form, notes } });
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
      <div style={styles.container}>
        <h1 style={styles.title}>Your Cart</h1>

        <div style={{ ...styles.layout, ...(isNarrow ? styles.layoutNarrow : {}) }}>
          {/* -------- Cart items -------- */}
          <div>
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
          </div>

          {/* -------- Order summary -------- */}
          <aside style={styles.panel}>
            <h2 style={styles.panelTitle}>Order Summary</h2>

            <div style={styles.row}>
              <span style={styles.rowLabel}>Subtotal</span>
              <span style={styles.rowValue}>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div style={styles.row}>
              <span style={styles.rowLabel}>Delivery</span>
              <span style={styles.rowValue}>Rs. {deliveryTotal.toLocaleString()}</span>
            </div>

            {promo && (
              <div style={styles.row}>
                <span style={styles.rowLabel}>
                  Discount <span style={styles.codeBadge}>{promo.code}</span>
                </span>
                <span style={styles.discountValue}>-Rs. {discount.toLocaleString()}</span>
              </div>
            )}

            {promo ? (
              <div style={styles.promoBox}>
                <span style={styles.promoBoxIcon}>
                  <Check size={12} />
                </span>
                <span>Promo code applied! You saved Rs. {discount.toLocaleString()}</span>
                <button
                  style={styles.clearPromo}
                  onClick={() => {
                    setPromo(null);
                    setPromoError('');
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div style={styles.promoWrap}>
                  <input
                    style={styles.promoInput}
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                  />
                  <button style={styles.promoBtn} onClick={applyPromo}>
                    Apply
                  </button>
                </div>
                {promoError && <p style={styles.promoError}>{promoError}</p>}
              </>
            )}

            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalValue}>Rs. {grandTotal.toLocaleString()}</span>
            </div>

            <button style={styles.proceedBtn} onClick={() => setShowAddress(true)}>
              Proceed to Checkout
            </button>
            <button style={styles.continueBtn} onClick={() => navigate('/shop')}>
              Continue Shopping
            </button>

            <p style={styles.secureLabel}>Secure Payment Via</p>
            <div style={styles.payRow}>
              <span style={{ ...styles.payChip, color: '#3aa05a' }}>eSewa</span>
              <span style={{ ...styles.payChip, color: '#5b2d8e' }}>Khalti</span>
              <span style={{ ...styles.payChip, color: '#5c534d' }}>
                <Landmark size={16} />
              </span>
            </div>
          </aside>
        </div>
      </div>

      {/* -------- Delivery address modal -------- */}
      {showAddress && (
        <div style={styles.overlay} onClick={() => setShowAddress(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Delivery Details</h3>
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

              <div style={styles.modalActions}>
                <button type="button" style={styles.ghostBtn} onClick={() => setShowAddress(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...styles.placeBtn, ...(placing ? styles.btnDisabled : {}) }}
                  disabled={placing}
                >
                  {placing ? 'Placing…' : `Place Order · Rs. ${grandTotal.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
