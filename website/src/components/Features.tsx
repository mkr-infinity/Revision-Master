import { motion } from 'framer-motion';
import { Bot, BookOpen, Target, Layers, BarChart3, Timer, WifiOff, Flame } from 'lucide-react';

type Feature = {
  num: string;
  tag: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  bullets?: string[];
  from: string;
  to: string;
  glow: string;
  span: string;
  accent?: string;
};

const features: Feature[] = [
  {
    num: '01',
    tag: 'AI',
    icon: Bot,
    title: 'MKR AI — Your Study Companion',
    desc: 'Powered by Google Gemini, the built-in AI assistant generates complete flashcard decks from any topic in seconds. Ask it questions, get explanations, or create entire subject libraries without typing a single card.',
    bullets: ['Generate decks from topic names', 'Context-aware Q&A', 'Powered by Gemini 2.0'],
    from: '#10B981',
    to: '#14B8A6',
    glow: '16,185,129',
    span: 'col-span-12 md:col-span-8',
  },
  {
    num: '02',
    tag: 'STUDY',
    icon: BookOpen,
    title: 'Smart Subjects',
    desc: 'Custom icons, colors, and live completion bars. Organize every subject the way your brain thinks.',
    from: '#3B82F6',
    to: '#22D3EE',
    glow: '59,130,246',
    span: 'col-span-12 md:col-span-4',
  },
  {
    num: '03',
    tag: 'RECALL',
    icon: Layers,
    title: 'Active Recall Flashcards',
    desc: 'Text, images, and LaTeX-rendered formulas on every card. Flip, rate, and repeat until it sticks. Built for permanent memory formation.',
    from: '#8B5CF6',
    to: '#F472B6',
    glow: '139,92,246',
    span: 'col-span-12 md:col-span-4',
  },
  {
    num: '04',
    tag: 'ANALYTICS',
    icon: BarChart3,
    title: 'Deep Analytics & Progress Tracking',
    desc: 'Accuracy heatmaps, study-streak charts, subject-by-subject breakdowns, and time-per-session graphs. Your improvement is always visible and measurable.',
    bullets: ['Accuracy heatmaps', 'Streak calendar', 'Subject breakdowns', 'Session timing'],
    from: '#6366F1',
    to: '#8B5CF6',
    glow: '99,102,241',
    span: 'col-span-12 md:col-span-8',
  },
  {
    num: '05',
    tag: 'EXAM',
    icon: Target,
    title: 'Exam Simulation',
    desc: 'Custom mock tests that recreate real exam conditions — randomized order, time pressure, and instant scoring.',
    from: '#F97316',
    to: '#EF4444',
    glow: '249,115,22',
    span: 'col-span-12 md:col-span-4',
  },
  {
    num: '06',
    tag: 'FOCUS',
    icon: Timer,
    title: 'Focus Timer',
    desc: 'Built-in Pomodoro-style focus sessions. Set a target, start the timer, and lock into deep study mode.',
    from: '#F59E0B',
    to: '#F97316',
    glow: '245,158,11',
    span: 'col-span-12 md:col-span-4',
  },
  {
    num: '07',
    tag: 'XP',
    icon: Flame,
    title: 'Streaks, XP & Levels',
    desc: 'Earn XP for every session, maintain daily streaks, and level up — a full gamification loop to make studying genuinely addictive.',
    from: '#EC4899',
    to: '#8B5CF6',
    glow: '236,72,153',
    span: 'col-span-12 md:col-span-4',
  },
  {
    num: '08',
    tag: 'PRIVACY',
    icon: WifiOff,
    title: 'Offline. Private. Yours.',
    desc: 'Zero internet required. Zero cloud. All data lives on your device and can be exported to JSON at any time. No account. No tracking.',
    from: '#64748B',
    to: '#94A3B8',
    glow: '100,116,139',
    span: 'col-span-12 md:col-span-4',
  },
];

function FeatureCard({ f, idx }: { f: Feature; idx: number }) {
  const isLarge = f.span.includes('col-span-8');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, delay: idx * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -5 }}
      className={`group relative ${f.span} rounded-2xl overflow-hidden cursor-default`}
    >
      {/* Base glass */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-500"
        style={{
          background: 'hsl(var(--card) / 0.55)',
          backdropFilter: 'blur(16px)',
          border: `1px solid hsl(var(--border))`,
        }}
      />

      {/* Hover color radial */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(circle at 20% 20%, rgba(${f.glow},0.14) 0%, transparent 60%)` }}
      />

      {/* Top gradient line */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `linear-gradient(90deg, transparent 0%, ${f.from} 30%, ${f.to} 70%, transparent 100%)` }}
      />

      <div className={`relative z-10 flex gap-6 ${isLarge ? 'flex-row items-start' : 'flex-col'} p-6 md:p-7 h-full`}>

        {/* Left (large) or top (small): icon + number */}
        <div className={`flex ${isLarge ? 'flex-col items-start gap-4 flex-shrink-0' : 'items-start justify-between'}`}>
          {/* Number badge */}
          <span
            className="text-[10px] font-black font-display tracking-[0.18em] px-2 py-0.5 rounded-full border"
            style={{ color: f.from, borderColor: `${f.from}35`, background: `${f.from}10` }}
          >
            {f.tag}
          </span>

          {/* Icon bubble */}
          <div
            className="relative flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{ background: `linear-gradient(135deg, ${f.from}, ${f.to})`, boxShadow: `0 6px 24px rgba(${f.glow},0.35)` }}
          >
            <f.icon className="w-6 h-6 text-white" />
          </div>

          {/* Number on large cards */}
          {isLarge && (
            <span className="text-5xl font-black font-display tracking-tight opacity-[0.055] select-none mt-auto">
              {f.num}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2.5 flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold font-display tracking-wide text-foreground leading-tight">
            {f.title}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{f.desc}</p>

          {/* Bullet points (large cards only) */}
          {f.bullets && (
            <ul className="flex flex-wrap gap-2 mt-1">
              {f.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-center gap-1.5 text-xs font-semibold font-display px-2.5 py-1 rounded-full"
                  style={{ background: `rgba(${f.glow},0.12)`, color: f.from }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: f.from }}
                  />
                  {b}
                </li>
              ))}
            </ul>
          )}

          {/* Bottom accent bar */}
          {!isLarge && (
            <div className="flex gap-1.5 mt-auto pt-3">
              <div className="h-0.5 w-6 rounded-full opacity-30 group-hover:opacity-80 transition-opacity"
                style={{ backgroundColor: f.to }} />
              <div className="h-0.5 w-3 rounded-full opacity-20 group-hover:opacity-50 transition-opacity"
                style={{ backgroundColor: f.to }} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-28 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

      <div className="container mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-primary" />
            <span className="text-xs font-bold font-display tracking-widest uppercase text-primary">Features</span>
            <div className="h-px w-10 bg-primary" />
          </div>
          <h2
            className="font-display font-bold mb-4 tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          >
            Everything You Need to{' '}
            <span style={{
              background: 'linear-gradient(120deg, #8B5CF6, #22D3EE)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Ace Any Exam
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Eight tools engineered to maximise retention, eliminate exam anxiety, and make studying feel like playing your favourite game.
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-4 md:gap-5 max-w-6xl mx-auto">
          {features.map((f, idx) => (
            <FeatureCard key={f.num} f={f} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
