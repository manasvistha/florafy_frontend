import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Check,
  CreditCard,
  Banknote,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { createOrder, getMyOrders } from '../services/api';
import { fetchProducts } from '../services/products';

const STEPS = ['Cart', 'Delivery Details', 'Payment', 'Delivery'];

const PAYMENT_METHODS = [
  { id: 'esewa', label: 'eSewa Mobile Wallet', chip: 'eSewa', chipBg: '#48b04a', chipFg: '#fff' },
  { id: 'khalti', label: 'Khalti Wallet', chip: 'Khalti', chipBg: '#5c2d91', chipFg: '#fff' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
];

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
  container: { maxWidth: 1060, margin: '0 auto', padding: '30px 20px 80px' },

  // ---- Stepper ----
  stepper: { display: 'flex', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 30 },
  step: { display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    background: '#fff',
    color: '#b9a4ab',
    border: '1px solid #e6d2da',
  },
  stepDone: { background: '#3f7d4f', color: '#fff', border: '1px solid #3f7d4f' },
  stepActive: { background: '#e9a6a6', color: '#7a2f36', border: '1px solid #e9a6a6' },
  stepLabel: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#a08a92',
    marginTop: 6,
  },
  stepLabelOn: { color: '#7a2f36' },
  stepLine: { height: 1, background: '#e6d2da', flex: 1, marginTop: 13, minWidth: 30 },

  layout: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 26, alignItems: 'start' },
  layoutNarrow: { gridTemplateColumns: '1fr' },

  card: {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 4px 18px rgba(92,36,54,0.07)',
    padding: '24px 26px',
    marginBottom: 22,
  },
  cardTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 22,
    color: '#a34a52',
    margin: '0 0 20px',
  },

  // ---- Form ----
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 11.5, fontWeight: 600, color: '#5c534d', margin: '0 0 6px' },
  input: {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #ecdde3',
    background: 'transparent',
    padding: '7px 0',
    fontSize: 13.5,
    outline: 'none',
    fontFamily: 'inherit',
    color: '#2a2420',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    minHeight: 54,
    resize: 'vertical',
    border: 'none',
    borderBottom: '1px solid #ecdde3',
    background: 'transparent',
    padding: '7px 0',
    fontSize: 13.5,
    outline: 'none',
    fontFamily: 'inherit',
    color: '#2a2420',
    boxSizing: 'border-box',
  },
  dateRow: { display: 'flex', gap: 16 },

  // ---- Payment ----
  payRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    border: '1px solid #f0e2e8',
    borderRadius: 10,
    padding: '12px 14px',
    marginBottom: 10,
    cursor: 'pointer',
    background: '#fff',
  },
  payRowActive: { border: '1px solid #a34a52', background: '#fdf6f8' },
  payChip: {
    width: 34,
    height: 26,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 8.5,
    fontWeight: 800,
    flexShrink: 0,
  },
  payIconChip: {
    width: 34,
    height: 26,
    borderRadius: 6,
    background: '#f2eef0',
    color: '#6b5c62',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  payLabel: { fontSize: 13.5, fontWeight: 500, color: '#2a2420', flex: 1 },
  radio: {
    width: 15,
    height: 15,
    borderRadius: '50%',
    border: '1px solid #d9c2ca',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioOn: { border: '1px solid #a34a52' },
  radioDot: { width: 7, height: 7, borderRadius: '50%', background: '#a34a52' },
  secureNote: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#eef6f0',
    borderRadius: 8,
    padding: '11px 12px',
    fontSize: 11.5,
    color: '#4a7d59',
    marginTop: 6,
  },

  // ---- Summary ----
  summary: {
    background: '#f2e7ea',
    borderRadius: 14,
    padding: '22px 22px',
    position: 'sticky',
    top: 24,
  },
  sumTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 20,
    color: '#a34a52',
    margin: '0 0 18px',
  },
  sumRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: '#5c534d', marginBottom: 10 },
  sumDivider: { border: 'none', borderTop: '1px solid #e0cdd4', margin: '14px 0' },
  sumTotalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  sumTotalLabel: { fontSize: 16, fontWeight: 700, color: '#2a2420' },
  sumTotalValue: { fontSize: 17, fontWeight: 700, color: '#2a2420' },
  placeBtn: {
    width: '100%',
    marginTop: 22,
    padding: '15px',
    background: '#a34a3f',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontSize: 17,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 6px 18px rgba(163,74,63,0.28)',
  },
  btnDisabled: { opacity: 0.55, cursor: 'not-allowed' },
  errorBox: {
    background: '#fdecea',
    border: '1px solid #f5c2c0',
    color: '#c62828',
    fontSize: 13,
    padding: '10px 14px',
    borderRadius: 10,
    marginBottom: 16,
  },
  staleBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    background: '#fff6e6',
    border: '1px solid #f2d69a',
    color: '#9a6b16',
    fontSize: 12.5,
    padding: '10px 14px',
    borderRadius: 10,
    marginBottom: 16,
  },
  staleBtn: {
    background: '#9a6b16',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(43,20,28,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 200,
  },
  successModal: {
    background: '#fff',
    borderRadius: 18,
    padding: '34px 30px',
    maxWidth: 360,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: '#3f7d4f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 18px',
  },
  successTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 26,
    color: '#5c2436',
    margin: '0 0 8px',
  },
  successText: {
    fontSize: 13.5,
    color: '#8a3a4d',
    lineHeight: 1.5,
    margin: '0 0 22px',
  },
  successBtn: {
    width: '100%',
    padding: '13px',
    background: '#8f3a4a',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  emptyCart: {
    background: '#fff',
    borderRadius: 14,
    padding: '30px 26px',
    textAlign: 'center',
    boxShadow: '0 4px 18px rgba(92,36,54,0.07)',
    marginBottom: 22,
  },
  emptyCartText: { fontSize: 14, color: '#8a3a4d', margin: '0 0 16px' },
  shopBtn: {
    display: 'inline-block',
    background: '#5c2436',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 999,
    padding: '11px 24px',
    fontSize: 13.5,
    fontWeight: 600,
  },

  // ---- Past orders ----
  historyTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 30,
    color: '#5c2436',
    margin: '48px 0 18px',
  },
  orderCard: {
    background: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
  },
  orderTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  status: {
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 999,
    background: '#e9bccb',
    color: '#5c2436',
  },
  orderItems: { fontSize: 13, color: '#5c534d' },
  orderMeta: { fontSize: 12, color: '#999', marginTop: 6 },
  historyEmpty: { textAlign: 'center', padding: '30px 20px', color: '#8a3a4d', fontSize: 14 },
};

function Stepper({ statuses }) {
  return (
    <div style={styles.stepper}>
      {STEPS.map((label, i) => {
        const done = statuses[i] === 'done';
        const active = statuses[i] === 'active';
        return (
          <div key={label} style={{ display: 'contents' }}>
            <div style={styles.step}>
              <div
                style={{
                  ...styles.stepCircle,
                  ...(done ? styles.stepDone : {}),
                  ...(active ? styles.stepActive : {}),
                }}
              >
                {done ? <Check size={13} /> : i + 1}
              </div>
              <span style={{ ...styles.stepLabel, ...(done || active ? styles.stepLabelOn : {}) }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div style={styles.stepLine} />}
          </div>
        );
      })}
    </div>
  );
}

export default function MyOrders() {
  const navigate = useNavigate();
  const location = useLocation();
  const isNarrow = useIsNarrow();
  const { items, removeMany } = useCart();

  // Promo carried over from the cart page (if the user applied one there).
  const promo = location.state?.promo || null;

  // Only the lines ticked on the cart page get checked out. Arriving here
  // directly (no state) falls back to the whole cart.
  const selectedIds = location.state?.selectedIds || null;
  const checkoutItems = selectedIds
    ? items.filter((ci) => selectedIds.includes(ci.cartId))
    : items;

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    landmark: '',
    date: '',
    time: '',
    giftMessage: '',
  });
  const [payment, setPayment] = useState('esewa');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false); // success popup

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Live product ids, to detect stale cart items (built before the catalogue
  // moved to the DB) that would otherwise fail at checkout.
  const [validIds, setValidIds] = useState(null); // null = still loading

  const loadOrders = () => {
    setLoadingOrders(true);
    getMyOrders()
      .then((list) => setOrders(list || []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  };

  useEffect(loadOrders, []);

  useEffect(() => {
    fetchProducts()
      .then((list) => setValidIds(new Set(list.map((p) => String(p.id)))))
      .catch(() => setValidIds(new Set()));
  }, []);

  const isStale = (ci) =>
    validIds ? (ci.stems || []).some((s) => !validIds.has(String(s.id))) : false;
  const staleItems = checkoutItems.filter(isStale);

  // Step states: Cart is done; Delivery Details greens when filled; Payment
  // greens when a method is picked; final Delivery activates when ready.
  const detailsFilled =
    form.firstName && form.lastName && form.phone && form.address && form.city;
  const paymentSelected = !!payment;
  const stepStatuses = [
    'done',
    detailsFilled ? 'done' : 'active',
    paymentSelected ? 'done' : 'todo',
    detailsFilled && paymentSelected && staleItems.length === 0 ? 'active' : 'todo',
  ];

  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // Totals from the selected cart lines (each bouquet's total already includes
  // its delivery).
  let subtotal = 0;
  let deliveryTotal = 0;
  checkoutItems.forEach((ci) => {
    const q = ci.qty || 1;
    subtotal += (ci.flowersTotal ?? ci.total ?? 0) * q;
    deliveryTotal += (ci.delivery?.charge || 0) * q;
  });
  const discount = promo ? Math.round(subtotal * promo.rate) : 0;
  const grandTotal = subtotal + deliveryTotal - discount;

  const placeOrder = async () => {
    setError('');
    if (!form.firstName || !form.lastName || !form.phone || !form.address || !form.city) {
      setError('Please fill in your name, phone, address and city.');
      return;
    }
    if (staleItems.length > 0) {
      setError('Some items are no longer available. Please remove them below to continue.');
      return;
    }

    const map = new Map();
    checkoutItems.forEach((ci) => {
      const q = ci.qty || 1;
      (ci.stems || []).forEach((s) => map.set(s.id, (map.get(s.id) || 0) + s.qty * q));
    });
    const orderItems = Array.from(map.entries()).map(([product, quantity]) => ({ product, quantity }));
    if (orderItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    const notes = [
      form.landmark && `Landmark: ${form.landmark}`,
      (form.date || form.time) && `Preferred: ${form.date} ${form.time}`.trim(),
      form.giftMessage && `Gift note: ${form.giftMessage}`,
      ...checkoutItems.map((ci) => ci.message).filter(Boolean),
    ]
      .filter(Boolean)
      .join(' | ');

    setPlacing(true);
    try {
      await createOrder({
        items: orderItems,
        paymentMethod: payment,
        deliveryAddress: {
          fullName: `${form.firstName} ${form.lastName}`.trim(),
          phone: form.phone,
          street: form.address,
          city: form.city,
          notes,
        },
      });
      // Only clear what was actually ordered — unselected lines stay in the cart.
      removeMany(checkoutItems.map((ci) => ci.cartId));
      loadOrders();
      setPlaced(true); // show the success popup
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  const hasCart = checkoutItems.length > 0;

  return (
    <div style={styles.page}>
      <Navbar variant="dashboard" />
      <div style={styles.container}>
        {hasCart && <Stepper statuses={stepStatuses} />}

        {hasCart ? (
          <div style={{ ...styles.layout, ...(isNarrow ? styles.layoutNarrow : {}) }}>
            {/* -------- Left: delivery + payment -------- */}
            <div>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Delivery Details</h2>
                {error && <div style={styles.errorBox}>{error}</div>}

                {staleItems.length > 0 && (
                  <div style={styles.staleBox}>
                    <span>
                      {staleItems.map((ci) => ci.name).join(', ')}{' '}
                      {staleItems.length === 1 ? 'is' : 'are'} no longer available.
                    </span>
                    <button
                      style={styles.staleBtn}
                      onClick={() => removeMany(staleItems.map((ci) => ci.cartId))}
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div style={styles.grid2}>
                  <div style={styles.field}>
                    <label style={styles.label}>First Name</label>
                    <input style={styles.input} placeholder="First name" value={form.firstName} onChange={setField('firstName')} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Last Name</label>
                    <input style={styles.input} placeholder="Last name" value={form.lastName} onChange={setField('lastName')} />
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Phone</label>
                  <input style={styles.input} placeholder="+977 98XXXXXXXX" value={form.phone} onChange={setField('phone')} />
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Full Address</label>
                  <input style={styles.input} placeholder="Street name, House No." value={form.address} onChange={setField('address')} />
                </div>

                <div style={styles.grid2}>
                  <div style={styles.field}>
                    <label style={styles.label}>City</label>
                    <input style={styles.input} placeholder="Kathmandu" value={form.city} onChange={setField('city')} />
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Landmark (Optional)</label>
                    <input style={styles.input} placeholder="Near Patan Durbar" value={form.landmark} onChange={setField('landmark')} />
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Preferred Delivery Date &amp; Time</label>
                  <div style={styles.dateRow}>
                    <input style={styles.input} type="date" value={form.date} onChange={setField('date')} />
                    <input style={styles.input} type="time" value={form.time} onChange={setField('time')} />
                  </div>
                </div>

                <div style={{ ...styles.field, marginBottom: 0 }}>
                  <label style={styles.label}>Gift Message (Optional)</label>
                  <textarea
                    style={styles.textarea}
                    placeholder="Write a heartfelt note..."
                    value={form.giftMessage}
                    onChange={setField('giftMessage')}
                  />
                </div>
              </div>

              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Payment Method</h2>
                {PAYMENT_METHODS.map((m) => {
                  const active = payment === m.id;
                  const Icon = m.icon;
                  return (
                    <div
                      key={m.id}
                      style={{ ...styles.payRow, ...(active ? styles.payRowActive : {}) }}
                      onClick={() => setPayment(m.id)}
                    >
                      {m.chip ? (
                        <span style={{ ...styles.payChip, background: m.chipBg, color: m.chipFg }}>
                          {m.chip}
                        </span>
                      ) : (
                        <span style={styles.payIconChip}>
                          <Icon size={15} />
                        </span>
                      )}
                      <span style={styles.payLabel}>{m.label}</span>
                      <span style={{ ...styles.radio, ...(active ? styles.radioOn : {}) }}>
                        {active && <span style={styles.radioDot} />}
                      </span>
                    </div>
                  );
                })}
                <div style={styles.secureNote}>
                  <ShieldCheck size={14} />
                  Your payment is 100% secure and encrypted.
                </div>
              </div>
            </div>

            {/* -------- Right: order summary -------- */}
            <aside style={styles.summary}>
              <h2 style={styles.sumTitle}>Order Summary</h2>
              {checkoutItems.map((ci) => (
                <div key={ci.cartId} style={styles.sumRow}>
                  <span>
                    {ci.name}
                    {(ci.qty || 1) > 1 ? ` × ${ci.qty}` : ''}
                  </span>
                  <span>Rs. {(ci.flowersTotal ?? ci.total ?? 0) * (ci.qty || 1)}</span>
                </div>
              ))}
              <hr style={styles.sumDivider} />
              <div style={styles.sumRow}>
                <span>Delivery</span>
                <span>Rs. {deliveryTotal}</span>
              </div>
              {promo && (
                <div style={styles.sumRow}>
                  <span>Discount</span>
                  <span style={{ color: '#b23a52' }}>-Rs. {discount}</span>
                </div>
              )}
              <hr style={styles.sumDivider} />
              <div style={styles.sumTotalRow}>
                <span style={styles.sumTotalLabel}>Total</span>
                <span style={styles.sumTotalValue}>Rs. {grandTotal.toLocaleString()}</span>
              </div>

              <button
                style={{
                  ...styles.placeBtn,
                  ...(placing || staleItems.length > 0 ? styles.btnDisabled : {}),
                }}
                onClick={placeOrder}
                disabled={placing || staleItems.length > 0}
              >
                {placing ? 'Placing…' : 'Place Order'} <ArrowRight size={16} />
              </button>
            </aside>
          </div>
        ) : (
          <div style={styles.emptyCart}>
            <p style={styles.emptyCartText}>
              You have nothing in your cart to check out right now.
            </p>
            <Link to="/shop" style={styles.shopBtn}>
              Browse Bouquets
            </Link>
          </div>
        )}

        {/* -------- Past orders -------- */}
        <h2 style={styles.historyTitle}>Past Orders</h2>
        {loadingOrders && <p style={styles.historyEmpty}>Loading your orders…</p>}
        {!loadingOrders && orders.length === 0 && (
          <div style={styles.historyEmpty}>You haven't placed any orders yet.</div>
        )}
        {orders.map((order) => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderTop}>
              <strong>Rs. {order.totalPrice}</strong>
              <span style={styles.status}>{order.status}</span>
            </div>
            <div style={styles.orderItems}>
              {order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}
            </div>
            <div style={styles.orderMeta}>
              {new Date(order.createdAt).toLocaleDateString()}
              {order.deliveryAddress?.city ? ` · ${order.deliveryAddress.city}` : ''}
              {order.paymentMethod ? ` · ${order.paymentMethod.toUpperCase()}` : ''}
            </div>
          </div>
        ))}
      </div>

      {/* -------- Success popup -------- */}
      {placed && (
        <div style={styles.overlay} onClick={() => setPlaced(false)}>
          <div style={styles.successModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.successIcon}>
              <Check size={34} color="#fff" />
            </div>
            <h3 style={styles.successTitle}>Order Placed Successfully!</h3>
            <p style={styles.successText}>
              Thank you for shopping with Florafy. Your blooms are on their way 🌸
            </p>
            <button style={styles.successBtn} onClick={() => setPlaced(false)}>
              View My Orders
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
