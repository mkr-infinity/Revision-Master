import { Github, Coffee } from 'lucide-react';
import logoPath from '@assets/logo_1777901812110.png';

const navLinks = [
  { label: 'Features',    href: '#features' },
  { label: 'Screenshots', href: '#screenshots' },
  { label: 'Themes',      href: '#themes' },
  { label: 'Support',     href: '#support' },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border/30">
      <div className="container mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <a href="#" className="flex items-center gap-3 group">
            <img src={logoPath} alt="Revision Master" className="w-9 h-9 rounded-xl" />
            <div>
              <p
                className="font-bold text-[15px] leading-tight"
                style={{
                  fontFamily: "'Zen Dots', sans-serif",
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
              >
                Revision Master
              </p>
              <p className="text-[10px] text-muted-foreground/50 font-display tracking-widest uppercase mt-0.5">Anime Edition · v2.0.2</p>
            </div>
          </a>

          {/* Nav */}
          <nav className="flex flex-wrap gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-3.5 py-1.5 text-xs font-bold font-display tracking-widest uppercase text-muted-foreground hover:text-foreground rounded-full hover:bg-foreground/6 transition-all duration-150"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/mkr-infinity/Revision-Master"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-display tracking-widest uppercase text-foreground/70 border border-border/60 hover:border-border hover:text-foreground transition-all"
            >
              <Github size={13} strokeWidth={2} />
              GitHub
            </a>
            <a
              href="https://buymeacoffee.com/mkr_infinity"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold font-display tracking-widest uppercase text-amber-950"
              style={{ background: 'linear-gradient(135deg, #FFDD00, #F59E0B)', boxShadow: '0 2px 12px rgba(245,158,11,0.25)' }}
            >
              <Coffee size={13} strokeWidth={2.5} />
              Support
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground/40 font-display tracking-wide">
          <span>© {year} Revision Master. Free &amp; open-source.</span>
          <span>Built for students, by a student.</span>
        </div>
      </div>
    </footer>
  );
}
