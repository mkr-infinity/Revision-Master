import { motion } from 'framer-motion';
import { Coffee, Github, Star, GitFork, AlertCircle, Heart } from 'lucide-react';

const githubActions = [
  { icon: Star,        label: 'Star the Repository',   sub: 'Show your support',          href: 'https://github.com/mkr-infinity/Revision-Master',           color: '#F59E0B' },
  { icon: AlertCircle, label: 'Report an Issue',        sub: 'Help fix bugs & improve',    href: 'https://github.com/mkr-infinity/Revision-Master/issues/new', color: '#EF4444' },
  { icon: GitFork,     label: 'Fork & Contribute',      sub: 'Add your own features',      href: 'https://github.com/mkr-infinity/Revision-Master/fork',       color: '#22D3EE' },
];

export function Support() {
  return (
    <section id="support" className="py-28 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] blur-[200px] pointer-events-none opacity-25"
        style={{ background: 'radial-gradient(ellipse, #8B5CF6 0%, #F472B6 50%, transparent 80%)' }}
      />

      <div className="container mx-auto px-5 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs font-bold font-display tracking-widest uppercase text-primary">Support</span>
            <div className="h-px w-10 bg-primary" />
          </div>
          <h2
            className="font-display font-bold mb-4 tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          >
            Help Keep It{' '}
            <span style={{
              background: 'linear-gradient(120deg, #FDBA74, #F97316)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Free Forever
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            Revision Master is completely free, open-source, and ad-free — built by one developer for students everywhere.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 max-w-5xl mx-auto">

          {/* ── Buy Me a Coffee card ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="group relative rounded-3xl overflow-hidden"
          >
            {/* Glow layer */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(circle at 30% 30%, rgba(251,191,36,0.12), transparent 65%)' }}
            />

            {/* Animated shine */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,221,0,0.07), transparent)' }}
            />

            <div
              className="relative h-full rounded-3xl p-8 flex flex-col gap-7 border transition-all duration-400 group-hover:border-amber-500/30"
              style={{ background: 'hsl(var(--card) / 0.65)', backdropFilter: 'blur(16px)', border: '1px solid hsl(var(--border))' }}
            >
              {/* Icon area */}
              <div className="flex items-start justify-between">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-amber-950 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #FFDD00, #F59E0B)', boxShadow: '0 8px 28px rgba(245,158,11,0.35)' }}
                  >
                    <Coffee size={28} />
                  </div>
                  <div className="absolute -inset-2 rounded-3xl blur-xl bg-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <Heart size={18} className="text-muted-foreground/30 group-hover:text-amber-400/60 transition-colors duration-300 mt-1" />
              </div>

              <div>
                <h3 className="text-2xl font-bold font-display tracking-wide mb-2">Buy Me a Coffee</h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  Every coffee keeps the app ad-free and funds new features — AI upgrades, new themes, and more. No subscription. No pressure. Purely optional.
                </p>
              </div>

              {/* Feature list */}
              <ul className="flex flex-col gap-2">
                {['Keeps the app ad-free', 'Funds new anime themes', 'Supports AI improvements'].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* BMC Button */}
              <a
                href="https://buymeacoffee.com/mkr_infinity"
                target="_blank"
                rel="noreferrer"
                data-testid="button-buy-coffee"
                className="mt-auto"
              >
                <motion.button
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.975 }}
                  className="relative w-full py-4 rounded-2xl font-bold font-display text-base tracking-widest uppercase flex items-center justify-center gap-3 overflow-hidden text-amber-950"
                  style={{
                    background: 'linear-gradient(135deg, #FFDD00 0%, #F59E0B 50%, #F97316 100%)',
                    boxShadow: '0 0 28px rgba(255,221,0,0.35), 0 4px 16px rgba(0,0,0,0.25)',
                  }}
                >
                  {/* Button shine */}
                  <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <Coffee size={19} className="relative z-10" />
                  <span className="relative z-10">Buy Me a Coffee</span>
                </motion.button>
              </a>
            </div>
          </motion.div>

          {/* ── GitHub Contributions card ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="group relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(circle at 70% 30%, rgba(139,92,246,0.1), transparent 65%)' }}
            />

            <div
              className="relative h-full rounded-3xl p-8 flex flex-col gap-7 border transition-all duration-400 group-hover:border-primary/25"
              style={{ background: 'hsl(var(--card) / 0.65)', backdropFilter: 'blur(16px)', border: '1px solid hsl(var(--border))' }}
            >
              {/* Icon area */}
              <div className="flex items-start justify-between">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110"
                    style={{ background: 'linear-gradient(135deg, #1f2937, #374151)', boxShadow: '0 8px 28px rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.2)' }}
                  >
                    <Github size={28} />
                  </div>
                </div>

                {/* Repo tag */}
                <span className="text-[10px] font-bold font-display tracking-widest px-2.5 py-1 rounded-full border border-primary/25 text-primary bg-primary/8">
                  OPEN SOURCE
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold font-display tracking-wide mb-2">Contribute on GitHub</h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  The entire codebase is open. Star it to show support, report bugs, suggest ideas, or submit a pull request to make Revision Master better for everyone.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2.5 mt-auto">
                {githubActions.map(({ icon: Icon, label, sub, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group/btn"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200 group-hover/btn:border-opacity-60"
                      style={{
                        background: 'hsl(var(--background) / 0.4)',
                        border: '1px solid hsl(var(--border))',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = `${color}40`;
                        (e.currentTarget as HTMLDivElement).style.background = `${color}08`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = '';
                        (e.currentTarget as HTMLDivElement).style.background = 'hsl(var(--background) / 0.4)';
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                      >
                        <Icon size={16} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold font-display text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                      <svg className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
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
