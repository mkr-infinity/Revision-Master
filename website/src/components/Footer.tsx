import { Github, Coffee } from 'lucide-react';
import logoPath from '@assets/logo_1777901812110.png';

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 overflow-hidden">
      {/* Top fade gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm pointer-events-none" />

      <div className="container mx-auto px-5 md:px-8 py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <a href="#" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <div className="absolute -inset-1.5 rounded-xl bg-primary/15 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={logoPath} alt="Revision Master" className="relative w-9 h-9 rounded-xl" />
            </div>
            <span
              className="font-bold text-base"
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

          {/* Nav links */}
          <nav className="flex items-center gap-1 flex-wrap justify-center">
            {[
              { label: 'Features',    href: '#features' },
              { label: 'Screenshots', href: '#screenshots' },
              { label: 'Themes',      href: '#themes' },
              { label: 'Support',     href: '#support' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-bold font-display tracking-widest uppercase text-muted-foreground hover:text-foreground hover:bg-primary/8 rounded-full transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <a
              href="https://github.com/mkr-infinity/Revision-Master"
              target="_blank"
              rel="noreferrer"
              data-testid="link-footer-github"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-display tracking-widest uppercase transition-all hover:scale-105 active:scale-95 text-foreground border border-border hover:border-primary/35 hover:bg-primary/8"
            >
              <Github size={14} />
              GitHub
            </a>
            <a
              href="https://buymeacoffee.com/mkr_infinity"
              target="_blank"
              rel="noreferrer"
              data-testid="link-footer-coffee"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-display tracking-widest uppercase text-amber-950 transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #FFDD00, #F59E0B)',
                boxShadow: '0 0 14px rgba(245,158,11,0.3)',
              }}
            >
              <Coffee size={14} />
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
