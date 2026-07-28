import { motion } from 'framer-motion';
import { Leaf, Wand2, Truck } from 'lucide-react';

const FEATURES = [
  {
    icon: Leaf,
    title: 'Handpicked daily',
    text: 'Every stem is sourced fresh the morning it ships — never a wilted petal.',
  },
  {
    icon: Wand2,
    title: 'Built by you',
    text: 'Pick every bloom, colour and wrap in our interactive bouquet builder.',
  },
  {
    icon: Truck,
    title: 'Same day delivery',
    text: 'Order before 2pm and it lands on their doorstep the very same day.',
  },
];

const styles = {
  section: {
    position: 'relative',
    background: 'linear-gradient(180deg, #f7e9ee 0%, #fbeef2 55%, #f7e9ee 100%)',
    padding: '96px 32px',
    fontFamily: "'Poppins', sans-serif",
    overflow: 'hidden',
  },
  inner: { maxWidth: 1180, margin: '0 auto' },
  eyebrow: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#8a3a4d',
    margin: '0 0 12px',
  },
  heading: {
    textAlign: 'center',
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 'clamp(30px, 4vw, 46px)',
    color: '#5c2436',
    margin: '0 0 54px',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 },
  card: {
    padding: '34px 30px',
    borderRadius: 22,
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.65)',
    boxShadow: '0 12px 34px rgba(92,36,54,0.08)',
    cursor: 'default',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    background: 'linear-gradient(135deg, #c96f86, #5c2436)',
    marginBottom: 20,
    boxShadow: '0 10px 22px rgba(92,36,54,0.25)',
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 600,
    color: '#3a2b2f',
    margin: '0 0 10px',
  },
  cardText: { fontSize: 14, lineHeight: 1.7, color: '#5c534d', margin: 0 },
};

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  }),
};

export default function About() {
  return (
    <section style={styles.section} id="about">
      <div style={styles.inner}>
        <motion.p
          style={styles.eyebrow}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          Why Florafy
        </motion.p>
        <motion.h2
          style={styles.heading}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          Crafted with care, delivered with love
        </motion.h2>

        {/* Feature cards */}
        <div style={styles.grid}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                style={styles.card}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  boxShadow: '0 26px 54px rgba(92,36,54,0.16)',
                  borderColor: 'rgba(201,111,134,0.7)',
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <motion.div
                  style={styles.iconWrap}
                  whileHover={{ rotate: -8, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Icon size={26} />
                </motion.div>
                <h3 style={styles.cardTitle}>{f.title}</h3>
                <p style={styles.cardText}>{f.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
