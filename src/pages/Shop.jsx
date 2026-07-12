import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, CalendarDays, Wallet, Truck } from 'lucide-react';
import Navbar from '../components/Navbar';
import { PRODUCTS } from '../data/products';
import { useWishlist } from '../context/WishlistContext';

const CATEGORIES = ['All Flowers', 'Birthday', 'Anniversary', 'Decoration'];
const OCCASIONS = ['Birthday', 'Anniversary', 'Decoration'];
const DELIVERY_OPTIONS = [
  { id: 'express', label: 'Express (2hr)', hint: 'Fastest availability' },
  { id: 'sameday', label: 'Same Day', hint: 'By 6:00 PM' },
  { id: 'scheduled', label: 'Scheduled', hint: 'Choose a date' },
];

const PRICE_MIN = 200;
const PRICE_MAX = 1500;

const styles = {
  page: {
    background: '#f7e9ee',
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif",
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    maxWidth: 1180,
    margin: '0 auto',
    gap: 32,
    padding: '32px 20px 80px',
    alignItems: 'start',
  },

  // ---- Sidebar ----
  sidebar: {
    background: '#f0d9e1',
    borderRadius: 18,
    padding: '26px 22px',
    position: 'sticky',
    top: 24,
  },
  sidebarHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  sidebarTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 24,
    color: '#5c2436',
    margin: 0,
  },
  clearAll: {
    background: 'none',
    border: 'none',
    fontSize: 12,
    fontWeight: 600,
    color: '#5c2436',
    cursor: 'pointer',
  },
  sectionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.8,
    color: '#8a3a4d',
    textTransform: 'uppercase',
    margin: '24px 0 14px',
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    cursor: 'pointer',
    fontSize: 14,
    color: '#2a2420',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '2px solid #c99fb0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#fff',
    flexShrink: 0,
  },
  radioChecked: {
    border: '2px solid #5c2436',
    background: '#5c2436',
  },
  // Price
  slider: {
    width: '100%',
    accentColor: '#c96f86',
    margin: '10px 0 16px',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
  },
  pricePill: {
    background: '#fff',
    borderRadius: 999,
    padding: '8px 14px',
    fontSize: 12,
    fontWeight: 500,
    color: '#5c534d',
  },
  // Delivery cards
  deliveryCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    borderRadius: 12,
    padding: '12px 14px',
    marginBottom: 10,
    cursor: 'pointer',
    border: '1px solid transparent',
  },
  deliveryCardActive: {
    border: '1px solid #c96f86',
  },
  deliveryLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2a2420',
    margin: 0,
  },
  deliveryHint: {
    fontSize: 11,
    color: '#8a8a8a',
    margin: '2px 0 0',
  },
  // Sidebar buttons
  applyBtn: {
    width: '100%',
    padding: '14px',
    background: '#8a3a4d',
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.6,
    cursor: 'pointer',
    marginTop: 24,
  },
  clearBtn: {
    width: '100%',
    padding: '13px',
    background: '#fff',
    color: '#8a3a4d',
    border: '1px solid #d8a9b8',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.6,
    cursor: 'pointer',
    marginTop: 12,
  },

  // ---- Main ----
  main: {},
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 40,
    color: '#5c2436',
    margin: '0 0 24px',
  },
  pillRow: {
    display: 'flex',
    gap: 14,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  pill: {
    padding: '10px 22px',
    borderRadius: 999,
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    background: '#e9bccb',
    color: '#2a2420',
  },
  pillActive: {
    background: '#5c2436',
    color: '#fff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
  },
  card: {
    background: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    cursor: 'pointer',
  },
  imageWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  info: {
    padding: '10px 12px 14px',
    position: 'relative',
  },
  name: {
    fontSize: 13,
    fontWeight: 600,
    color: '#2a2420',
    margin: '0 0 2px',
  },
  price: {
    fontSize: 12,
    color: '#8a8a8a',
    margin: 0,
  },
  addBtn: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: '#5c2436',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  empty: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: '#8a3a4d',
    padding: '40px 0',
    fontSize: 14,
  },
};

const DEFAULT_FILTERS = { occasion: '', maxPrice: PRICE_MAX, delivery: 'express' };

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All Flowers');
  const { isWished, toggle } = useWishlist();

  // Draft = what's shown in the sidebar; applied = what actually filters the grid.
  const [draft, setDraft] = useState(DEFAULT_FILTERS);
  const [applied, setApplied] = useState(DEFAULT_FILTERS);

  const applyFilters = () => setApplied(draft);
  const clearAll = () => {
    setDraft(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
    setActiveCategory('All Flowers');
  };

  const visibleProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const byCategory = activeCategory === 'All Flowers' || p.category === activeCategory;
      const byOccasion = !applied.occasion || p.category === applied.occasion;
      const byPrice = p.price <= applied.maxPrice;
      return byCategory && byOccasion && byPrice;
    });
  }, [activeCategory, applied]);

  return (
    <div style={styles.page}>
      <Navbar variant="dashboard" />

      <div style={styles.layout}>
        {/* -------- Filters sidebar -------- */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHead}>
            <h2 style={styles.sidebarTitle}>Filters</h2>
            <button style={styles.clearAll} onClick={clearAll}>
              Clear All
            </button>
          </div>

          {/* Occasion */}
          <div style={styles.sectionLabel}>
            <CalendarDays size={14} /> Occasion
          </div>
          {OCCASIONS.map((occ) => {
            const checked = draft.occasion === occ;
            return (
              <div
                key={occ}
                style={styles.optionRow}
                onClick={() =>
                  setDraft((d) => ({ ...d, occasion: checked ? '' : occ }))
                }
              >
                <span>{occ}</span>
                <span style={{ ...styles.radioOuter, ...(checked ? styles.radioChecked : {}) }}>
                  {checked && (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </div>
            );
          })}

          {/* Price range */}
          <div style={styles.sectionLabel}>
            <Wallet size={14} /> Price Range
          </div>
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={10}
            value={draft.maxPrice}
            onChange={(e) => setDraft((d) => ({ ...d, maxPrice: Number(e.target.value) }))}
            style={styles.slider}
            aria-label="Maximum price"
          />
          <div style={styles.priceRow}>
            <span style={styles.pricePill}>Min: Rs. {PRICE_MIN}</span>
            <span style={styles.pricePill}>Max: Rs. {draft.maxPrice.toLocaleString()}</span>
          </div>

          {/* Delivery */}
          <div style={styles.sectionLabel}>
            <Truck size={14} /> Delivery
          </div>
          {DELIVERY_OPTIONS.map((opt) => {
            const active = draft.delivery === opt.id;
            return (
              <div
                key={opt.id}
                style={{ ...styles.deliveryCard, ...(active ? styles.deliveryCardActive : {}) }}
                onClick={() => setDraft((d) => ({ ...d, delivery: opt.id }))}
              >
                <div>
                  <p style={styles.deliveryLabel}>{opt.label}</p>
                  <p style={styles.deliveryHint}>{opt.hint}</p>
                </div>
                <span style={{ ...styles.radioOuter, ...(active ? styles.radioChecked : {}) }}>
                  {active && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#fff',
                      }}
                    />
                  )}
                </span>
              </div>
            );
          })}

          <button style={styles.applyBtn} onClick={applyFilters}>
            APPLY FILTERS
          </button>
          <button style={styles.clearBtn} onClick={clearAll}>
            CLEAR ALL
          </button>
        </aside>

        {/* -------- Main content -------- */}
        <main style={styles.main}>
          <h1 style={styles.title}>All Bouquets</h1>

          <div style={styles.pillRow}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  ...styles.pill,
                  ...(activeCategory === cat ? styles.pillActive : {}),
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={styles.grid}>
            {visibleProducts.length === 0 && (
              <p style={styles.empty}>No bouquets match your filters.</p>
            )}
            {visibleProducts.map((product, index) => (
              <Link
                to={`/flower/${product.id}`}
                style={styles.card}
                key={`${product.id}-${index}`}
              >
                <div style={styles.imageWrap}>
                  <img src={product.image} alt={product.name} style={styles.image} />
                  <button
                    style={styles.heartBtn}
                    aria-label="Add to wishlist"
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(product.id);
                    }}
                  >
                    <Heart
                      size={14}
                      color="#5c2436"
                      fill={isWished(product.id) ? '#5c2436' : 'none'}
                    />
                  </button>
                </div>
                <div style={styles.info}>
                  <p style={styles.name}>{product.name}</p>
                  <p style={styles.price}>Rs. {product.price}</p>
                  <button
                    style={styles.addBtn}
                    aria-label="Add to cart"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Plus size={14} color="#fff" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
