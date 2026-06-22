import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import homeImg        from '@assets/home_1777901812087.jpg';
import flashcardsImg  from '@assets/flashcards_1777901812088.jpg';
import binImg         from '@assets/bin_1777901812090.jpg';
import exportingImg   from '@assets/exporting_1777901812092.jpg';
import aikeyImg       from '@assets/aikey_1777901812096.jpg';
import settingsImg    from '@assets/settings_1777901812099.jpg';
import exportOptionsImg from '@assets/export-options_1777901812101.jpg';
import onboardingImg  from '@assets/onboarding_1777901812103.jpg';
import testsImg       from '@assets/tests_1777901812105.jpg';
import formulasImg    from '@assets/formulas_1777901812106.jpg';
import analyticsImg   from '@assets/analytics_1777901812107.jpg';
import progressImg    from '@assets/progress_1777901812108.jpg';

const shots = [
  { img: homeImg,          title: 'Home Dashboard',  color: '#8B5CF6' },
  { img: flashcardsImg,    title: 'Flashcards',       color: '#10B981' },
  { img: testsImg,         title: 'Mock Tests',       color: '#F97316' },
  { img: formulasImg,      title: 'Formulas',         color: '#6366F1' },
  { img: analyticsImg,     title: 'Analytics',        color: '#EC4899' },
  { img: progressImg,      title: 'Progress',         color: '#F59E0B' },
  { img: aikeyImg,         title: 'AI Buddy',         color: '#14B8A6' },
  { img: onboardingImg,    title: 'Onboarding',       color: '#8B5CF6' },
  { img: settingsImg,      title: 'Settings',         color: '#64748B' },
  { img: exportOptionsImg, title: 'Export Options',   color: '#F97316' },
  { img: exportingImg,     title: 'Exporting',        color: '#22D3EE' },
  { img: binImg,           title: 'Recycle Bin',      color: '#EF4444' },
];

export function Screenshots() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
  const [selected, setSelected] = useState(0);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <section id="screenshots" className="py-32 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />

      <div className="container mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-10" style={{ background: '#F97316' }} />
            <span className="text-xs font-bold font-display tracking-widest uppercase" style={{ color: '#F97316' }}>Gallery</span>
            <div className="h-px w-10" style={{ background: '#F97316' }} />
          </div>
          <h2
            className="font-display font-bold mb-5 tracking-tight"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)' }}
          >
            Glimpse the{' '}
            <span style={{
              background: 'linear-gradient(120deg, #F97316, #F472B6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Experience
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            Every screen hand-crafted for deep focus and beautiful learning.
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden px-4 py-12" ref={emblaRef}>
            <div className="flex -ml-3 items-end">
              {shots.map((shot, i) => {
                const isActive = i === selected;
                return (
                  <div
                    key={i}
                    className="flex-[0_0_72%] sm:flex-[0_0_44%] md:flex-[0_0_30%] lg:flex-[0_0_22%] pl-3 transition-all duration-500"
                    style={{
                      transform: isActive ? 'scale(1.08)' : 'scale(0.86)',
                      opacity: isActive ? 1 : 0.38,
                      filter: isActive ? 'blur(0px)' : 'blur(2px)',
                    }}
                  >
                    <div className="relative w-full aspect-[9/19.5] flex flex-col gap-3">
                      {/* Phone frame */}
                      <div
                        className="relative w-full flex-1 rounded-[2.2rem] overflow-hidden"
                        style={{
                          border: isActive ? `3px solid ${shot.color}80` : '2px solid rgba(255,255,255,0.05)',
                          boxShadow: isActive
                            ? `0 28px 70px ${shot.color}40, 0 8px 24px rgba(0,0,0,0.55)`
                            : '0 8px 20px rgba(0,0,0,0.28)',
                          background: 'hsl(var(--card))',
                        }}
                      >
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-card rounded-b-xl z-20" />

                        <img src={shot.img} alt={shot.title} className="w-full h-full object-cover object-top" />

                        {/* Reflection */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/6 to-transparent pointer-events-none" />
                        )}

                        {/* Active pulse glow */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0"
                            style={{ background: `${shot.color}12`, boxShadow: `inset 0 0 40px ${shot.color}20` }}
                            animate={{ opacity: [0.5, 0.9, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                          />
                        )}
                      </div>

                      {/* Screen label — always visible when active */}
                      <div
                        className="text-center transition-all duration-500"
                        style={{ opacity: isActive ? 1 : 0 }}
                      >
                        <span
                          className="text-xs font-bold font-display tracking-wider px-3 py-1.5 rounded-full border inline-block"
                          style={{
                            color: shot.color,
                            borderColor: `${shot.color}35`,
                            background: `${shot.color}12`,
                          }}
                        >
                          {shot.title}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nav buttons */}
          {[
            { side: 'left-2 md:-left-14', onClick: prev, Icon: ChevronLeft },
            { side: 'right-2 md:-right-14', onClick: next, Icon: ChevronRight },
          ].map(({ side, onClick, Icon }) => (
            <button
              key={side}
              onClick={onClick}
              className={`absolute top-1/2 -translate-y-6 ${side} w-11 h-11 rounded-full flex items-center justify-center z-20 transition-all duration-200 hover:scale-110 active:scale-95`}
              style={{
                background: 'hsl(var(--card) / 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid hsl(var(--border))',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              <Icon size={20} className="text-foreground" />
            </button>
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {shots.map((shot, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className="transition-all duration-300"
              style={{
                width: i === selected ? '1.75rem' : '0.4rem',
                height: '0.4rem',
                borderRadius: '9999px',
                background: i === selected ? shot.color : 'hsl(var(--muted-foreground) / 0.25)',
                boxShadow: i === selected ? `0 0 8px ${shot.color}60` : 'none',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
