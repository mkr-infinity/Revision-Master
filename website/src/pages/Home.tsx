import { motion, useScroll, useSpring } from 'framer-motion';
import { Background } from '@/components/Background';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Privacy } from '@/components/Privacy';
import { Screenshots } from '@/components/Screenshots';
import { Themes } from '@/components/Themes';
import { Support } from '@/components/Support';
import { Footer } from '@/components/Footer';
import { ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="relative min-h-screen selection:bg-primary/30 selection:text-primary">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[100]"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, #8B5CF6, #22D3EE, #F472B6)',
        }}
      />

      <Background />
      <Navbar />

      <div className="relative z-10">
        <Hero />
        <Features />
        <Privacy />
        <Screenshots />
        <Themes />
        <Support />
        <Footer />
      </div>

      {/* Back to top */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showTop ? 1 : 0, scale: showTop ? 1 : 0.8, pointerEvents: showTop ? 'auto' : 'none' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full flex items-center justify-center z-50 transition-colors"
        style={{
          background: 'hsl(var(--primary))',
          boxShadow: '0 0 20px hsl(var(--primary) / 0.4)',
        }}
        aria-label="Back to top"
      >
        <ArrowUp size={18} className="text-white" />
      </motion.button>
    </main>
  );
}
