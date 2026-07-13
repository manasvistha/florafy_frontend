import Navbar from '../components/Navbar';

const styles = {
  page: { background: '#f7e9ee', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" },
  container: { maxWidth: 600, margin: '0 auto', padding: '48px 20px 80px' },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 38,
    color: '#5c2436',
    margin: '0 0 28px',
  },
  card: { background: '#fff', borderRadius: 14, padding: 28, boxShadow: '0 4px 14px rgba(0,0,0,0.05)' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0e0e6', fontSize: 14 },
  label: { color: '#8a3a4d', fontWeight: 600 },
};

export default function MyAccount() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={styles.page}>
      <Navbar variant="dashboard" />
      <div style={styles.container}>
        <h1 style={styles.title}>My Account</h1>
        <div style={styles.card}>
          <div style={styles.row}>
            <span style={styles.label}>Name</span>
            <span>{user.name}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Email</span>
            <span>{user.email}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Account Type</span>
            <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}