import { motion } from 'framer-motion';

const themes = [
  {
    name: 'Demon Slayer',    subtitle: 'Crimson Flame',    icon: '⚔️',
    primary: '#DC2626',
    palette: ['#7F1D1D', '#DC2626', '#EF4444', '#22C55E'],
  },
  {
    name: 'My Hero Academia', subtitle: 'Plus Ultra',       icon: '💥',
    primary: '#2563EB',
    palette: ['#1E3A8A', '#2563EB', '#60A5FA', '#EAB308'],
  },
  {
    name: 'Naruto',          subtitle: 'Rasengan Orange',  icon: '🌀',
    primary: '#EA580C',
    palette: ['#7C2D12', '#EA580C', '#FB923C', '#FACC15'],
  },
  {
    name: 'Jujutsu Kaisen',  subtitle: 'Cursed Energy',    icon: '🔮',
    primary: '#7C3AED',
    palette: ['#2E1065', '#7C3AED', '#A78BFA', '#06B6D4'],
  },
  {
    name: 'Bleach',          subtitle: 'Zanpakuto Cyan',   icon: '🌊',
    primary: '#0891B2',
    palette: ['#164E63', '#0891B2', '#67E8F9', '#E5E7EB'],
  },
  {
    name: 'Vinland Saga',    subtitle: 'Norse Frost',      icon: '🪓',
    primary: '#0D9488',
    palette: ['#134E4A', '#0D9488', '#5EEAD4', '#D4A574'],
  },
];

export function Themes() {
  return (
    <section id="themes" className="py-28 md:py-36 relative">
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
          <p className="text-xs font-bold font-display tracking-[0.22em] uppercase text-primary mb-4">Worlds</p>
          <h2
            className="font-display font-black tracking-tight text-foreground max-w-xl"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.05 }}
          >
            Choose your{' '}
            <span style={{
              background: 'linear-gradient(125deg, #8B5CF6, #F472B6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              world.
            </span>
          </h2>
          <p className="text-muted-foreground mt-4 text-base leading-relaxed max-w-md">
            Six handcrafted anime themes that transform every color, glow, and detail in the app.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl">
          {themes.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl overflow-hidden border border-border/50 cursor-default"
              style={{ background: 'hsl(var(--card)/0.55)', backdropFilter: 'blur(14px)' }}
            >
              {/* Palette swatch bar */}
              <div className="flex h-1.5">
                {t.palette.map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                ))}
              </div>

              {/* Hover tint */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${t.primary}14, transparent 70%)` }}
              />

              <div className="p-5 md:p-6 flex flex-col items-center gap-3 text-center relative z-10">
                {/* Icon orb */}
                <div className="relative w-14 h-14 md:w-16 md:h-16">
                  <div
                    className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-400"
                    style={{ backgroundColor: t.primary }}
                  />
                  <div
                    className="relative w-full h-full rounded-full flex items-center justify-center text-xl md:text-2xl border border-white/8"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, ${t.primary}40, hsl(var(--card)) 70%)`,
                      boxShadow: `0 4px 20px ${t.primary}30`,
                    }}
                  >
                    {t.icon}
                  </div>
                </div>

                {/* Palette dots */}
                <div className="flex gap-1.5">
                  {t.palette.map((c, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full border border-white/10"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                {/* Name */}
                <div>
                  <p className="font-bold font-display text-sm tracking-wide text-foreground leading-tight">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground tracking-widest uppercase mt-0.5">{t.subtitle}</p>
                </div>
              </div>

              {/* Bottom accent line on hover */}
              <div
                className="absolute bottom-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${t.primary}80, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
