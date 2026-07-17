import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Leaf,
  CreditCard,
  Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { fetchProductById } from '../services/products';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const styles = {
  page: {
    background: '#f7e9ee',
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    maxWidth: 1180,
    margin: '0 auto',
    padding: '32px 20px 80px',
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    fontWeight: 600,
    color: '#5c2436',
    textDecoration: 'none',
    marginBottom: 28,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 56,
    alignItems: 'start',
  },
  imageCard: {
    background: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(92,36,54,0.12)',
    aspectRatio: '1 / 1',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  info: {
    paddingTop: 8,
  },
  category: {
    display: 'inline-block',
    background: '#e9bccb',
    color: '#5c2436',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    padding: '6px 14px',
    borderRadius: 999,
    marginBottom: 18,
  },
  name: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 46,
    color: '#5c2436',
    margin: '0 0 10px',
  },
  price: {
    fontSize: 26,
    fontWeight: 600,
    color: '#2a2420',
    margin: '0 0 22px',
  },
  description: {
    fontSize: 15,
    lineHeight: 1.7,
    color: '#5c534d',
    margin: '0 0 30px',
    maxWidth: 480,
  },
  qtyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    marginBottom: 26,
  },
  qtyLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#2a2420',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: '#fff',
    borderRadius: 999,
    padding: '8px 16px',
    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
  },
  stepBtn: {
    background: '#f0d9e3',
    border: 'none',
    width: 30,
    height: 30,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#5c2436',
  },
  qtyValue: {
    fontSize: 15,
    fontWeight: 600,
    minWidth: 20,
    textAlign: 'center',
    color: '#2a2420',
  },
  actions: {
    display: 'flex',
    gap: 14,
    marginBottom: 34,
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    background: '#5c2436',
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '14px 30px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  wishBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    background: '#fff',
    color: '#5c2436',
    border: '1px solid #e9bccb',
    borderRadius: 999,
    padding: '14px 22px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  wishBtnActive: {
    background: '#5c2436',
    color: '#fff',
    borderColor: '#5c2436',
  },
  buyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    background: '#8a3a4d',
    color: '#fff',
    border: 'none',
    borderRadius: 999,
    padding: '14px 30px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
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
  stockIn: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2f8a4d',
    margin: '0 0 22px',
  },
  stockOut: {
    fontSize: 14,
    fontWeight: 600,
    color: '#c0392b',
    margin: '0 0 22px',
  },
  perks: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    borderTop: '1px solid #e9bccb',
    paddingTop: 24,
  },
  perk: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontSize: 13,
    color: '#5c534d',
  },
  perkIcon: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#f0d9e3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#5c2436',
    flexShrink: 0,
  },
  notFound: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  notFoundTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontSize: 34,
    color: '#5c2436',
    margin: '0 0 12px',
  },
};

export default function FlowerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState('');
  const { isWished, toggle } = useWishlist();
  const cart = useCart();

  // Fetch the flower from the backend API (with local fallback) by id.
  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchProductById(id)
      .then((p) => {
        if (active) setProduct(p);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const wished = product ? isWished(product.id) : false;

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar variant="dashboard" />
        <div style={styles.notFound}>
          <p style={{ color: '#8a3a4d' }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.page}>
        <Navbar variant="dashboard" />
        <div style={styles.notFound}>
          <h2 style={styles.notFoundTitle}>Flower not found</h2>
          <p style={{ color: '#8a3a4d', marginBottom: 24 }}>
            We couldn't find the bloom you were looking for.
          </p>
          <Link to="/dashboard" style={styles.back}>
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const hasStockInfo = product.stock !== null && product.stock !== undefined;
  const outOfStock = hasStockInfo && product.stock <= 0;

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () =>
    setQuantity((q) => (hasStockInfo ? Math.min(product.stock, q + 1) : q + 1));

  // Mirrors the custom-bouquet cart shape (notably `stems`) so the cart summary
  // and order placement — which flattens stems into API line items — work for
  // single products too.
  const buildCartItem = () => ({
    type: 'product',
    name: product.name,
    stems: [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty: quantity,
      },
    ],
    stemCount: quantity,
    message: '',
    delivery: null,
    flowersTotal: product.price * quantity,
    total: product.price * quantity,
    thumbnail: product.image,
  });

  const handleAddToCart = () => {
    if (outOfStock) return;
    cart.addItem(buildCartItem());
    setToast(`${quantity} × ${product.name} added to cart`);
    setTimeout(() => setToast(''), 2400);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    cart.addItem(buildCartItem());
    navigate('/checkout');
  };

  return (
    <div style={styles.page}>
      <Navbar variant="dashboard" />

      <div style={styles.container}>
        <button
          onClick={() => navigate(-1)}
          style={{ ...styles.back, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div style={styles.layout}>
          <div style={styles.imageCard}>
            <img src={product.image} alt={product.name} style={styles.image} />
          </div>

          <div style={styles.info}>
            {product.category && <span style={styles.category}>{product.category}</span>}
            <h1 style={styles.name}>{product.name}</h1>
            <p style={styles.price}>Rs. {product.price}</p>
            {hasStockInfo && (
              <p style={outOfStock ? styles.stockOut : styles.stockIn}>
                {outOfStock ? 'Out of stock' : `In stock — ${product.stock} available`}
              </p>
            )}
            {product.description && <p style={styles.description}>{product.description}</p>}

            <div style={styles.qtyRow}>
              <span style={styles.qtyLabel}>Quantity</span>
              <div style={styles.stepper}>
                <button onClick={decrease} style={styles.stepBtn} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span style={styles.qtyValue}>{quantity}</span>
                <button onClick={increase} style={styles.stepBtn} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div style={{ ...styles.actions, flexWrap: 'wrap' }}>
              <button
                style={{ ...styles.addBtn, ...(outOfStock ? styles.btnDisabled : {}) }}
                disabled={outOfStock}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={16} /> Add to Cart · Rs. {product.price * quantity}
              </button>
              <button
                style={{ ...styles.buyBtn, ...(outOfStock ? styles.btnDisabled : {}) }}
                disabled={outOfStock}
                onClick={handleBuyNow}
              >
                <CreditCard size={16} /> Buy Now
              </button>
              <button
                onClick={() => toggle(product.id)}
                style={{ ...styles.wishBtn, ...(wished ? styles.wishBtnActive : {}) }}
                aria-label="Add to wishlist"
              >
                <Heart size={16} fill={wished ? '#fff' : 'none'} />
                {wished ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            <div style={styles.perks}>
              <div style={styles.perk}>
                <span style={styles.perkIcon}>
                  <Truck size={16} />
                </span>
                Free same-day delivery on orders placed before 2 PM.
              </div>
              <div style={styles.perk}>
                <span style={styles.perkIcon}>
                  <Leaf size={16} />
                </span>
                Fresh, hand-picked blooms sourced from local growers.
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div style={styles.toast}>
          <Check size={16} /> {toast}
        </div>
      )}
    </div>
  );
}
