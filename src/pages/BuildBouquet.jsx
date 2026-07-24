import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, Sparkles, ShoppingBag, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchProducts } from '../services/products';
import { useCart } from '../context/CartContext';

const DELIVERY_OPTIONS = [
  { id: 'express', label: 'Express (2 hours)', charge: 150 },
  { id: 'sameday', label: 'Same Day', charge: 100 },
  { id: 'nextday', label: 'Next Day', charge: 60 },
];

// Shared breakpoint hook (page uses inline styles, so no CSS media queries).
function useIsNarrow(breakpoint = 900) {
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

const styles = {
  page: { background: '#f7e9ee', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 7fr) minmax(0, 3fr)',
    gap: 28,
    maxWidth: 1180,
    margin: '0 auto',
    padding: '32px 20px 80px',
    alignItems: 'start',
  },
  layoutNarrow: { gridTemplateColumns: '1fr', gap: 24 },

  // ---- Left ----
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#f0d9e1',
    color: '#8a3a4d',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    padding: '6px 14px',
    borderRadius: 999,
    marginBottom: 14,
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 40,
    color: '#5c2436',
    margin: '0 0 8px',
  },
  subtitle: { fontSize: 14, color: '#8a3a4d', margin: '0 0 28px', maxWidth: 520 },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 },
  gridTablet: { gridTemplateColumns: 'repeat(3, 1fr)' },
  gridMobile: { gridTemplateColumns: 'repeat(2, 1fr)' },

  card: {
    background: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'transparent',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease',
    position: 'relative',
  },
  cardSelected: { borderColor: '#c0526b' },
  imageWrap: { position: 'relative', width: '100%', aspectRatio: '1 / 1' },
  image: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  qtyBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    minWidth: 22,
    height: 22,
    padding: '0 6px',
    borderRadius: 999,
    background: '#5c2436',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { padding: '10px 12px 14px', position: 'relative' },
  name: { fontSize: 13, fontWeight: 600, color: '#2a2420', margin: '0 0 2px' },
  price: { fontSize: 12, color: '#8a8a8a', margin: 0 },
  addBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 26,
    height: 26,
    borderRadius: '50%',
    background: '#5c2436',
    border: 'none',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  // ---- Preview ----
  previewLabel: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#8a3a4d',
    margin: '36px 0 12px',
  },
  previewBox: {
    border: '2px dashed #d8a9b8',
    borderRadius: 16,
    background: '#fbeef2',
    padding: '32px 24px',
    textAlign: 'center',
    minHeight: 150,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
    maxWidth: 460,
  },
  thumb: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
  },
  thumbMore: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#e9bccb',
    color: '#5c2436',
    fontSize: 12,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: { fontSize: 14, fontWeight: 600, color: '#5c2436', margin: '0 0 2px' },
  previewCount: { fontSize: 13, color: '#8a3a4d', margin: 0 },
  previewEmpty: { fontSize: 14, color: '#b48a9a' },

  // ---- Sidebar (now matches Shop.jsx's filter sidebar: color + scrollbar) ----
  sidebar: {
    background: '#f0d9e1',
    borderRadius: 18,
    padding: '22px 20px',
    position: 'sticky',
    top: 24,
    alignSelf: 'start',
    maxHeight: 'calc(100vh - 48px)',
    overflowY: 'auto',
    scrollbarWidth: 'thin', // Firefox
    scrollbarColor: '#c96f86 transparent', // Firefox: thumb, track
  },
  sidebarStatic: { position: 'static', top: 'auto', maxHeight: 'none', overflowY: 'visible' },
  sideTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 24,
    color: '#5c2436',
    margin: '0 0 2px',
  },
  sideSub: { fontSize: 12, color: '#8a3a4d', margin: '0 0 18px' },

  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#fff',
    borderRadius: 12,
    padding: '10px 12px',
    marginBottom: 10,
  },
  itemQty: {
    fontSize: 12,
    fontWeight: 700,
    color: '#5c2436',
    background: '#f0d9e1',
    borderRadius: 8,
    padding: '3px 7px',
    whiteSpace: 'nowrap',
  },
  itemName: { fontSize: 13, fontWeight: 600, color: '#2a2420', flex: 1, minWidth: 0 },
  itemPrice: { fontSize: 13, fontWeight: 600, color: '#2a2420', whiteSpace: 'nowrap' },
  stepper: { display: 'flex', alignItems: 'center', gap: 6 },
  stepBtn: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    border: 'none',
    outline: 'none',
    background: '#e9bccb',
    color: '#5c2436',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    color: '#c0392b',
  },
  emptyItems: { fontSize: 13, color: '#b48a9a', padding: '8px 0 16px' },

  fieldLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#8a3a4d',
    margin: '16px 0 8px',
  },
  textarea: {
    width: '100%',
    minHeight: 68,
    resize: 'vertical',
    borderRadius: 10,
    border: '1px solid #e0c4d0',
    background: '#fff',
    padding: '10px 12px',
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#2a2420',
  },
  select: {
    width: '100%',
    borderRadius: 10,
    border: '1px solid #e0c4d0',
    background: '#fff',
    padding: '11px 12px',
    fontSize: 13,
    fontFamily: 'inherit',
    outline: 'none',
    cursor: 'pointer',
    color: '#2a2420',
  },
  divider: { border: 'none', borderTop: '1px solid #e0c4d0', margin: '20px 0 14px' },
  costRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 13,
    color: '#5c534d',
    marginBottom: 8,
  },
  free: { color: '#2e8a4d', fontWeight: 600 },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 14,
    borderTop: '1px solid #e0c4d0',
  },
  totalLabel: { fontSize: 15, fontWeight: 700, color: '#2a2420' },
  totalValue: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: 26,
    color: '#8a3a4d',
  },
  addToCartBtn: {
    width: '100%',
    padding: '14px',
    background: '#8a3a4d',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  orderBtn: {
    width: '100%',
    padding: '14px',
    background: '#2e5d2f',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  toast: {
    position: 'fixed',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#5c2436',
    color: '#fff',
    padding: '12px 22px',
    borderRadius: 999,
    fontSize: 14,
    fontWeight: 600,
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    zIndex: 200,
  },
  loading: { textAlign: 'center', padding: '40px 0', color: '#8a3a4d' },
};

export default function BuildBouquet() {
  const navigate = useNavigate();
  const cart = useCart();
  const isNarrow = useIsNarrow(900);
  const isMobile = useIsNarrow(560);

  // Buildable flowers come live from the backend (single source of truth).
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchProducts()
      // Only single stems the admin flagged as buildable — not full bouquets.
      .then((list) => active && setProducts(list.filter((p) => p.buildable)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Selected stems keyed by product id: { [id]: { id, name, price, image, qty } }
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState('');
  const [deliveryId, setDeliveryId] = useState('express');
  const [toast, setToast] = useState('');

  const addOne = (product) => {
    setSelected((prev) => {
      const existing = prev[product.id];
      return {
        ...prev,
        [product.id]: existing
          ? { ...existing, qty: existing.qty + 1 }
          : { id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 },
      };
    });
  };

  const toggleCard = (product) => {
    setSelected((prev) => {
      if (prev[product.id]) {
        // Already selected — clicking the card again removes it entirely.
        const next = { ...prev };
        delete next[product.id];
        return next;
      }
      // Not selected yet — clicking adds exactly one stem.
      return {
        ...prev,
        [product.id]: { id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 },
      };
    });
  };

  const decOne = (id) => {
    setSelected((prev) => {
      const existing = prev[id];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: { ...existing, qty: existing.qty - 1 } };
    });
  };

  const removeStem = (id) => {
    setSelected((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const selectedList = useMemo(() => Object.values(selected), [selected]);
  const stemCount = selectedList.reduce((n, s) => n + s.qty, 0);
  const flowersTotal = selectedList.reduce((sum, s) => sum + s.price * s.qty, 0);
  const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId);
  const deliveryCharge = stemCount > 0 ? delivery.charge : 0;
  const grandTotal = flowersTotal + deliveryCharge;

  // One thumbnail per stem for the preview (capped so it doesn't overflow).
  const stemThumbs = [];
  selectedList.forEach((s) => {
    for (let i = 0; i < s.qty; i += 1) stemThumbs.push(s);
  });
  const shownThumbs = stemThumbs.slice(0, 18);
  const extraThumbs = stemThumbs.length - shownThumbs.length;

  const buildBouquetItem = () => ({
    type: 'custom-bouquet',
    name: 'Custom Bouquet',
    stems: selectedList,
    stemCount,
    message: message.trim(),
    delivery: { id: delivery.id, label: delivery.label, charge: delivery.charge },
    flowersTotal,
    total: grandTotal,
    thumbnail: selectedList[0]?.image || '',
  });

  const reset = () => {
    setSelected({});
    setMessage('');
    setDeliveryId('express');
  };

  const handleAddToCart = () => {
    if (stemCount === 0) return;
    cart.addItem(buildBouquetItem());
    setToast('Custom bouquet added to cart');
    reset();
    setTimeout(() => setToast(''), 2500);
  };

  const handleOrderNow = () => {
    if (stemCount === 0) return;
    cart.addItem(buildBouquetItem());
    navigate('/checkout');
  };

  const gridStyle = {
    ...styles.grid,
    ...(isMobile ? styles.gridMobile : isNarrow ? styles.gridTablet : {}),
  };

  return (
    <div style={styles.page}>
      <style>{`
        .bouquet-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .bouquet-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .bouquet-sidebar::-webkit-scrollbar-thumb {
          background: #c96f86;
          border-radius: 999px;
        }
        .bouquet-sidebar::-webkit-scrollbar-thumb:hover {
          background: #a85a6d;
        }
        .flower-card,
        .flower-card:focus,
        .flower-card:focus-visible,
        .flower-card * {
          outline: none !important;
        }
      `}</style>
      <Navbar variant="dashboard" />

      <div style={{ ...styles.layout, ...(isNarrow ? styles.layoutNarrow : {}) }}>
        {/* ---------------- Left: builder ---------------- */}
        <section>
          <span style={styles.tag}>
            <Sparkles size={13} /> Custom Builder
          </span>
          <h1 style={styles.title}>Build Your Perfect Bouquet</h1>
          <p style={styles.subtitle}>
            Pick your flowers, choose your colours, and we'll arrange them beautifully.
          </p>

          <div style={gridStyle}>
            {loading && <p style={styles.loading}>Loading flowers…</p>}
            {!loading && products.length === 0 && (
              <p style={styles.loading}>No flowers available yet.</p>
            )}
            {products.map((product) => {
                const sel = selected[product.id];
                return (
                  <div
                    key={product.id}
                    className="flower-card"
                    style={{ ...styles.card, ...(sel ? styles.cardSelected : {}) }}
                    onClick={() => toggleCard(product)}
                  >
                    <div style={styles.imageWrap}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={styles.image}
                        draggable={false}
                      />
                      {sel && <span style={styles.qtyBadge}>{sel.qty}</span>}
                    </div>
                    <div style={styles.info}>
                      <p style={styles.name}>{product.name}</p>
                      <p style={styles.price}>Rs. {product.price}</p>
                      <button
                        style={styles.addBtn}
                        aria-label={`Add ${product.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          addOne(product);
                        }}
                      >
                        <Plus size={15} color="#fff" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Bouquet Preview */}
          <p style={styles.previewLabel}>Bouquet Preview</p>
          <div style={styles.previewBox}>
            {stemCount === 0 ? (
              <p style={styles.previewEmpty}>
                Your bouquet is empty — add some blooms to see them here.
              </p>
            ) : (
              <>
                <div style={styles.thumbRow}>
                  {shownThumbs.map((s, i) => (
                    <img key={i} src={s.image} alt={s.name} style={styles.thumb} />
                  ))}
                  {extraThumbs > 0 && <span style={styles.thumbMore}>+{extraThumbs}</span>}
                </div>
                <p style={styles.previewTitle}>Your custom bouquet</p>
                <p style={styles.previewCount}>
                  {stemCount} {stemCount === 1 ? 'stem' : 'stems'} selected
                </p>
              </>
            )}
          </div>
        </section>

        {/* ---------------- Right: summary ---------------- */}
        <aside
          className="bouquet-sidebar"
          style={{ ...styles.sidebar, ...(isNarrow ? styles.sidebarStatic : {}) }}
        >
          <h2 style={styles.sideTitle}>Your Bouquet</h2>
          <p style={styles.sideSub}>
            {stemCount} {stemCount === 1 ? 'stem' : 'stems'} selected
          </p>

          {selectedList.length === 0 ? (
            <p style={styles.emptyItems}>No flowers added yet.</p>
          ) : (
            selectedList.map((s) => (
              <div key={s.id} style={styles.itemRow}>
                <span style={styles.itemQty}>{s.qty}×</span>
                <span style={styles.itemName}>{s.name}</span>
                <div style={styles.stepper}>
                  <button style={styles.stepBtn} onClick={() => decOne(s.id)} aria-label="Decrease">
                    <Minus size={12} />
                  </button>
                  <button style={styles.stepBtn} onClick={() => addOne(s)} aria-label="Increase">
                    <Plus size={12} />
                  </button>
                </div>
                <span style={styles.itemPrice}>Rs. {s.price * s.qty}</span>
                <button
                  style={styles.removeBtn}
                  onClick={() => removeStem(s.id)}
                  aria-label={`Remove ${s.name}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}

          <p style={styles.fieldLabel}>Add a message</p>
          <textarea
            style={styles.textarea}
            placeholder="Write a personal note (optional)…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <p style={styles.fieldLabel}>Delivery</p>
          <select
            style={styles.select}
            value={deliveryId}
            onChange={(e) => setDeliveryId(e.target.value)}
          >
            {DELIVERY_OPTIONS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label} — Rs. {d.charge}
              </option>
            ))}
          </select>

          <hr style={styles.divider} />

          <div style={styles.costRow}>
            <span>Flowers ({stemCount} {stemCount === 1 ? 'stem' : 'stems'})</span>
            <span>Rs. {flowersTotal}</span>
          </div>
          <div style={styles.costRow}>
            <span>Message card</span>
            <span style={styles.free}>Free</span>
          </div>
          <div style={styles.costRow}>
            <span>{delivery.label}</span>
            <span>Rs. {deliveryCharge}</span>
          </div>

          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>Rs. {grandTotal}</span>
          </div>

          <button
            style={{ ...styles.addToCartBtn, ...(stemCount === 0 ? styles.btnDisabled : {}) }}
            onClick={handleAddToCart}
            disabled={stemCount === 0}
          >
            <ShoppingBag size={16} /> Add to Cart
          </button>
          <button
            style={{ ...styles.orderBtn, ...(stemCount === 0 ? styles.btnDisabled : {}) }}
            onClick={handleOrderNow}
            disabled={stemCount === 0}
          >
            Order Now
          </button>
        </aside>
      </div>

      {toast && (
        <div style={styles.toast}>
          <Check size={16} /> {toast}
        </div>
      )}
    </div>
  );
}