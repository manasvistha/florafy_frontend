const FEATURES = [
  { title: 'Handpicked daily', text: 'Every stem is sourced fresh the morning it ships.' },
  { title: 'Built by you', text: 'Pick every bloom, colour and wrap in our bouquet builder.' },
  { title: 'Same day delivery', text: 'Order before 2pm and it lands on their doorstep today.' },
];

const styles = {
  section: {
    background: '#fff',
    padding: '72px 40px',
    fontFamily: "'Poppins', sans-serif",
  },
  inner: {
    maxWidth: 1180,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 40,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#2f4a3a',
    margin: '0 0 12px',
  },
  cardText: {
    fontSize: 14,
    lineHeight: 1.7,
    color: '#5c534d',
    margin: 0,
  },
};

export default function About() {
  return (
    <section style={styles.section}>
      <div style={styles.inner}>
        {FEATURES.map((f) => (
          <div key={f.title}>
            <h3 style={styles.cardTitle}>{f.title}</h3>
            <p style={styles.cardText}>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}