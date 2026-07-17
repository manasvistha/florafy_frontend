import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { PRODUCTS } from '../data/products';
import { useWishlist } from '../context/WishlistContext';

const CATEGORIES = ['All Flowers', 'Birthday', 'Anniversary', 'Decoration'];

const styles = {
  page: {
    background: '#f7e9ee',
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '40px 20px 80px',
  },
  pillRow: {
    display: 'flex',
    gap: 14,
    marginBottom: 40,
  },
  pill: {
    padding: '11px 24px',
    borderRadius: 999,
    border: '1.5px solid #e9bccb',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    background: '#fff',
    color: '#5c2436',
  },
  pillActive: {
    background: '#5c2436',
    borderColor: '#5c2436',
    color: '#fff',
  },
  headerRow: {
    textAlign: 'center',
    position: 'relative',
    marginBottom: 36,
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 38,
    color: '#5c2436',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: 0.4,
    color: '#8a3a4d',
    margin: 0,
  },
  viewAll: {
    position: 'absolute',
    right: 0,
    top: 12,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.5,
    color: '#5c2436',
    textDecoration: 'none',
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

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('All Flowers');
  const { isWished, toggle } = useWishlist();

  // Filters the grid in place — clicking a pill never navigates anywhere.
  // The dashboard is only a highlight reel, so cap it at 12 bouquets;
  // "VIEW ALL" goes to the Shop for the full catalogue.
  const visibleProducts = useMemo(() => {
    const list =
      activeCategory === 'All Flowers'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === activeCategory);
    return list.slice(0, 12);
  }, [activeCategory]);

  return (
    <div style={styles.page}>
      <Navbar variant="dashboard" />

      <div style={styles.container}>
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

        <div style={styles.headerRow}>
          <h2 style={styles.title}>Most Loved Bouquets</h2>
          <p style={styles.subtitle}>Handpicked by our florists, loved by thousands</p>
          <Link to="/shop" style={styles.viewAll}>VIEW ALL</Link>
        </div>

        <div style={styles.grid}>
          {visibleProducts.length === 0 && (
            <p style={styles.empty}>No bouquets in this category yet.</p>
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
      </div>
    </div>
  );
}