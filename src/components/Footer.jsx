const styles = {
  footer: {
    background: '#2f4a3a',
    color: '#fff',
    padding: '56px 40px 24px',
    fontFamily: "'Poppins', sans-serif",
  },
  inner: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 40,
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    margin: '0 0 8px',
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    margin: 0,
  },
  copyright: {
    maxWidth: 1180,
    margin: '32px auto 0',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
};

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div>
          <p style={styles.logo}>Florafy</p>
          <p style={styles.tagline}>Fresh. Handcrafted. Meaningful.</p>
        </div>
      </div>
      <p style={styles.copyright}>
        © {new Date().getFullYear()} Florafy. All rights reserved.
      </p>
    </footer>
  );
}