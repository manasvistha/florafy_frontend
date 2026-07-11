import { useState } from 'react';
import { Heart, Plus, Search } from 'lucide-react';
import Navbar from '../components/Navbar';

const CATEGORIES = ['All Flowers', 'Birthday', 'Anniversary', 'Decoration'];

const PRODUCTS = [
  { id: 1, name: 'Rose', price: 850, image: '/image/products/rose.jpg' },
  { id: 2, name: 'Tulip', price: 1000, image: '/image/products/tulip.jpg' },
  { id: 3, name: 'Lily', price: 900, image: '/image/products/lily.jpg' },
  { id: 4, name: 'Sunflower', price: 1200, image: '/image/products/sunflower.jpg' },
  { id: 5, name: 'Pink Rose', price: 1000, image: '/image/products/rosepink.jpg' },
  { id: 6, name: 'Mixed', price: 900, image: '/image/products/mixed.jpg' },
  { id: 7, name: 'Hibiscus', price: 500, image: '/image/products/hibiscus.jpg' },
  { id: 8, name: 'Daisy', price: 400, image: '/image/products/daisy.jpg' },
  { id: 9, name: 'Blue Rose', price: 1600, image: '/image/products/roseblue.jpg' },
  { id: 10, name: 'Lotus', price: 800, image: '/image/products/lotus.jpg' },
  { id: 11, name: 'Mixed Rose', price: 850, image: '/image/products/rosemix.jpg' },
  { id: 12, name: 'Tulip', price: 1000, image: '/image/products/tulip.jpg' },
  { id: 13, name: 'Orchid', price: 1500, image: '/image/products/orchid.jpg' },
];

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
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 20,
  },
  card: {
    background: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
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
};

export default function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('All Flowers');

  return (
    <div style={styles.page}>
      <Navbar />

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
          <a href="/shop" style={styles.viewAll}>VIEW ALL</a>
        </div>

        <div style={styles.grid}>
          {PRODUCTS.map((product, index) => (
            <div style={styles.card} key={`${product.id}-${index}`}>
              <div style={styles.imageWrap}>
                <img src={product.image} alt={product.name} style={styles.image} />
                <button style={styles.heartBtn} aria-label="Add to wishlist">
                  <Heart size={14} />
                </button>
              </div>
              <div style={styles.info}>
                <p style={styles.name}>{product.name}</p>
                <p style={styles.price}>Rs. {product.price}</p>
                <button style={styles.addBtn} aria-label="Add to cart">
                  <Plus size={14} color="#fff" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}