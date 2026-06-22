import { motion } from 'framer-motion';
import { Coffee, Github, Star, GitFork, AlertCircle, ArrowUpRight } from 'lucide-react';

const githubLinks = [
  { icon: Star,        label: 'Star the Repository',  sub: 'Show your support',       href: 'https://github.com/mkr-infinity/Revision-Master',           color: '#F59E0B' },
  { icon: AlertCircle, label: 'Report an Issue',       sub: 'Help improve the app',    href: 'https://github.com/mkr-infinity/Revision-Master/issues/new', color: '#EF4444' },
  { icon: GitFork,     label: 'Fork & Contribute',     sub: 'Build new features',      href: 'https://github.com/mkr-infinity/Revision-Master/fork',       color: '#22D3EE' },
];

export function Support() {
  return (
    <section id="support" className="py-28 md:py-36 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-16"
        >
          <p className="text-xs font-bold font-display tracking-[0.22em] uppercase text-primary mb-4">Support</p>
          <h2
            className="font-display font-black tracking-tight text-foreground"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.05 }}
          >
            Free forever.<br />
            <span style={{
              background: 'linear-gradient(125deg, #F59E0B, #F97316)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Your support
            </span>{' '}keeps it that way.
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-relaxed max-w-lg">
            Revision Master is completely free, open-source, and ad-free — built by one developer for students everywhere. No subscriptions. No paywalls.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-4 max-w-5xl">

          {/* BMC */}
          <motion.a
            href="https://buymeacoffee.com/mkr_infinity"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -3 }}
            className="group relative rounded-2xl overflow-hidden border border-border/50 block"
            style={{ background: 'hsl(var(--card)/0.55)', backdropFilter: 'blur(16px)' }}
          >
            {/* Top bar */}
            <div className="h-[2px] bg-gradient-to-r from-amber-400 to-orange-400" />

            <div className="p-7 md:p-8 flex flex-col gap-6">
              {/* Icon + label row */}
              <div className="flex items-start justify-between">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-amber-950 transition-transform duration-200 group-hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FFDD00, #F59E0B)',
                    boxShadow: '0 4px 20px rgba(245,158,11,0.35)',
                  }}
                >
                  <Coffee size={24} strokeWidth={2} />
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground/30 group-hover:text-muted-foreground/70 transition-colors mt-1" />
              </div>

              <div>
                <h3 className="font-display font-black text-xl tracking-tight text-foreground mb-2">Buy Me a Coffee</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every coffee keeps the app ad-free and funds new features — AI upgrades, new themes, more anime worlds. No subscription. No pressure. Any amount helps.
                </p>
              </div>

              <ul className="flex flex-col gap-2">
                {['Keeps the app completely ad-free', 'Funds new AI & theme features', 'Supports one indie developer'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/65">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div
                className="flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold font-display text-[13px] tracking-[0.12em] uppercase text-amber-950 transition-opacity group-hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #FFDD00 0%, #F59E0B 60%, #F97316 100%)',
                  boxShadow: '0 2px 16px rgba(245,158,11,0.3)',
                }}
              >
                <Coffee size={15} strokeWidth={2.5} />
                Buy Me a Coffee
              </div>
            </div>
          </motion.a>

          {/* GitHub */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.07 }}
            className="group relative rounded-2xl overflow-hidden border border-border/50"
            style={{ background: 'hsl(var(--card)/0.55)', backdropFilter: 'blur(16px)' }}
          >
            {/* Top bar */}
            <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, hsl(var(--primary)), #22D3EE)' }} />

            <div className="p-7 md:p-8 flex flex-col gap-6">
              {/* Icon + badge */}
              <div className="flex items-start justify-between">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white border border-white/8"
                  style={{
                    background: 'linear-gradient(135deg, #1c1f26, #2d3142)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  }}
                >
                  <Github size={24} strokeWidth={1.75} />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/6">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-bold font-display tracking-widest uppercase text-primary">Open Source</span>
                </div>
              </div>

              <div>
                <h3 className="font-display font-black text-xl tracking-tight text-foreground mb-2">Contribute on GitHub</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The entire codebase is open. Star it to show support, report issues, suggest ideas, or submit a pull request — every contribution matters.
                </p>
              </div>

              {/* Action links */}
              <div className="flex flex-col gap-2">
                {githubLinks.map(({ icon: Icon, label, sub, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group/row flex items-center gap-3.5 px-4 py-3 rounded-xl border border-border/40 hover:border-border/70 bg-transparent hover:bg-foreground/3 transition-all duration-150"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}14` }}>
                      <Icon size={14} style={{ color }} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">{label}</p>
                      <p className="text-xs text-muted-foreground">{sub}</p>
                    </div>
                    <ArrowUpRight size={13} className="text-muted-foreground/25 group-hover/row:text-muted-foreground/60 transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
