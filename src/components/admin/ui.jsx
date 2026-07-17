// Shared styles + small building blocks for the admin pages, so Users / Flowers
// / Orders all look like one system.

export const ui = {
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 16,
    flexWrap: 'wrap',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 34,
    color: '#5c2436',
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: '#8a3a4d',
    margin: '4px 0 24px',
  },
  toolbar: {
    display: 'flex',
    gap: 12,
    marginBottom: 20,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  search: {
    flex: 1,
    minWidth: 220,
    padding: '11px 16px',
    borderRadius: 10,
    border: '1px solid #e0c4d0',
    fontSize: 14,
    outline: 'none',
    background: '#fff',
  },
  select: {
    padding: '11px 14px',
    borderRadius: 10,
    border: '1px solid #e0c4d0',
    fontSize: 14,
    background: '#fff',
    cursor: 'pointer',
    color: '#2a2420',
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 18px rgba(92,36,54,0.08)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 14,
  },
  th: {
    textAlign: 'left',
    padding: '14px 18px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#8a3a4d',
    background: '#faeef3',
    borderBottom: '1px solid #f0dae2',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '14px 18px',
    borderBottom: '1px solid #f4e6ec',
    color: '#2a2420',
    verticalAlign: 'middle',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: '#5c2436',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '11px 18px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  ghostBtn: {
    background: '#f0d9e1',
    color: '#5c2436',
    border: 'none',
    borderRadius: 8,
    padding: '7px 12px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  dangerBtn: {
    background: '#fff',
    color: '#c0392b',
    border: '1px solid #eab5ae',
    borderRadius: 8,
    padding: '7px 12px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  iconAction: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 8,
    display: 'inline-flex',
  },
  empty: {
    padding: '48px 20px',
    textAlign: 'center',
    color: '#8a8a8a',
    fontSize: 14,
  },
  errorBox: {
    background: '#fdecea',
    border: '1px solid #f5c2c0',
    color: '#c62828',
    fontSize: 14,
    padding: '10px 14px',
    borderRadius: 10,
    marginBottom: 16,
  },

  // Modal
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(43,20,28,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 100,
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 460,
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '26px 28px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
  },
  modalTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 26,
    color: '#5c2436',
    margin: '0 0 18px',
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#5c534d',
    margin: '0 0 6px',
  },
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
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
};

const STATUS_COLORS = {
  Pending: { bg: '#fff4e0', fg: '#b9791a' },
  Processing: { bg: '#e6f0ff', fg: '#2f5fb0' },
  Shipped: { bg: '#eae4ff', fg: '#5b3fb0' },
  Delivered: { bg: '#e2f5e8', fg: '#2f8a4d' },
  Cancelled: { bg: '#fdecea', fg: '#c0392b' },
  admin: { bg: '#5c2436', fg: '#fff' },
  user: { bg: '#f0d9e1', fg: '#5c2436' },
};

export function Badge({ value }) {
  const c = STATUS_COLORS[value] || { bg: '#eee', fg: '#555' };
  return (
    <span
      style={{
        display: 'inline-block',
        background: c.bg,
        color: c.fg,
        padding: '4px 12px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
      }}
    >
      {value}
    </span>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div style={ui.overlay} onClick={onClose}>
      <div style={ui.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h3 style={ui.modalTitle}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}
