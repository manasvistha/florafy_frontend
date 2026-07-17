import { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { ui, Modal } from '../../components/admin/ui';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/api';

const CATEGORIES = ['Birthday', 'Anniversary', 'Decoration', 'Other'];

const EMPTY = {
  name: '',
  description: '',
  price: '',
  category: 'Other',
  image: '',
  stock: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null => creating
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setProducts(await getProducts());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price ?? '',
      category: p.category || 'Other',
      image: p.image || '',
      stock: p.stock ?? '',
    });
    setError('');
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
    };

    try {
      if (editingId) {
        const updated = await updateProduct(editingId, payload);
        setProducts((list) => list.map((p) => (p._id === editingId ? updated : p)));
      } else {
        const created = await createProduct(payload);
        setProducts((list) => [created, ...list]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      await deleteProduct(p._id);
      setProducts((list) => list.filter((x) => x._id !== p._id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={ui.header}>
        <div>
          <h1 style={ui.title}>Flower Management</h1>
        </div>
        <button style={ui.primaryBtn} onClick={openCreate}>
          <Plus size={16} /> Add Flower
        </button>
      </div>
      <p style={ui.subtitle}>{products.length} flowers in the shop</p>

      {error && !modalOpen && <div style={ui.errorBox}>{error}</div>}

      <div style={ui.toolbar}>
        <input
          style={ui.search}
          placeholder="Search flowers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={ui.card}>
        <table style={ui.table}>
          <thead>
            <tr>
              <th style={ui.th}>Flower</th>
              <th style={ui.th}>Category</th>
              <th style={ui.th}>Price</th>
              <th style={ui.th}>Stock</th>
              <th style={{ ...ui.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={ui.td} colSpan={5}>
                  <div style={ui.empty}>Loading flowers…</div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td style={ui.td} colSpan={5}>
                  <div style={ui.empty}>
                    No flowers yet. Click “Add Flower” to create one.
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id}>
                  <td style={ui.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          background: '#f4e6ec',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : null}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        {p.description ? (
                          <div style={{ fontSize: 12, color: '#8a8a8a', maxWidth: 320 }}>
                            {p.description.length > 60
                              ? `${p.description.slice(0, 60)}…`
                              : p.description}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td style={ui.td}>{p.category}</td>
                  <td style={ui.td}>Rs. {p.price}</td>
                  <td style={ui.td}>
                    <span style={{ color: p.stock > 0 ? '#2f8a4d' : '#c0392b' }}>
                      {p.stock > 0 ? p.stock : 'Out of stock'}
                    </span>
                  </td>
                  <td style={{ ...ui.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button style={ui.iconAction} title="Edit" onClick={() => openEdit(p)}>
                      <Pencil size={16} color="#5c2436" />
                    </button>
                    <button style={ui.iconAction} title="Delete" onClick={() => remove(p)}>
                      <Trash2 size={16} color="#c0392b" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          title={editingId ? 'Edit Flower' : 'Add Flower'}
          onClose={() => setModalOpen(false)}
        >
          {error && <div style={ui.errorBox}>{error}</div>}
          <form onSubmit={save}>
            <label style={ui.label}>Name</label>
            <input
              style={ui.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <label style={ui.label}>Description</label>
            <textarea
              style={{ ...ui.input, minHeight: 70, resize: 'vertical' }}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={ui.label}>Price (Rs.)</label>
                <input
                  style={ui.input}
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={ui.label}>Stock</label>
                <input
                  style={ui.input}
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>

            <label style={ui.label}>Category</label>
            <select
              style={ui.input}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <label style={ui.label}>Image URL / path</label>
            <input
              style={ui.input}
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="/image/products/rose.jpg"
            />

            <div style={ui.modalActions}>
              <button
                type="button"
                style={ui.ghostBtn}
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" style={ui.primaryBtn} disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Flower'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
