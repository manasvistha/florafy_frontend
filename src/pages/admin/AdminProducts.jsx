import { useEffect, useRef, useState } from 'react';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { ui, Modal } from '../../components/admin/ui';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from '../../services/api';

const CATEGORIES = ['Birthday', 'Anniversary', 'Decoration', 'Other'];

// Images already available in /public/image/products — the admin can pick one
// here, or type any other path/URL in the field above.
const AVAILABLE_IMAGES = [
  'image1.png', 'image2.png', 'image3.png', 'image4.png',
  'image5.png', 'image6.png', 'image7.png', 'image8.png',
  'rose.jpg', 'rose2.jpg', 'rosepink.jpg', 'roseblue.jpg', 'rosemix.jpg',
  'tulip.jpg', 'lily.jpg', 'sunflower.jpg', 'daisy.jpg', 'hibiscus.jpg',
  'lotus.jpg', 'orchid.jpg', 'mixed.jpg',
  'birthday.jpg', 'birthday1.jpg', 'birthday2.jpg', 'birthday3.jpg',
  'birthday4.jpg', 'birthday5.jpg', 'birthday6.jpg', 'birthday7.jpg',
  'birthday8.jpg', 'birthday9.jpg', 'birthday10.jpg', 'birthday11.jpg',
  'birthday12.jpg', 'birthday13.jpg', 'birthday14.jpg', 'birthday15.jpg',
].map((f) => `/image/products/${f}`);

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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

            <label style={ui.label}>Image</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  background: '#f4e6ec',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid #eddbe3',
                }}
              >
                {form.image ? (
                  <img
                    src={form.image}
                    alt="preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : null}
              </div>
              <input
                style={{ ...ui.input, marginBottom: 0 }}
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="Upload a file, or paste an image URL"
              />
            </div>

            {/* Upload from computer */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                ...ui.ghostBtn,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14,
                ...(uploading ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
              }}
            >
              <Upload size={15} /> {uploading ? 'Uploading…' : 'Upload from computer'}
            </button>

            <p style={{ fontSize: 12, color: '#8a8a8a', margin: '0 0 8px' }}>
              Or select from existing images:
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 8,
                maxHeight: 180,
                overflowY: 'auto',
                padding: 4,
                marginBottom: 16,
                border: '1px solid #f0dae2',
                borderRadius: 10,
              }}
            >
              {AVAILABLE_IMAGES.map((src) => {
                const active = form.image === src;
                return (
                  <button
                    type="button"
                    key={src}
                    onClick={() => setForm({ ...form, image: src })}
                    title={src.split('/').pop()}
                    style={{
                      padding: 0,
                      border: active ? '2px solid #5c2436' : '2px solid transparent',
                      borderRadius: 8,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      aspectRatio: '1 / 1',
                      background: '#f7edf1',
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </button>
                );
              })}
            </div>

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
