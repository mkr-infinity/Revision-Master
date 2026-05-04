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
  { img: homeImg,         title: 'Home Dashboard' },
  { img: flashcardsImg,   title: 'Flashcards' },
  { img: testsImg,        title: 'Mock Tests' },
  { img: formulasImg,     title: 'Formulas' },
  { img: analyticsImg,    title: 'Analytics' },
  { img: progressImg,     title: 'Progress' },
  { img: aikeyImg,        title: 'AI Buddy' },
  { img: onboardingImg,   title: 'Onboarding' },
  { img: settingsImg,     title: 'Settings' },
  { img: exportOptionsImg,title: 'Export Options' },
  { img: exportingImg,    title: 'Exporting' },
  { img: binImg,          title: 'Recycle Bin' },
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
    <section id="screenshots" className="py-28 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/25 to-transparent" />

      <div className="container mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-secondary" />
            <span className="text-xs font-bold font-display tracking-widest uppercase text-secondary">Gallery</span>
            <div className="h-px w-10 bg-secondary" />
          </div>
          <h2
            className="font-display font-bold mb-4 tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)' }}
          >
            Glimpse the{' '}
            <span style={{
              background: 'linear-gradient(120deg, #22D3EE, #F472B6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Experience
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every screen hand-crafted for deep focus and beautiful learning.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden px-4 py-10" ref={emblaRef}>
            <div className="flex -ml-3 items-end">
              {shots.map((shot, i) => {
                const isActive = i === selected;
                return (
                  <motion.div
                    key={i}
                    className="flex-[0_0_72%] sm:flex-[0_0_44%] md:flex-[0_0_30%] lg:flex-[0_0_22%] pl-3 transition-all duration-500"
                    style={{
                      transform: isActive ? 'scale(1.06)' : 'scale(0.88)',
                      opacity: isActive ? 1 : 0.45,
                      filter: isActive ? 'blur(0px)' : 'blur(1.5px)',
                    }}
                  >
                    <div className="relative w-full aspect-[9/19.5] group">
                      {/* Phone frame */}
                      <div
                        className="relative w-full h-full rounded-[2.2rem] overflow-hidden"
                        style={{
                          border: isActive
                            ? '3px solid rgba(139,92,246,0.6)'
                            : '2px solid rgba(255,255,255,0.06)',
                          boxShadow: isActive
                            ? '0 24px 60px rgba(139,92,246,0.35), 0 6px 20px rgba(0,0,0,0.5)'
                            : '0 8px 20px rgba(0,0,0,0.3)',
                          background: 'hsl(var(--card))',
                        }}
                      >
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-card rounded-b-xl z-20" />

                        <img
                          src={shot.img}
                          alt={shot.title}
                          className="w-full h-full object-cover object-top"
                        />

                        {/* Active glow */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-primary/15 blur-xl"
                            animate={{ opacity: [0.3, 0.7, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2.5 }}
                          />
                        )}

                        {/* Title overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5">
                          <span className="text-white text-xs font-bold font-display tracking-wide px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20">
                            {shot.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
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
              className={`absolute top-1/2 -translate-y-1/2 ${side} w-11 h-11 rounded-full flex items-center justify-center z-20 transition-all duration-200 hover:scale-110 active:scale-95`}
              style={{
                background: 'hsl(var(--card) / 0.75)',
                backdropFilter: 'blur(8px)',
                border: '1px solid hsl(var(--border))',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              <Icon size={22} className="text-foreground" />
            </button>
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {shots.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className="transition-all duration-300"
              style={{
                width: i === selected ? '1.5rem' : '0.4rem',
                height: '0.4rem',
                borderRadius: '9999px',
                background: i === selected
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--muted-foreground) / 0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
