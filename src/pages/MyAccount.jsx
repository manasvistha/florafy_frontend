import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Heart,
  Flower2,
  Pencil,
  KeyRound,
  LogOut,
  ChevronRight,
  Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getMe, updateMe, changePassword } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const QUICK_LINKS = [
  { to: '/my-orders', label: 'My Orders', hint: 'Track your deliveries', icon: Package },
  { to: '/wishlist', label: 'Wishlist', hint: 'Blooms you saved', icon: Heart },
  { to: '/build-bouquet', label: 'Build Bouquet', hint: 'Make your own', icon: Flower2 },
];

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch {
    return null;
  }
}

function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function memberSince(createdAt) {
  if (!createdAt) return null;
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

const styles = {
  page: { background: '#f7e9ee', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" },
  container: { maxWidth: 860, margin: '0 auto', padding: '40px 20px 80px' },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 40,
    color: '#5c2436',
    margin: '0 0 24px',
  },

  // ---- Profile card ----
  profileCard: {
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 6px 22px rgba(92,36,54,0.09)',
    padding: '26px 26px',
    display: 'flex',
    alignItems: 'center',
    gap: 22,
    marginBottom: 28,
    position: 'relative',
    flexWrap: 'wrap',
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: '50%',
    background: '#5c2436',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: 1,
    flexShrink: 0,
  },
  profileInfo: { minWidth: 0, flex: 1 },
  profileName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 28,
    color: '#5c2436',
    margin: '0 0 3px',
  },
  profileEmail: { fontSize: 14, color: '#5c534d', margin: '0 0 6px', wordBreak: 'break-word' },
  profileSince: { fontSize: 12.5, color: '#a08a92', margin: 0 },
  roleBadge: {
    position: 'absolute',
    top: 20,
    right: 22,
    background: '#f0d9e1',
    color: '#5c2436',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    padding: '5px 12px',
    borderRadius: 999,
  },
  roleBadgeAdmin: { background: '#5c2436', color: '#fff' },

  // ---- Section labels ----
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#8a3a4d',
    margin: '0 0 12px',
  },

  // ---- Quick links ----
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 30,
  },
  quickCard: {
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 4px 14px rgba(92,36,54,0.07)',
    padding: '18px 18px',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: '#f0d9e1',
    color: '#5c2436',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  quickLabel: { fontSize: 14, fontWeight: 600, color: '#2a2420', margin: '0 0 2px' },
  quickHint: { fontSize: 11.5, color: '#a08a92', margin: 0 },

  // ---- Account actions ----
  actionsCard: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 18px rgba(92,36,54,0.07)',
    overflow: 'hidden',
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '16px 20px',
    borderBottom: '1px solid #f4e6ec',
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: '#fbeef2',
    color: '#5c2436',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  actionLabel: { fontSize: 14, fontWeight: 600, color: '#2a2420', margin: '0 0 2px' },
  actionHint: { fontSize: 11.5, color: '#a08a92', margin: 0 },
  actionSpacer: { flex: 1 },
  actionBtn: {
    background: '#f0d9e1',
    color: '#5c2436',
    border: 'none',
    borderRadius: 999,
    padding: '9px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  logoutBtn: { background: '#5c2436', color: '#fff' },

  // ---- Toast ----
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

  // ---- Modal ----
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(43,20,28,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 150,
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 430,
    padding: '26px 28px',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 26,
    color: '#5c2436',
    margin: '0 0 18px',
  },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#5c534d', margin: '0 0 6px' },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d9b8c4',
    fontSize: 14,
    outline: 'none',
    marginBottom: 14,
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  errorBox: {
    background: '#fdecea',
    border: '1px solid #f5c2c0',
    color: '#c62828',
    fontSize: 13,
    padding: '10px 14px',
    borderRadius: 10,
    marginBottom: 14,
  },
  hint: { fontSize: 11.5, color: '#a08a92', margin: '-8px 0 14px' },
  modalActions: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 },
  ghostBtn: {
    background: '#f0d9e1',
    color: '#5c2436',
    border: 'none',
    borderRadius: 10,
    padding: '11px 16px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  saveBtn: {
    background: '#5c2436',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '11px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
};

export default function MyAccount() {
  const navigate = useNavigate();
  const { refresh } = useWishlist();
  const { refresh: refreshCart } = useCart();

  const [user, setUser] = useState(readStoredUser);
  const [toast, setToast] = useState('');

  // Modals
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Fetch fresh details (localStorage has no createdAt for "Member since").
  useEffect(() => {
    let active = true;
    getMe()
      .then((fresh) => {
        if (!active || !fresh) return;
        setUser((prev) => ({ ...prev, ...fresh, id: fresh._id || fresh.id }));
      })
      .catch(() => {
        /* offline / API down — fall back to the stored user */
      });
    return () => {
      active = false;
    };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const openEdit = () => {
    setProfileForm({ name: user?.name || '', email: user?.email || '' });
    setError('');
    setEditOpen(true);
  };

  const openPw = () => {
    setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    setError('');
    setPwOpen(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setError('');
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setError('Please fill in both your name and email.');
      return;
    }
    setSaving(true);
    try {
      const updated = await updateMe(profileForm);
      const next = { ...user, ...updated };
      setUser(next);
      // Keep the stored session in sync so the rest of the app sees the change.
      localStorage.setItem(
        'user',
        JSON.stringify({ id: next.id, name: next.name, email: next.email, role: next.role })
      );
      setEditOpen(false);
      showToast('Profile updated');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirm) {
      setError('Your new passwords do not match.');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      await changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwOpen(false);
      showToast('Password changed');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    refresh();
    refreshCart();
    navigate('/login');
  };

  const since = memberSince(user?.createdAt);
  const isAdmin = user?.role === 'admin';

  return (
    <div style={styles.page}>
      <Navbar variant="dashboard" />

      <div style={styles.container}>
        <h1 style={styles.title}>My Account</h1>

        {/* -------- Profile -------- */}
        <div style={styles.profileCard}>
          <div style={styles.avatar}>{initialsOf(user?.name)}</div>
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>{user?.name || 'Florafy Customer'}</h2>
            <p style={styles.profileEmail}>{user?.email}</p>
            {since && <p style={styles.profileSince}>Member since {since}</p>}
          </div>
          <span style={{ ...styles.roleBadge, ...(isAdmin ? styles.roleBadgeAdmin : {}) }}>
            {user?.role || 'user'}
          </span>
        </div>

        {/* -------- Quick links -------- */}
        <p style={styles.sectionLabel}>Quick Links</p>
        <div style={styles.quickGrid}>
          {QUICK_LINKS.map(({ to, label, hint, icon: Icon }) => (
            <Link key={to} to={to} style={styles.quickCard}>
              <span style={styles.quickIcon}>
                <Icon size={19} />
              </span>
              <span style={{ flex: 1 }}>
                <p style={styles.quickLabel}>{label}</p>
                <p style={styles.quickHint}>{hint}</p>
              </span>
              <ChevronRight size={17} color="#c9a5b3" />
            </Link>
          ))}
        </div>

        {/* -------- Account actions -------- */}
        <p style={styles.sectionLabel}>Account</p>
        <div style={styles.actionsCard}>
          <div style={styles.actionRow}>
            <span style={styles.actionIcon}>
              <Pencil size={17} />
            </span>
            <span>
              <p style={styles.actionLabel}>Edit Profile</p>
              <p style={styles.actionHint}>Update your name and email</p>
            </span>
            <span style={styles.actionSpacer} />
            <button style={styles.actionBtn} onClick={openEdit}>
              Edit
            </button>
          </div>

          <div style={styles.actionRow}>
            <span style={styles.actionIcon}>
              <KeyRound size={17} />
            </span>
            <span>
              <p style={styles.actionLabel}>Change Password</p>
              <p style={styles.actionHint}>Keep your account secure</p>
            </span>
            <span style={styles.actionSpacer} />
            <button style={styles.actionBtn} onClick={openPw}>
              Change
            </button>
          </div>

          <div style={{ ...styles.actionRow, borderBottom: 'none' }}>
            <span style={styles.actionIcon}>
              <LogOut size={17} />
            </span>
            <span>
              <p style={styles.actionLabel}>Logout</p>
              <p style={styles.actionHint}>Sign out of this device</p>
            </span>
            <span style={styles.actionSpacer} />
            <button style={{ ...styles.actionBtn, ...styles.logoutBtn }} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* -------- Edit profile modal -------- */}
      {editOpen && (
        <div style={styles.overlay} onClick={() => setEditOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Edit Profile</h3>
            {error && <div style={styles.errorBox}>{error}</div>}
            <form onSubmit={saveProfile}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              />
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.ghostBtn} onClick={() => setEditOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...styles.saveBtn, ...(saving ? styles.btnDisabled : {}) }}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------- Change password modal -------- */}
      {pwOpen && (
        <div style={styles.overlay} onClick={() => setPwOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Change Password</h3>
            {error && <div style={styles.errorBox}>{error}</div>}
            <form onSubmit={savePassword}>
              <label style={styles.label}>Current Password</label>
              <input
                style={styles.input}
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              />
              <label style={styles.label}>New Password</label>
              <input
                style={styles.input}
                type="password"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              />
              <p style={styles.hint}>At least 6 characters.</p>
              <label style={styles.label}>Confirm New Password</label>
              <input
                style={styles.input}
                type="password"
                value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              />
              <div style={styles.modalActions}>
                <button type="button" style={styles.ghostBtn} onClick={() => setPwOpen(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...styles.saveBtn, ...(saving ? styles.btnDisabled : {}) }}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div style={styles.toast}>
          <Check size={16} /> {toast}
        </div>
      )}
    </div>
  );
}
