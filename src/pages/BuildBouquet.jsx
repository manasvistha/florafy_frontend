import Navbar from '../components/Navbar';

const styles = {
  page: { background: '#f7e9ee', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" },
  container: { maxWidth: 700, margin: '0 auto', padding: '100px 20px', textAlign: 'center' },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 40,
    color: '#5c2436',
    margin: '0 0 12px',
  },
  text: { fontSize: 15, color: '#8a3a4d' },
};

export default function BuildBouquet() {
  return (
    <div style={styles.page}>
      <Navbar variant="dashboard" />
      <div style={styles.container}>
        <h1 style={styles.title}>Build Your Own Bouquet</h1>
        <p style={styles.text}>
          The custom bouquet builder is coming soon — pick every stem, wrap, and ribbon yourself.
        </p>
      </div>
    </div>
  );
}