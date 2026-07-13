import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const API_BASE_URL = 'http://localhost:5000/api';

const styles = {
  page: { background: '#f7e9ee', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" },
  container: { maxWidth: 900, margin: '0 auto', padding: '48px 20px 80px' },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 38,
    color: '#5c2436',
    margin: '0 0 28px',
  },
  card: { background: '#fff', borderRadius: 12, padding: 18, marginBottom: 14, boxShadow: '0 4px 14px rgba(0,0,0,0.05)' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  status: { fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: '#e9bccb', color: '#5c2436' },
  empty: { textAlign: 'center', padding: '60px 20px', color: '#8a3a4d' },
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <Navbar variant="dashboard" />
      <div style={styles.container}>
        <h1 style={styles.title}>My Orders</h1>

        {loading && <p>Loading your orders...</p>}

        {!loading && orders.length === 0 && (
          <div style={styles.empty}>
            You haven't placed any orders yet.
          </div>
        )}

        {orders.map((order) => (
          <div key={order._id} style={styles.card}>
            <div style={styles.row}>
              <strong>Rs. {order.totalPrice}</strong>
              <span style={styles.status}>{order.status}</span>
            </div>
            <div style={{ fontSize: 13, color: '#5c534d' }}>
              {order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}
            </div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
              {new Date(order.createdAt).toLocaleDateString()} · {order.deliveryAddress}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 