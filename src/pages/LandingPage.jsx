import LandingNav from '../components/LandingNav';
import Hero from '../components/Hero';
import About from '../components/About';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div style={{ background: '#f7e9ee', overflowX: 'hidden' }}>
      <LandingNav />
      <Hero />
      <About />
      <Footer />
    </div>
  );
}
