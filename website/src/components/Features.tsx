import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, BookOpen, Target, Layers, BarChart3, Timer, WifiOff, Flame, Check } from 'lucide-react';

import homeImg        from '@assets/home_1777901812087.jpg';
import flashcardsImg  from '@assets/flashcards_1777901812088.jpg';
import aikeyImg       from '@assets/aikey_1777901812096.jpg';
import testsImg       from '@assets/tests_1777901812105.jpg';
import formulasImg    from '@assets/formulas_1777901812106.jpg';
import analyticsImg   from '@assets/analytics_1777901812107.jpg';
import progressImg    from '@assets/progress_1777901812108.jpg';
import exportOptionsImg from '@assets/export-options_1777901812101.jpg';

const features = [
  {
    num: '01', tag: 'AI', icon: Bot,
    title: 'MKR AI',
    subtitle: 'Your Study Companion',
    desc: 'Powered by Google Gemini, the built-in AI generates complete flashcard decks from any topic in seconds. Ask questions, get explanations, or build entire subject libraries instantly.',
    bullets: ['Generate decks from any topic', 'Context-aware Q&A', 'Powered by Gemini 2.0'],
    accent: '#10B981', img: aikeyImg,
  },
  {
    num: '02', tag: 'STUDY', icon: BookOpen,
    title: 'Smart Subjects',
    subtitle: 'Organised Your Way',
    desc: 'Custom icons, colors, and live completion bars per subject. Organize everything the way your brain thinks — visual, personal, and always at a glance.',
    bullets: ['Custom icons & colors', 'Completion progress bars', 'Subject-level analytics'],
    accent: '#8B5CF6', img: homeImg,
  },
  {
    num: '03', tag: 'RECALL', icon: Layers,
    title: 'Active Recall',
    subtitle: 'Flashcards That Stick',
    desc: 'Text, images, and LaTeX-rendered formulas on every card. Flip, rate, and repeat. Built for long-term memory formation using proven recall techniques.',
    bullets: ['Full LaTeX rendering', 'Image card support', 'Difficulty-based rating'],
    accent: '#A78BFA', img: flashcardsImg,
  },
  {
    num: '04', tag: 'ANALYTICS', icon: BarChart3,
    title: 'Deep Analytics',
    subtitle: 'See Your Progress',
    desc: 'Accuracy heatmaps, study-streak charts, and time-per-session graphs across every subject. Your progress is always visible, measurable, and motivating.',
    bullets: ['Accuracy heatmaps', 'Streak calendar', 'Per-session timing'],
    accent: '#6366F1', img: analyticsImg,
  },
  {
    num: '05', tag: 'EXAM', icon: Target,
    title: 'Exam Simulation',
    subtitle: 'Pressure Makes Perfect',
    desc: 'Custom mock tests that recreate real exam conditions — randomised order, time pressure, and instant scoring with a full post-test breakdown.',
    bullets: ['Randomised question order', 'Timed exam mode', 'Instant results & review'],
    accent: '#F97316', img: testsImg,
  },
  {
    num: '06', tag: 'FORMULAS', icon: Timer,
    title: 'Formula Library',
    subtitle: 'Master Every Equation',
    desc: 'Store and study LaTeX-rendered formulas organized by subject. Review equations with the same active-recall system as flashcards.',
    bullets: ['Full LaTeX rendering', 'Subject organisation', 'Integrated recall system'],
    accent: '#F59E0B', img: formulasImg,
  },
  {
    num: '07', tag: 'XP', icon: Flame,
    title: 'Streaks & XP',
    subtitle: 'Level Up Your Learning',
    desc: 'Earn XP every session, maintain daily streaks, and level up. A full gamification loop designed to make studying genuinely rewarding.',
    bullets: ['Daily streak tracking', 'XP & level system', 'Progress milestones'],
    accent: '#EC4899', img: progressImg,
  },
  {
    num: '08', tag: 'PRIVACY', icon: WifiOff,
    title: 'Offline & Private',
    subtitle: 'Your Data, Your Device',
    desc: 'Zero internet required. Zero cloud. Everything lives on your device, exportable to JSON at any time. No account. No tracking. No compromise.',
    bullets: ['Fully offline', 'JSON export anytime', 'No account required'],
    accent: '#64748B', img: exportOptionsImg,
  },
];

export function Features() {
  const [active, setActive] = useState(0);
  const f = features[active];

  return (
    <section id="features" className="py-28 md:py-36 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-6 md:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-16 md:mb-20"
        >
          <p className="text-xs font-bold font-display tracking-[0.22em] uppercase text-primary mb-4">Features</p>
          <h2
            className="font-display font-black tracking-tight text-foreground max-w-xl"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.05 }}
          >
            Eight tools. One mission:{' '}
            <span
              style={{
                background: 'linear-gradient(125deg, #8B5CF6, #22D3EE)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}
            >
              ace the exam.
            </span>
          </h2>
        </motion.div>

        {/* Desktop split view */}
        <div className="hidden lg:grid lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr] gap-5 max-w-6xl items-start">

          {/* Feature list */}
          <div className="sticky top-24 flex flex-col divide-y divide-border/50 rounded-2xl overflow-hidden border border-border/60"
            style={{ background: 'hsl(var(--card)/0.5)', backdropFilter: 'blur(16px)' }}>
            {features.map((feat, idx) => (
              <motion.button
                key={feat.num}
                onMouseEnter={() => setActive(idx)}
                onClick={() => setActive(idx)}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="relative group flex items-center gap-3.5 px-4 py-3.5 text-left transition-colors duration-150"
                style={{
                  background: active === idx ? 'hsl(var(--primary)/0.08)' : 'transparent',
                }}
              >
                {/* Left active bar */}
                <div
                  className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full transition-opacity duration-200"
                  style={{ background: 'hsl(var(--primary))', opacity: active === idx ? 1 : 0 }}
                />

                {/* Icon */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
                  style={{
                    background: active === idx ? `${feat.accent}20` : 'hsl(var(--muted)/0.5)',
                  }}
                >
                  <feat.icon
                    size={15}
                    style={{ color: active === idx ? feat.accent : 'hsl(var(--muted-foreground))' }}
                    strokeWidth={2}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[11px] font-bold font-display tracking-[0.18em] uppercase mb-0.5 transition-colors"
                    style={{ color: active === idx ? feat.accent : 'hsl(var(--muted-foreground))' }}
                  >
                    {feat.tag}
                  </p>
                  <p
                    className="font-semibold text-sm leading-tight transition-colors"
                    style={{ color: active === idx ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))' }}
                  >
                    {feat.title}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="rounded-2xl overflow-hidden border border-border/60"
              style={{ background: 'hsl(var(--card)/0.5)', backdropFilter: 'blur(16px)' }}
            >
              {/* Colour accent bar */}
              <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${f.accent}, hsl(var(--primary)))` }} />

              <div className="grid md:grid-cols-[1fr_200px] xl:grid-cols-[1fr_230px]">
                {/* Content */}
                <div className="p-8 flex flex-col gap-5">
                  <div>
                    <p
                      className="text-[10px] font-black font-display tracking-[0.22em] uppercase mb-2"
                      style={{ color: f.accent }}
                    >
                      {f.tag}
                    </p>
                    <h3 className="font-display font-black text-2xl tracking-tight text-foreground mb-1">
                      {f.title}
                    </h3>
                    <p className="text-sm font-semibold" style={{ color: f.accent }}>{f.subtitle}</p>
                  </div>

                  <p className="text-sm leading-[1.8] text-muted-foreground">{f.desc}</p>

                  <ul className="flex flex-col gap-2">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3 text-sm text-foreground/75">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{ background: `${f.accent}18` }}
                        >
                          <Check size={9} strokeWidth={3} style={{ color: f.accent }} />
                        </div>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Phone preview */}
                <div className="flex items-center justify-center p-6 border-l border-border/40">
                  <div className="relative w-[140px]">
                    <div
                      className="absolute inset-[-20%] rounded-full blur-[40px] opacity-20"
                      style={{ backgroundColor: f.accent }}
                    />
                    <div
                      className="relative w-full aspect-[9/18.5] rounded-[1.6rem] overflow-hidden"
                      style={{
                        border: `1px solid ${f.accent}35`,
                        boxShadow: `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset`,
                        background: 'hsl(var(--card))',
                      }}
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-[hsl(var(--card))] rounded-b-lg z-10" />
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={f.img}
                          src={f.img}
                          alt={f.title}
                          className="w-full h-full object-cover object-top"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
          {features.map((feat, idx) => (
            <motion.div
              key={feat.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              className="relative rounded-xl p-5 overflow-hidden border border-border/50"
              style={{ background: 'hsl(var(--card)/0.5)', backdropFilter: 'blur(12px)' }}
            >
              <div className="absolute top-0 inset-x-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${feat.accent}, hsl(var(--primary)))` }} />
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${feat.accent}18` }}
              >
                <feat.icon size={16} style={{ color: feat.accent }} strokeWidth={2} />
              </div>
              <p className="font-bold font-display text-sm text-foreground mb-1">{feat.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
