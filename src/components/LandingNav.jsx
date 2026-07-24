import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Landing-page-only navbar (the shared Navbar is used everywhere else and is
// intentionally left untouched). Transparent over the hero, turns to frosted
// glass once you scroll.
const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Build Bouquet', to: '/build-bouquet' },
  { label: 'About', to: '#about' },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const styles = {
    bar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      transition: 'background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
      background: scrolled ? 'rgba(247,233,238,0.78)' : 'rgba(255,255,255,0.35)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderBottom: `1px solid ${scrolled ? 'rgba(92,36,54,0.10)' : 'rgba(255,255,255,0.4)'}`,
      boxShadow: scrolled ? '0 8px 30px rgba(92,36,54,0.08)' : '0 4px 20px rgba(92,36,54,0.04)',
    },
    inner: {
      maxWidth: 1220,
      margin: '0 auto',
      padding: scrolled ? '8px 32px' : '14px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'padding 0.35s ease',
      fontFamily: "'Poppins', sans-serif",
    },
    logoImg: { height: 56, width: 'auto', display: 'block' },
    links: { display: 'flex', alignItems: 'center', gap: 34 },
    link: {
      position: 'relative',
      fontSize: 14.5,
      fontWeight: 500,
      color: '#3a2b2f',
      textDecoration: 'none',
      padding: '4px 0',
    },
    cta: {
      display: 'inline-block',
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: 600,
      color: '#fff',
      padding: '10px 24px',
      borderRadius: 999,
      background: 'linear-gradient(135deg, #8f3a4a 0%, #5c2436 100%)',
      boxShadow: '0 8px 20px rgba(92,36,54,0.28)',
    },
  };

  return (
    <motion.header
      style={styles.bar}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div style={styles.inner}>
        <motion.div whileHover={{ scale: 1.06, rotate: -1 }} transition={{ type: 'spring', stiffness: 300 }}>
          <Link to="/">
            <img src="/image/florafy-logo.png" alt="Florafy" style={styles.logoImg} />
          </Link>
        </motion.div>

        <nav style={styles.links} aria-label="Landing navigation">
          {LINKS.map(({ label, to }) => (
            <motion.div key={label} initial="rest" whileHover="hover" animate="rest">
              <Link to={to} style={styles.link}>
                {label}
                <motion.span
                  variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: -2,
                    height: 2,
                    width: '100%',
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #8f3a4a, #c96f86)',
                    transformOrigin: 'left',
                    display: 'block',
                  }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
          <Link to="/login" style={styles.cta}>
            Log In
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}
