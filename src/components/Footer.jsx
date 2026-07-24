import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RefreshCw,
  Truck,
  Flower2,
  ShieldCheck,
  Globe,
  Camera,
  MessageCircle,
  Mail,
  ArrowRight,
} from 'lucide-react';

const HIGHLIGHTS = [
  { value: '100%', label: 'Sustainable' },
  { value: 'Fresh', label: 'Daily Cut' },
  { value: 'Premium', label: 'Quality' },
];

const FEATURES = [
  { icon: RefreshCw, title: 'Always Fresh', text: 'Sourced daily from high-altitude nurseries for longevity.' },
  { icon: Truck, title: 'Fast Delivery', text: 'Swift hand-delivery across Kathmandu within 4 hours.' },
  { icon: Flower2, title: 'Custom Bouquet', text: 'Design your unique bouquet with our master florists.' },
  { icon: ShieldCheck, title: 'Freshness Guaranteed', text: 'Our 7-day petal-fresh promise on every arrangement.' },
];

const COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'Bouquets', to: '/shop' },
      { label: 'Custom Builder', to: '/build-bouquet' },
      { label: 'Seasonal Picks', to: '/shop' },
      { label: 'Gifts', to: '/shop' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Track Order', to: '/my-orders' },
      { label: 'Returns', href: '#' },
      { label: 'FAQs', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
  },
];

const styles = {
  footer: {
    position: 'relative',
    background: 'linear-gradient(180deg, #f7e9ee 0%, #f3dbe3 100%)',
    padding: '84px 32px 28px',
    fontFamily: "'Poppins', sans-serif",
    overflow: 'hidden',
  },
  inner: { maxWidth: 1180, margin: '0 auto' },

  topGrid: { maxWidth: 720, marginBottom: 60 },
  topHeading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: 'clamp(26px, 3.5vw, 38px)',
    color: '#8f3a4a',
    margin: '0 0 16px',
  },
  story: { fontSize: 15, lineHeight: 1.75, color: '#5c534d', margin: '0 0 22px' },
  highlights: { display: 'flex', gap: 28, flexWrap: 'wrap' },
  hlItem: { borderLeft: '2px solid #d8a9b8', paddingLeft: 14 },
  hlValue: { fontSize: 20, fontWeight: 700, color: '#8f3a4a', margin: 0 },
  hlLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#8a7a80',
    margin: 0,
  },

  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
    marginBottom: 64,
  },
  featureCard: {
    padding: '24px 22px',
    borderRadius: 18,
    background: 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.6)',
    boxShadow: '0 10px 28px rgba(92,36,54,0.07)',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: '#3a2b2f',
    color: '#f0d9e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: { fontSize: 15, fontWeight: 600, color: '#3a2b2f', margin: '0 0 6px' },
  featureText: { fontSize: 13, lineHeight: 1.6, color: '#6b5c62', margin: 0 },

  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1.4fr',
    gap: 32,
    paddingTop: 40,
    borderTop: '1px solid rgba(92,36,54,0.12)',
  },
  brandLogo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: 30,
    color: '#5c2436',
    margin: '0 0 14px',
    display: 'inline-block',
    textDecoration: 'none',
  },
  brandDesc: { fontSize: 13.5, lineHeight: 1.7, color: '#6b5c62', margin: '0 0 20px', maxWidth: 240 },
  socials: { display: 'flex', gap: 10 },
  social: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: '#3a2b2f',
    color: '#f0d9e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  colHeading: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#8f3a4a',
    margin: '0 0 16px',
  },
  colLink: {
    display: 'block',
    fontSize: 13.5,
    color: '#6b5c62',
    textDecoration: 'none',
    marginBottom: 11,
    width: 'fit-content',
  },
  newsDesc: { fontSize: 13.5, lineHeight: 1.7, color: '#6b5c62', margin: '0 0 16px' },
  newsForm: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '5px 5px 5px 14px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.7)',
  },
  newsInput: {
    flex: 1,
    minWidth: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 13.5,
    color: '#3a2b2f',
    fontFamily: 'inherit',
  },
  newsBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    color: '#fff',
    background: 'linear-gradient(135deg, #8f3a4a, #5c2436)',
    flexShrink: 0,
  },
  newsOk: { fontSize: 12.5, color: '#2f8a4d', fontWeight: 600, margin: '10px 2px 0' },

  bottomBar: {
    maxWidth: 1180,
    margin: '48px auto 0',
    paddingTop: 22,
    borderTop: '1px solid rgba(92,36,54,0.12)',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    fontSize: 12,
    color: '#8a7a80',
  },
  bottomLinks: { display: 'flex', gap: 22 },
  bottomLink: { color: '#8a7a80', textDecoration: 'none' },
};

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' },
  }),
};

function ColLink({ link }) {
  const [hover, setHover] = useState(false);
  const style = { ...styles.colLink, color: hover ? '#8f3a4a' : '#6b5c62', transform: hover ? 'translateX(4px)' : 'none', transition: 'all 0.2s ease' };
  const bind = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style };
  return link.to ? (
    <Link to={link.to} {...bind}>{link.label}</Link>
  ) : (
    <a href={link.href} onClick={(e) => link.href === '#' && e.preventDefault()} {...bind}>{link.label}</a>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  const vp = { once: true, amount: 0.3 };

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        {/* Top: brand story */}
        <motion.div
          style={styles.topGrid}
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={vp}
        >
          <h2 style={styles.topHeading}>Sourced with Love</h2>
          <p style={styles.story}>
            At Florafy, we believe flowers are more than just gifts. They are a way to express
            love, joy and emotions beautifully. Our collection features fresh, hand-picked blooms
            designed with creativity, elegance and care to make every occasion memorable — from
            romantic bouquets to modern floral arrangements.
          </p>
          <div style={styles.highlights}>
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} style={styles.hlItem}>
                <p style={styles.hlValue}>{h.value}</p>
                <p style={styles.hlLabel}>{h.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature cards */}
        <div style={styles.featureGrid}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                style={styles.featureCard}
                custom={i}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={vp}
                whileHover={{ y: -8, boxShadow: '0 20px 44px rgba(92,36,54,0.14)', borderColor: 'rgba(201,111,134,0.6)' }}
              >
                <motion.div style={styles.featureIcon} whileHover={{ rotate: -8, scale: 1.1 }}>
                  <Icon size={20} />
                </motion.div>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureText}>{f.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Main footer columns */}
        <div style={styles.mainGrid}>
          <motion.div variants={reveal} custom={0} initial="hidden" whileInView="show" viewport={vp}>
            <Link to="/" style={styles.brandLogo}>Florafy</Link>
            <p style={styles.brandDesc}>
              Curating artisanal botanical experiences from the heart of Kathmandu. We blend
              Himalayan freshness with timeless floral design.
            </p>
            <div style={styles.socials}>
              {[Globe, Camera, MessageCircle].map((Icon, i) => (
                <motion.button
                  key={i}
                  style={styles.social}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Social link"
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon size={16} />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {COLUMNS.map((col, i) => (
            <motion.div key={col.heading} variants={reveal} custom={i + 1} initial="hidden" whileInView="show" viewport={vp}>
              <p style={styles.colHeading}>{col.heading}</p>
              {col.links.map((link) => (
                <ColLink key={link.label} link={link} />
              ))}
            </motion.div>
          ))}

          <motion.div variants={reveal} custom={4} initial="hidden" whileInView="show" viewport={vp}>
            <p style={styles.colHeading}>Newsletter</p>
            <p style={styles.newsDesc}>Join our list for exclusive floral previews and care tips.</p>
            <form style={styles.newsForm} onSubmit={subscribe}>
              <Mail size={16} color="#8a3a4d" />
              <input
                style={styles.newsInput}
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email for newsletter"
              />
              <motion.button
                type="submit"
                style={styles.newsBtn}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </motion.button>
            </form>
            {subscribed && <p style={styles.newsOk}>🌸 Thanks for subscribing!</p>}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div style={styles.bottomBar}>
          <span>© {new Date().getFullYear()} Florafy. Crafted with care in Kathmandu.</span>
          <div style={styles.bottomLinks}>
            <a href="#" onClick={(e) => e.preventDefault()} style={styles.bottomLink}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()} style={styles.bottomLink}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
