import { useCallback, useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { ui, Badge, Modal } from '../../components/admin/ui';
import { getOrders, updateOrderStatus } from '../../services/api';

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

function formatDateTime(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setOrders(await getOrders({ status: statusFilter, search }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  // Refetch when the status filter changes; debounce the search box.
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const changeStatus = async (order, status) => {
    try {
      const updated = await updateOrderStatus(order._id, status);
      setOrders((list) =>
        list.map((o) => (o._id === order._id ? { ...o, status: updated.status } : o))
      );
      if (viewing && viewing._id === order._id) {
        setViewing({ ...viewing, status: updated.status });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout>
      <div style={ui.header}>
        <div>
          <h1 style={ui.title}>Order Management</h1>
        </div>
      </div>
      <p style={ui.subtitle}>{orders.length} orders</p>

      {error && <div style={ui.errorBox}>{error}</div>}

      <div style={ui.toolbar}>
        <input
          style={ui.search}
          placeholder="Search by customer or order ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          style={ui.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div style={ui.card}>
        <table style={ui.table}>
          <thead>
            <tr>
              <th style={ui.th}>Order</th>
              <th style={ui.th}>Customer</th>
              <th style={ui.th}>Items</th>
              <th style={ui.th}>Total</th>
              <th style={ui.th}>Placed</th>
              <th style={ui.th}>Status</th>
              <th style={{ ...ui.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={ui.td} colSpan={7}>
                  <div style={ui.empty}>Loading orders…</div>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td style={ui.td} colSpan={7}>
                  <div style={ui.empty}>No orders match your filters.</div>
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o._id}>
                  <td style={{ ...ui.td, fontFamily: 'monospace', fontSize: 12 }}>
                    #{o._id.slice(-6)}
                  </td>
                  <td style={ui.td}>
                    <div style={{ fontWeight: 600 }}>{o.user?.name || 'Unknown'}</div>
                    <div style={{ fontSize: 12, color: '#8a8a8a' }}>{o.user?.email}</div>
                  </td>
                  <td style={ui.td}>
                    {o.items?.reduce((n, it) => n + it.quantity, 0)} item(s)
                  </td>
                  <td style={{ ...ui.td, fontWeight: 600 }}>Rs. {o.totalPrice}</td>
                  <td style={ui.td}>{formatDateTime(o.createdAt)}</td>
                  <td style={ui.td}>
                    <select
                      value={o.status}
                      onChange={(e) => changeStatus(o, e.target.value)}
                      style={{
                        ...ui.select,
                        padding: '7px 10px',
                        fontSize: 13,
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ ...ui.td, textAlign: 'right' }}>
                    <button
                      style={ui.iconAction}
                      title="View details"
                      onClick={() => setViewing(o)}
                    >
                      <Eye size={17} color="#5c2436" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <Modal title={`Order #${viewing._id.slice(-6)}`} onClose={() => setViewing(null)}>
          <div style={{ marginBottom: 16 }}>
            <Badge value={viewing.status} />
            <span style={{ marginLeft: 10, fontSize: 12, color: '#8a8a8a' }}>
              {formatDateTime(viewing.createdAt)}
            </span>
          </div>

          <SectionLabel>Customer</SectionLabel>
          <p style={detailText}>
            {viewing.user?.name}
            <br />
            {viewing.user?.email}
          </p>

          <SectionLabel>Delivery Address</SectionLabel>
          <p style={detailText}>
            {viewing.deliveryAddress?.fullName} · {viewing.deliveryAddress?.phone}
            <br />
            {viewing.deliveryAddress?.street}, {viewing.deliveryAddress?.city}
            {viewing.deliveryAddress?.notes ? (
              <>
                <br />
                <em style={{ color: '#8a8a8a' }}>“{viewing.deliveryAddress.notes}”</em>
              </>
            ) : null}
          </p>

          <SectionLabel>Items</SectionLabel>
          <div style={{ marginBottom: 16 }}>
            {viewing.items?.map((it, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #f4e6ec',
                  fontSize: 14,
                }}
              >
                <span>
                  {it.name} <span style={{ color: '#8a8a8a' }}>× {it.quantity}</span>
                </span>
                <span style={{ fontWeight: 600 }}>Rs. {it.price * it.quantity}</span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0 0',
                fontWeight: 700,
                color: '#5c2436',
              }}
            >
              <span>Total</span>
              <span>Rs. {viewing.totalPrice}</span>
            </div>
          </div>

          <SectionLabel>Update Status</SectionLabel>
          <select
            value={viewing.status}
            onChange={(e) => changeStatus(viewing, e.target.value)}
            style={ui.input}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div style={ui.modalActions}>
            <button style={ui.primaryBtn} onClick={() => setViewing(null)}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

const detailText = { fontSize: 14, color: '#2a2420', margin: '0 0 16px', lineHeight: 1.6 };

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        color: '#8a3a4d',
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}
