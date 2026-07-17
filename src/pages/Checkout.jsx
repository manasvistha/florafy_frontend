import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';
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
  subtitle: { fontSize: 13, color: '#8a3a4d', margin: '0 0 18px' },

  selectAllRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    cursor: 'pointer',
    userSelect: 'none',
  },
  selectAllText: { fontSize: 13, fontWeight: 600, color: '#5c2436' },

  // ---- Cart items ----
  itemCard: {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 3px 12px rgba(92,36,54,0.06)',
    marginBottom: 16,
    border: '1px solid transparent',
    overflow: 'hidden',
  },
  itemCardSelected: { border: '1px solid #e2b6c2' },
  itemRow: {
    padding: '16px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    cursor: 'pointer',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    border: '1.5px solid #d9c2ca',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: 'pointer',
  },
  checkboxOn: { background: '#5c2436', border: '1.5px solid #5c2436' },
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
  chevron: { color: '#c9a5b3', display: 'flex', flexShrink: 0 },

  // ---- Expanded details ----
  details: {
    borderTop: '1px solid #f4e6ec',
    background: '#fdf7f9',
    padding: '14px 18px 16px',
  },
  detailsLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: '#8a3a4d',
    margin: '0 0 10px',
  },
  stemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '6px 0',
    fontSize: 13,
    color: '#2a2420',
  },
  stemThumb: { width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', background: '#f0d9e1' },
  stemName: { flex: 1, minWidth: 0 },
  stemQty: { color: '#8a8a8a', fontSize: 12.5 },
  stemPrice: { fontWeight: 600, minWidth: 62, textAlign: 'right' },
  detailLine: {
    fontSize: 12.5,
    color: '#5c534d',
    margin: '10px 0 0',
    paddingTop: 10,
    borderTop: '1px solid #f0dae2',
  },
  detailStrong: { fontWeight: 600, color: '#2a2420' },

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
  btnDisabled: { opacity: 0.5, cursor: 'not-allowed' },

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

  // Track DEselected ids rather than selected ones, so anything newly added to
  // the cart is selected by default without extra bookkeeping.
  const [deselected, setDeselected] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const qtyOf = (ci) => ci.qty || 1;
  const isSelected = (id) => !deselected.includes(id);
  const selectedItems = items.filter((ci) => isSelected(ci.cartId));
  const allSelected = items.length > 0 && selectedItems.length === items.length;

  const toggleSelect = (id) =>
    setDeselected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleAll = () =>
    setDeselected(allSelected ? items.map((i) => i.cartId) : []);

  // Only the selected lines go through to the delivery step.
  const goToDelivery = () => {
    if (selectedItems.length === 0) return;
    navigate('/my-orders', { state: { selectedIds: selectedItems.map((i) => i.cartId) } });
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
        <p style={styles.subtitle}>
          {selectedItems.length} of {items.length} selected · tap an item to see what's inside
        </p>

        <div style={styles.selectAllRow} onClick={toggleAll}>
          <span style={{ ...styles.checkbox, ...(allSelected ? styles.checkboxOn : {}) }}>
            {allSelected && <Check size={13} color="#fff" />}
          </span>
          <span style={styles.selectAllText}>
            {allSelected ? 'Deselect all' : 'Select all'}
          </span>
        </div>

        {items.map((ci) => {
          const selected = isSelected(ci.cartId);
          const open = expandedId === ci.cartId;
          return (
            <div
              key={ci.cartId}
              style={{ ...styles.itemCard, ...(selected ? styles.itemCardSelected : {}) }}
            >
              <div
                style={styles.itemRow}
                onClick={() => setExpandedId(open ? null : ci.cartId)}
              >
                <span
                  style={{ ...styles.checkbox, ...(selected ? styles.checkboxOn : {}) }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(ci.cartId);
                  }}
                  role="checkbox"
                  aria-checked={selected}
                  aria-label={`Select ${ci.name}`}
                >
                  {selected && <Check size={13} color="#fff" />}
                </span>

                {ci.thumbnail ? (
                  <img src={ci.thumbnail} alt={ci.name} style={styles.thumb} />
                ) : (
                  <div style={styles.thumb} />
                )}

                <div style={styles.itemMid}>
                  <p style={styles.itemName}>{ci.name}</p>
                  <p style={styles.itemMetaText}>{itemMeta(ci)}</p>
                  <button
                    style={styles.removeLink}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(ci.cartId);
                    }}
                  >
                    Remove
                  </button>
                </div>

                <div style={styles.stepper} onClick={(e) => e.stopPropagation()}>
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
                <span style={styles.chevron}>
                  {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                </span>
              </div>

              {open && (
                <div style={styles.details}>
                  <p style={styles.detailsLabel}>What's inside</p>
                  {(ci.stems || []).map((s, i) => (
                    <div key={`${s.id}-${i}`} style={styles.stemRow}>
                      {s.image ? (
                        <img src={s.image} alt={s.name} style={styles.stemThumb} />
                      ) : (
                        <div style={styles.stemThumb} />
                      )}
                      <span style={styles.stemName}>{s.name}</span>
                      <span style={styles.stemQty}>× {s.qty}</span>
                      <span style={styles.stemPrice}>Rs. {s.price * s.qty}</span>
                    </div>
                  ))}

                  {ci.message && (
                    <p style={styles.detailLine}>
                      <span style={styles.detailStrong}>Message card:</span> “{ci.message}”
                    </p>
                  )}
                  {ci.delivery && (
                    <p style={styles.detailLine}>
                      <span style={styles.detailStrong}>Delivery:</span> {ci.delivery.label} — Rs.{' '}
                      {ci.delivery.charge}
                    </p>
                  )}
                  {qtyOf(ci) > 1 && (
                    <p style={styles.detailLine}>
                      <span style={styles.detailStrong}>Quantity:</span> {qtyOf(ci)} × Rs.{' '}
                      {ci.total} = Rs. {(ci.total || 0) * qtyOf(ci)}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div style={styles.actions}>
          <button
            style={{
              ...styles.proceedBtn,
              ...(selectedItems.length === 0 ? styles.btnDisabled : {}),
            }}
            onClick={goToDelivery}
            disabled={selectedItems.length === 0}
          >
            Proceed to Checkout
            {selectedItems.length > 0 ? ` (${selectedItems.length})` : ''}
          </button>
          <button style={styles.continueBtn} onClick={() => navigate('/shop')}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
