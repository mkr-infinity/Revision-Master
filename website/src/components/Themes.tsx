import { motion } from 'framer-motion';

const themes = [
  { name: 'Demon Slayer',    desc: 'Crimson Flame',   color: '#DC2626', accent: '#22C55E', icon: '⚔️' },
  { name: 'My Hero Academia',desc: 'Plus Ultra',      color: '#2563EB', accent: '#EAB308', icon: '💥' },
  { name: 'Naruto',          desc: 'Rasengan Orange', color: '#EA580C', accent: '#FACC15', icon: '🌀' },
  { name: 'Jujutsu Kaisen',  desc: 'Cursed Energy',   color: '#7C3AED', accent: '#06B6D4', icon: '🔮' },
  { name: 'Bleach',          desc: 'Zanpakuto Cyan',  color: '#0891B2', accent: '#E5E7EB', icon: '🌊' },
  { name: 'Vinland Saga',    desc: 'Norse Frost',     color: '#0D9488', accent: '#D4A574', icon: '🪓' },
];

export function Themes() {
  return (
    <section id="themes" className="py-28 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />

      <div className="container mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-accent" />
            <span className="text-xs font-bold font-display tracking-widest uppercase text-accent">Worlds</span>
            <div className="h-px w-10 bg-accent" />
          </div>
          <h2
            className="font-display font-bold mb-4 tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          >
            Choose Your{' '}
            <span style={{
              background: 'linear-gradient(120deg, #8B5CF6, #F472B6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              World
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Six handcrafted anime-world themes that transform every color, glow, and detail in the app.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-7 max-w-4xl mx-auto">
          {themes.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.75, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5, type: 'spring', stiffness: 120 }}
              whileHover={{ scale: 1.05, y: -6 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: 'hsl(var(--card) / 0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid hsl(var(--border))',
              }}
            >
              {/* Hover color fill */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: `radial-gradient(circle at 50% 30%, ${t.color}22, transparent 65%)` }}
              />

              <div className="relative z-10 p-6 flex flex-col items-center gap-4">
                {/* Orb */}
                <div className="relative w-20 h-20 md:w-24 md:h-24">
                  {/* Pulse rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full border opacity-0 group-hover:opacity-100"
                    style={{ borderColor: t.color }}
                    animate={{ scale: [1, 1.5, 1.8], opacity: [0.6, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border opacity-0 group-hover:opacity-100"
                    style={{ borderColor: t.color }}
                    animate={{ scale: [1, 1.7, 2.2], opacity: [0.4, 0.2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut', delay: 0.5 }}
                  />

                  {/* Outer glow */}
                  <div
                    className="absolute inset-[-2px] rounded-full blur-lg opacity-35 group-hover:opacity-75 transition-opacity duration-500"
                    style={{ backgroundColor: t.color }}
                  />

                  {/* Orb face */}
                  <div
                    className="relative w-full h-full rounded-full flex items-center justify-center text-2xl md:text-3xl overflow-hidden border border-white/10"
                    style={{
                      background: `radial-gradient(circle at 35% 30%, ${t.color}50 0%, ${t.color}12 50%, transparent 80%), hsl(var(--card))`,
                      boxShadow: `0 6px 24px ${t.color}40`,
                    }}
                  >
                    {/* Animated core */}
                    <motion.div
                      className="absolute w-5 h-5 rounded-full blur-md"
                      style={{ background: `radial-gradient(circle, #fff 0%, ${t.color} 50%, transparent 100%)` }}
                      animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.8, 1.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 3 + idx * 0.3, ease: 'easeInOut' }}
                    />
                    <span className="relative z-10 select-none">{t.icon}</span>
                  </div>
                </div>

                {/* Label */}
                <div className="text-center">
                  <h3
                    className="font-bold font-display text-base tracking-wide text-foreground group-hover:transition-colors duration-200"
                    style={{ '--hover-color': t.color } as React.CSSProperties}
                  >
                    {t.name}
                  </h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">{t.desc}</p>
                </div>
              </div>

              {/* Top glow bar on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${t.color}, ${t.accent}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
