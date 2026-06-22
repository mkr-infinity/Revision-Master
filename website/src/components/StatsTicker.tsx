import { motion } from 'framer-motion';

const items = [
  'AI-Powered Flashcards',
  '12 App Screens',
  '6 Anime Themes',
  '100% Free Forever',
  'Offline First',
  'No Account Needed',
  'LaTeX Formula Support',
  'Streaks & XP System',
  'Open Source',
  'JSON Export',
];

export function StatsTicker() {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-4 border-y border-border/30">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-0 whitespace-nowrap will-change-transform"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 32, ease: 'linear' }}
      >
        {doubled.map((label, i) => (
          <span key={i} className="inline-flex items-center text-[11px] font-bold font-display tracking-[0.18em] uppercase text-muted-foreground/50">
            <span className="px-8">{label}</span>
            <span className="w-1 h-1 rounded-full bg-border flex-shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
