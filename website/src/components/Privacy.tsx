import { motion } from 'framer-motion';
import { Database, EyeOff, FileJson } from 'lucide-react';

const items = [
  {
    icon: Database,
    title: 'Zero Cloud Storage',
    desc: 'Your subjects, flashcards, and progress are stored strictly on your device. No server ever sees your data.',
    color: '#22D3EE',
  },
  {
    icon: EyeOff,
    title: 'No Tracking',
    desc: 'Zero analytics. Zero cookies. Zero hidden trackers. Your study habits belong to you alone.',
    color: '#8B5CF6',
  },
  {
    icon: FileJson,
    title: 'Full Data Export',
    desc: 'Export your entire database as JSON at any moment. True ownership — we never lock you in.',
    color: '#F472B6',
  },
];

export function Privacy() {
  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      {/* Background energy */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-secondary/5 dark:bg-secondary/8 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-[2px] w-8 bg-accent" />
            <span className="text-xs font-bold tracking-widest uppercase text-accent font-display">Privacy</span>
            <div className="h-[2px] w-8 bg-accent" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 font-display">
            Total{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #22D3EE, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Privacy.
            </span>{' '}
            True Ownership.
          </h2>
          <p className="text-lg text-muted-foreground">
            Built from the ground up around a single belief — your study data is yours.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden"
            >
              {/* Animated border */}
              <div
                className="absolute inset-0 rounded-2xl opacity-30 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${item.color}40, transparent 60%)` }}
              />
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ boxShadow: `inset 0 0 0 1.5px ${item.color}50, 0 0 30px ${item.color}20` }}
              />

              {/* Sweeping light on hover */}
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, transparent, ${item.color}20, transparent)` }}
              />

              <div className="relative bg-card border border-border group-hover:border-transparent rounded-2xl p-8 z-10 flex flex-col items-center text-center h-full transition-all duration-300">
                {/* Icon */}
                <motion.div
                  className="w-18 h-18 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `radial-gradient(circle, ${item.color}25, ${item.color}08)`,
                    border: `1.5px solid ${item.color}40`,
                    color: item.color,
                    width: '4.5rem',
                    height: '4.5rem',
                  }}
                >
                  <item.icon size={28} />
                </motion.div>

                <h3 className="text-xl font-bold mb-3 font-display tracking-wide">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
