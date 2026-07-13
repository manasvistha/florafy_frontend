import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { ui, Badge, Modal } from '../../components/admin/ui';
import { getUsers, updateUser, deleteUser } from '../../services/api';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [editing, setEditing] = useState(null); // user being edited
  const [form, setForm] = useState({ name: '', email: '', role: 'user' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setUsers(await getUsers());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (user) => {
    setEditing(user);
    setForm({ name: user.name, email: user.email, role: user.role });
    setError('');
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const updated = await updateUser(editing._id, form);
      setUsers((list) =>
        list.map((u) => (u._id === editing._id ? { ...u, ...updated } : u))
      );
      setEditing(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    try {
      await deleteUser(user._id);
      setUsers((list) => list.filter((u) => u._id !== user._id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div style={ui.header}>
        <div>
          <h1 style={ui.title}>User Management</h1>
        </div>
      </div>
      <p style={ui.subtitle}>{users.length} registered users</p>

      {error && !editing && <div style={ui.errorBox}>{error}</div>}

      <div style={ui.toolbar}>
        <input
          style={ui.search}
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={ui.card}>
        <table style={ui.table}>
          <thead>
            <tr>
              <th style={ui.th}>Name</th>
              <th style={ui.th}>Email</th>
              <th style={ui.th}>Joined</th>
              <th style={ui.th}>Role</th>
              <th style={{ ...ui.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td style={ui.td} colSpan={5}>
                  <div style={ui.empty}>Loading users…</div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td style={ui.td} colSpan={5}>
                  <div style={ui.empty}>No users found.</div>
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u._id}>
                  <td style={{ ...ui.td, fontWeight: 600 }}>{u.name}</td>
                  <td style={ui.td}>{u.email}</td>
                  <td style={ui.td}>{formatDate(u.createdAt)}</td>
                  <td style={ui.td}>
                    <Badge value={u.role} />
                  </td>
                  <td style={{ ...ui.td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      style={ui.iconAction}
                      title="Edit"
                      onClick={() => openEdit(u)}
                    >
                      <Pencil size={16} color="#5c2436" />
                    </button>
                    <button
                      style={ui.iconAction}
                      title="Delete"
                      onClick={() => removeUser(u)}
                    >
                      <Trash2 size={16} color="#c0392b" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Modal title="Edit User" onClose={() => setEditing(null)}>
          {error && <div style={ui.errorBox}>{error}</div>}
          <form onSubmit={saveEdit}>
            <label style={ui.label}>Name</label>
            <input
              style={ui.input}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label style={ui.label}>Email</label>
            <input
              style={ui.input}
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label style={ui.label}>Role</label>
            <select
              style={ui.input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>

            <div style={ui.modalActions}>
              <button
                type="button"
                style={ui.ghostBtn}
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button type="submit" style={ui.primaryBtn} disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </AdminLayout>
  );
}
