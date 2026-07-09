const styles = {
  hero: {
    background: '#f7e9ee',
    padding: '60px 40px 100px',
    fontFamily: "'Poppins', sans-serif",
  },
  inner: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'center',
    gap: 48,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#6d2b3a',
    margin: '0 0 20px',
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 500,
    fontSize: 56,
    lineHeight: 1.15,
    color: '#2a2420',
    margin: '0 0 24px',
  },
  subtext: {
    fontSize: 15,
    lineHeight: 1.7,
    color: '#5c534d',
    maxWidth: 420,
    margin: '0 0 36px',
  },
  actions: {
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
  },
  btn: {
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textDecoration: 'none',
    padding: '16px 32px',
    borderRadius: 999,
    background: '#d9b8c4',
    color: '#2a2420',
    display: 'inline-block',
  },
  media: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    maxWidth: 380,
    aspectRatio: '3 / 4',
    objectFit: 'cover',
    borderRadius: 24,
    display: 'block',
  },
  badgeBase: {
    position: 'absolute',
    background: '#4f1f2a',
    color: '#fff',
    fontSize: 12,
    fontWeight: 500,
    padding: '8px 18px',
    borderRadius: 999,
    whiteSpace: 'nowrap',
  },
};

export default function Hero() {
  return (
    <section style={styles.hero}>
      <div style={styles.inner}>
        <div>
          <p style={styles.eyebrow}>Fresh.Handcrafted.Meaningful</p>

          <h1 style={styles.title}>
            Send Love,
            <br />
            One Bloom
            <br />
            at a Time....
          </h1>

          <p style={styles.subtext}>
            Build your perfect bouquet — choose every petal, colour and
            stem. Because gifts should feel as personal as the feelings
            behind them.
          </p>

          <div style={styles.actions}>
            <a href="/shop" style={styles.btn}>Shop Now</a>
            <a href="/build-bouquet" style={styles.btn}>Customize Yours</a>
          </div>
        </div>

        <div style={styles.media}>
          <span style={{ ...styles.badgeBase, top: 24, left: -8 }}>
            Same day delivery
          </span>
          <img
            src={require('../assets/hero-bouquet.jpg')}
            alt="Handcrafted bouquet of pink, purple and white flowers in a glass vase"
            style={styles.image}
          />
          <span style={{ ...styles.badgeBase, bottom: 24, right: -8 }}>
            2,800 review
          </span>
        </div>
      </div>
    </section>
  );
}