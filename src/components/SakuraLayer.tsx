import React, { useMemo } from "react";

interface SakuraLayerProps {
  count?: number;
  className?: string;
}

/** Decorative falling sakura petals layer (shared by Onboarding + Login). */
const SakuraLayer: React.FC<SakuraLayerProps> = ({ count = 14, className = "" }) => {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 8,
        scale: 0.6 + Math.random() * 0.9,
        opacity: 0.55 + Math.random() * 0.4,
      })),
    [count],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {petals.map((p) => (
        <span
          key={p.id}
          className="sakura"
          style={{
            left: `${p.left}%`,
            top: "-10%",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `scale(${p.scale})`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default SakuraLayer;
