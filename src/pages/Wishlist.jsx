import { Link } from 'react-router-dom';
import { Heart, Plus, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { getProductById } from '../data/products';
import { useWishlist } from '../context/WishlistContext';

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
  header: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 40,
    color: '#5c2436',
    margin: 0,
  },
  clearAll: {
    background: 'none',
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    color: '#8a3a4d',
    cursor: 'pointer',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#8a3a4d',
    margin: '0 0 32px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
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
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.92)',
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

  // Empty state
  empty: {
    textAlign: 'center',
    padding: '70px 20px',
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: '50%',
    background: '#f0d9e3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    color: '#5c2436',
  },
  emptyTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontSize: 30,
    color: '#5c2436',
    margin: '0 0 8px',
  },
  emptyText: {
    fontSize: 14,
    color: '#8a3a4d',
    margin: '0 0 24px',
  },
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

export default function Wishlist() {
  const { ids, remove, clear } = useWishlist();

  // Map stored ids to full products, dropping any that no longer exist.
  const items = ids.map((id) => getProductById(id)).filter(Boolean);

  return (
    <div style={styles.page}>
      <Navbar variant="dashboard" />

      <div style={styles.container}>
        {items.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>
              <Heart size={32} />
            </div>
            <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
            <p style={styles.emptyText}>
              Tap the heart on any bloom to save it here for later.
            </p>
            <Link to="/shop" style={styles.shopBtn}>
              Browse Bouquets
            </Link>
          </div>
        ) : (
          <>
            <div style={styles.header}>
              <h1 style={styles.title}>My Wishlist</h1>
              <button style={styles.clearAll} onClick={clear}>
                Clear All
              </button>
            </div>
            <p style={styles.subtitle}>
              {items.length} {items.length === 1 ? 'bloom' : 'blooms'} saved
            </p>

            <div style={styles.grid}>
              {items.map((product) => (
                <Link to={`/flower/${product.id}`} style={styles.card} key={product.id}>
                  <div style={styles.imageWrap}>
                    <img src={product.image} alt={product.name} style={styles.image} />
                    <button
                      style={styles.removeBtn}
                      aria-label="Remove from wishlist"
                      onClick={(e) => {
                        e.preventDefault();
                        remove(product.id);
                      }}
                    >
                      <Trash2 size={14} color="#5c2436" />
                    </button>
                  </div>
                  <div style={styles.info}>
                    <p style={styles.name}>{product.name}</p>
                    <p style={styles.price}>Rs. {product.price}</p>
                    <button
                      style={styles.addBtn}
                      aria-label="Add to cart"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Plus size={14} color="#fff" />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
