import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Menu, X, Download, Coffee } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import logoPath from '@assets/logo_1777901812110.png';

const navLinks = [
  { name: 'Features',    href: '#features' },
  { name: 'Screenshots', href: '#screenshots' },
  { name: 'Themes',      href: '#themes' },
  { name: 'Support',     href: '#support' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <>
      {/* ── DESKTOP CAPSULE NAVBAR ── */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="pointer-events-auto w-full max-w-5xl"
        >
          <div
            className={`relative flex items-center justify-between gap-2 px-3 py-2 rounded-full transition-all duration-500 ${
              scrolled
                ? 'bg-background/65 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.35),0_0_0_1px_hsl(var(--primary)/0.22)]'
                : 'bg-background/28 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2),0_0_0_1px_hsl(var(--primary)/0.12)]'
            }`}
          >
            {/* Glowing top border */}
            <div className="absolute top-0 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full pointer-events-none" />

            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 flex-shrink-0 group ml-1" data-testid="link-home">
              <div className="relative">
                <div className="absolute -inset-1.5 rounded-full bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={logoPath} alt="Revision Master" className="w-9 h-9 rounded-xl relative z-10" />
              </div>
              <span
                className="font-bold text-[15px] hidden sm:block"
                style={{
                  fontFamily: "'Zen Dots', sans-serif",
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Revision Master
              </span>
            </a>

            {/* Center nav pill (desktop) */}
            <nav className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-background/25 border border-white/8 dark:border-white/5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative px-4 py-1.5 rounded-full text-sm font-bold font-display tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <span className="absolute inset-0 rounded-full bg-primary/0 group-hover:bg-primary/10 transition-colors duration-200" />
                  <span className="relative">{link.name}</span>
                </a>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center border border-border/50 hover:border-primary/40 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Download CTA */}
              <a
                href="https://github.com/mkr-infinity/Revision-Master/releases/latest/"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm font-display tracking-wider uppercase text-white transition-all hover:scale-105 active:scale-95 mr-1"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                  boxShadow: '0 0 16px hsl(var(--primary)/0.4)',
                }}
                data-testid="button-nav-download"
              >
                <Download size={14} />
                Download
              </a>

              {/* Mobile hamburger */}
              <button
                className="sm:hidden flex w-9 h-9 items-center justify-center rounded-full border border-border/50 hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* ── MOBILE DROPDOWN ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-20 left-4 right-4 z-40 rounded-2xl overflow-hidden sm:hidden"
            style={{
              background: 'hsl(var(--card) / 0.85)',
              backdropFilter: 'blur(24px)',
              border: '1px solid hsl(var(--border))',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            {/* Nav links */}
            <div className="flex flex-col p-3 gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold font-display text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-border/50 mx-3" />

            {/* Action buttons */}
            <div className="p-3 flex flex-col gap-2">
              {/* Theme toggle row */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { toggleTheme(); setMobileOpen(false); }}
                  className="flex-shrink-0 w-11 h-11 rounded-xl border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <a
                  href="https://github.com/mkr-infinity/Revision-Master/releases/latest/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold font-display text-sm tracking-widest uppercase text-white"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                    boxShadow: '0 0 16px hsl(var(--primary)/0.3)',
                  }}
                >
                  <Download size={15} />
                  Download APK
                </a>
              </div>

              {/* BMC Support button */}
              <a
                href="https://buymeacoffee.com/mkr_infinity"
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold font-display text-sm tracking-widest uppercase text-amber-950 w-full"
                style={{
                  background: 'linear-gradient(135deg, #FFDD00, #F59E0B)',
                  boxShadow: '0 0 16px rgba(245,158,11,0.3)',
                }}
              >
                <Coffee size={15} />
                Buy Me a Coffee
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
