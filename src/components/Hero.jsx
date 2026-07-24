import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Photos that auto-rotate inside the hero image card (crossfade + slow zoom).
const SLIDES = [
  '/image/hero-bouquet.jpg',
  '/image/products/birthday.jpg',
  '/image/products/rose.jpg',
  '/image/products/mixed.jpg',
  '/image/products/rosepink.jpg',
  '/image/products/lotus.jpg',
];

const styles = {
  hero: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    fontFamily: "'Poppins', sans-serif",
    background:
      'linear-gradient(160deg, #f7e9ee 0%, #fbeef2 45%, #f4dce4 100%)',
  },
  // soft decorative blurred blobs on the pink backdrop
  blob1: {
    position: 'absolute',
    width: 420,
    height: 420,
    top: '-8%',
    right: '-4%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,111,134,0.28), transparent 70%)',
    filter: 'blur(30px)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    width: 340,
    height: 340,
    bottom: '-6%',
    left: '-4%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(233,188,203,0.4), transparent 70%)',
    filter: 'blur(30px)',
    pointerEvents: 'none',
  },
  inner: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1220,
    width: '100%',
    margin: '0 auto',
    padding: '140px 32px 80px',
    display: 'grid',
    gridTemplateColumns: '1.05fr 1fr',
    gap: 56,
    alignItems: 'center',
  },
  // ---- left column ----
  eyebrow: {
    display: 'inline-block',
    fontSize: 12.5,
    fontWeight: 600,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#8f3a4a',
    marginBottom: 22,
  },
  title: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 'clamp(40px, 5vw, 68px)',
    lineHeight: 1.06,
    color: '#5c2436',
    margin: '0 0 24px',
  },
  subtitle: {
    fontSize: 'clamp(14px, 1.2vw, 16px)',
    lineHeight: 1.8,
    color: '#6a5560',
    maxWidth: 440,
    margin: '0 0 36px',
  },
  actions: { display: 'flex', gap: 16, flexWrap: 'wrap' },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#fff',
    padding: '15px 32px',
    borderRadius: 999,
    background: 'linear-gradient(135deg, #c96f86 0%, #8f3a4a 55%, #5c2436 100%)',
    boxShadow: '0 14px 30px rgba(143,58,74,0.32)',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#5c2436',
    padding: '15px 32px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.8)',
    boxShadow: '0 12px 28px rgba(92,36,54,0.10)',
  },
  // ---- right column (image card) ----
  cardWrap: { position: 'relative' },
  card: {
    position: 'relative',
    width: '100%',
    height: 'clamp(360px, 46vw, 520px)',
    borderRadius: 28,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.7)',
    boxShadow: '0 30px 70px rgba(92,36,54,0.22)',
    background: '#2a1218',
  },
  slide: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(180deg, rgba(42,18,24,0.05) 40%, rgba(42,18,24,0.35) 100%)',
  },
  badge: {
    position: 'absolute',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    fontSize: 12.5,
    fontWeight: 600,
    color: '#5c2436',
    padding: '9px 16px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.85)',
    boxShadow: '0 10px 26px rgba(92,36,54,0.16)',
    zIndex: 3,
  },
  dot: { width: 7, height: 7, borderRadius: '50%', background: '#4caf7d' },
  dots: {
    display: 'flex',
    gap: 7,
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 3,
  },
  pip: (active) => ({
    width: active ? 22 : 8,
    height: 8,
    borderRadius: 999,
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    background: active ? '#fff' : 'rgba(255,255,255,0.55)',
    transition: 'width 0.4s ease, background 0.4s ease',
  }),
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function Hero() {
  const [index, setIndex] = useState(0);

  // auto-advance the image slideshow inside the card
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={styles.hero}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.inner}>
        {/* Left: copy + actions */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span variants={item} style={styles.eyebrow}>
            Fresh · Handcrafted · Meaningful
          </motion.span>

          <motion.h1 variants={item} style={styles.title}>
            Send Love,
            <br />
            One Bloom
            <br />
            at a Time….
          </motion.h1>

          <motion.p variants={item} style={styles.subtitle}>
            Build your perfect bouquet — choose every petal, colour and stem.
            Because gifts should feel as personal as the feelings behind them.
          </motion.p>

          <motion.div variants={item} style={styles.actions}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link to="/login" style={styles.btnPrimary}>
                Shop Now <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link to="/build-bouquet" style={styles.btnGhost}>
                Customize Yours
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right: auto-playing image card */}
        <motion.div
          style={styles.cardWrap}
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
        >
          <motion.div
            style={styles.card}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AnimatePresence>
              <motion.div
                key={index}
                style={{ ...styles.slide, backgroundImage: `url(${SLIDES[index]})` }}
                initial={{ opacity: 0, scale: 1.14 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ opacity: { duration: 1.1 }, scale: { duration: 4.5, ease: 'easeOut' } }}
              />
            </AnimatePresence>
            <div style={styles.cardOverlay} />

            {/* pips */}
            <div style={styles.dots}>
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => setIndex(i)}
                  style={styles.pip(i === index)}
                />
              ))}
            </div>
          </motion.div>

          {/* Floating glass badges */}
          <motion.span
            style={{ ...styles.badge, top: 18, left: 18 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span style={styles.dot} /> Same day delivery
          </motion.span>
          <motion.span
            style={{ ...styles.badge, bottom: 26, right: 18 }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            ★ 2,800 reviews
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
